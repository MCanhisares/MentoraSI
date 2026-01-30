# Row Level Security (RLS) Guide

## Why RLS is Important

Row Level Security is a critical PostgreSQL/Supabase security feature that controls which rows users can access in a table. **NEVER disable RLS** - it's your primary defense against unauthorized data access.

## The Two-Client Pattern

Your app uses two different Supabase clients:

### 1. Regular Client (`createClient()`)
- Uses the **anon key** (public)
- **Subject to RLS policies**
- Used for authenticated user operations
- Alumni can only access their own data

**Use for:**
- Alumni viewing their own availability, sessions, etc.
- Admin operations (checked by RLS policies)
- Any operation where the user is authenticated

### 2. Admin Client (`createAdminClient()`)
- Uses the **service role key** (secret)
- **Bypasses RLS entirely**
- Should NEVER be exposed to the frontend
- Used for server-side operations only

**Use for:**
- Token-based public access (verification, cancellation)
- System operations that need full access
- Operations where you validate access in application code

## Current RLS Policies

### `alumni` Table
- Alumni can view/update their own data
- Checked via `auth.uid()` matching `alumni.id`

### `availability_slots` Table
- Alumni can manage their own slots
- Public can view all availability (for booking)

### `sessions` Table
- Alumni can view their own sessions
- Public can create sessions (student booking)
- Token-based operations (verify, cancel, reschedule) use **admin client**

### `invite_tokens` Table (Migration 006)
- Admins can manage all tokens
- Public can validate tokens (for signup)
- System can mark tokens as used

## Security Best Practices

### ✅ DO
- Keep RLS enabled on all tables
- Use admin client for token-based public operations
- Validate tokens in application code before using admin client
- Use regular client for authenticated user operations
- Create specific policies for each use case

### ❌ DON'T
- Disable RLS with `ALTER TABLE table_name DISABLE ROW LEVEL SECURITY`
- Create overly permissive policies like `FOR SELECT USING (true)` without good reason
- Expose the service role key to the frontend
- Use admin client when regular client with proper policies would work

## Example: Token-Based Access Pattern

```typescript
// API Route: /api/book/verify
export async function POST(request: NextRequest) {
  const { token } = await request.json();

  // Use admin client to bypass RLS
  const supabase = createAdminClient();

  // Fetch session by verification token
  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("verification_token", token)
    .single();

  // Validate token in application code
  if (!session || session.verification_token !== token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  // Proceed with verified operation
  // ...
}
```

## Applying Migrations

To apply the security fixes:

```bash
# Apply migration 006: Add RLS to invite_tokens
psql $DATABASE_URL -f supabase/migrations/006_invite_tokens_rls.sql

# Apply migration 007: Remove permissive session policies
psql $DATABASE_URL -f supabase/migrations/007_fix_session_policies.sql
```

Or use the Supabase dashboard SQL editor.

## Common Issues

### Issue: "new row violates row-level security policy"
**Solution:** You're using the regular client when you should use the admin client, OR your RLS policies don't cover this operation.

### Issue: "permission denied for table X"
**Solution:** RLS is enabled but no policies exist. Add appropriate policies or use admin client if this is a system operation.

### Issue: Can't query by token
**Solution:** Token-based queries should use admin client with application-level validation, not RLS policies.

## When to Use Which Client

| Operation | Client | Why |
|-----------|--------|-----|
| Alumni views their sessions | Regular | RLS handles authorization |
| Student books a session | Regular | "Public can create" policy |
| Verify email with token | Admin | No auth context, token validation in code |
| Cancel session with token | Admin | No auth context, token validation in code |
| Admin views all tokens | Regular | RLS admin policy handles authorization |
| Signup with invite token | Admin | Need to mark token as used |

## Summary

The key principle is: **Use RLS policies for authentication-based access, use admin client + application validation for token-based access.**

Never disable RLS. If you're tempted to disable RLS, you probably just need to:
1. Use the admin client instead, OR
2. Write better RLS policies

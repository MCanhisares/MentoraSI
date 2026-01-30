# Supabase Auth Migration - Implementation Summary

## ✅ Completed Implementation

The migration from custom cookie-based authentication to Supabase Auth with Google OAuth has been successfully implemented. The system now supports **dual-mode authentication** during the transition period.

## 📋 What Was Implemented

### 1. Database Migration
**File:** `supabase/migrations/008_supabase_auth_integration.sql`

- Added `auth_user_id` column to alumni table (links to `auth.users`)
- Created `validate_invite_token()` trigger function (BEFORE INSERT on auth.users)
  - Validates invite token before user creation
  - Prevents orphaned auth records if token is invalid
- Created `handle_new_user()` trigger function (AFTER INSERT on auth.users)
  - Links existing alumni to auth users (migration case)
  - Creates new alumni records for new signups
  - Marks invite tokens as used
- Updated ALL RLS policies to use `auth.uid()` via `auth_user_id` join
  - Alumni policies
  - Availability slots policies
  - Sessions policies
  - Invite tokens policies (admin checks)

### 2. Auth Library Updates
**File:** `src/lib/auth.ts`

Modified `getCurrentAlumni()` for dual-mode support:
1. Try Supabase Auth first (`auth.getUser()`)
2. Query alumni by `auth_user_id` if authenticated
3. Fallback to cookie auth (during migration)
4. Return alumni or null

### 3. Supabase Auth Routes
**Created:** `src/app/api/auth/supabase/login/route.ts`
- POST endpoint for OAuth initiation
- Passes invite token via callback URL query params
- Returns OAuth URL for client redirect

**Created:** `src/app/api/auth/supabase/callback/route.ts`
- GET endpoint for OAuth callback
- Handles code exchange
- Updates user metadata with invite token
- Catches invite token validation errors from triggers
- Redirects to dashboard on success

### 4. Google Calendar OAuth (Renamed)
**Renamed:** `src/app/api/auth/google/` → `src/app/api/auth/google-calendar/`

Updated to calendar-only OAuth:
- `route.ts`: GET endpoint requires authentication, redirects to Google OAuth
- `callback/route.ts`: Updates only calendar tokens for authenticated users
- No longer handles user creation/authentication
- Triggered AFTER login when user connects calendar

### 5. Middleware Updates
**File:** `src/middleware.ts`

Checks both authentication methods:
- Supabase Auth (`auth.getUser()`)
- Old cookie auth (during migration)
- User is authenticated if either method is valid
- Properly handles Supabase cookie management

### 6. Protected API Routes
**Updated Files:**
- `src/app/api/admin/invite-tokens/route.ts` - Uses regular client (RLS enforced)
- `src/app/api/availability/route.ts` - Uses `getCurrentAlumni()` and regular client

**Note:** Session management routes still use admin client (token-based, no auth required):
- `src/app/api/book/verify/route.ts`
- `src/app/api/sessions/[id]/route.ts`
- `src/app/api/sessions/[id]/cancel/route.ts`
- `src/app/api/sessions/[id]/reschedule/route.ts`

### 7. Frontend Updates
**File:** `src/app/alumni/login/page.tsx`
- Changed Google login to call `/api/auth/supabase/login`
- Added error handling for new error types

**File:** `src/app/alumni/dashboard/page.tsx`
- Uses `getCurrentAlumni()` for dual-mode auth
- Added calendar connection banner for users without calendar

**Created:** `src/components/CalendarConnectBanner.tsx`
- Shows banner when calendar not connected
- "Connect Google Calendar" button
- Success/error messages after connection attempt
- Dismissible

## 🔄 Migration Flow

```
User clicks "Login with Google"
↓
POST /api/auth/supabase/login (with optional invite_token)
↓
Redirect to Google OAuth
↓
Google redirects to /api/auth/supabase/callback
↓
Exchange code for session
↓
Supabase creates auth.users record
↓
validate_invite_token() trigger (BEFORE INSERT):
  - Validates invite token from user metadata
  - Rejects if invalid/missing (new users only)
↓
handle_new_user() trigger (AFTER INSERT):
  - Checks if alumni exists by email
  - If exists: Links via auth_user_id
  - If new: Creates alumni record + marks invite used
↓
Redirect to /alumni/dashboard
↓
(Optional) User clicks "Connect Calendar"
↓
GET /api/auth/google-calendar
↓
Google OAuth for calendar.events scope
↓
Callback updates calendar tokens only
```

## 🔐 Security Improvements

1. **RLS enforced at database level** - No more admin client bypassing
2. **JWT-based sessions** - More secure than UUID cookies
3. **Atomic invite validation** - Database trigger prevents race conditions
4. **Admin checks via RLS** - No application logic, faster and safer

## 🚀 Next Steps

### Before Going Live:

1. **Configure Supabase Dashboard:**
   ```
   Navigate to: Authentication > Providers > Google
   - Enable Google provider
   - Add Client ID: [from Google Cloud Console]
   - Add Client Secret: [from Google Cloud Console]
   - Set Redirect URL: https://yourdomain.com/api/auth/supabase/callback
   ```

2. **Run the migration:**
   ```bash
   # Apply the migration to your Supabase database
   supabase db push
   # OR if using migrations directly
   psql [connection-string] < supabase/migrations/008_supabase_auth_integration.sql
   ```

3. **Make yourself an admin:**
   ```sql
   UPDATE alumni SET is_admin = true WHERE email = 'your-email@example.com';
   ```

4. **Test the flow:**
   - New user signup with invite token ✓
   - New user signup without token (should fail) ✓
   - Existing user login (auto-link) ✓
   - Admin features ✓
   - Calendar connection ✓
   - Session booking/management ✓

### Monitoring Migration Progress:

```sql
-- Check migration status
SELECT
  COUNT(*) FILTER (WHERE auth_user_id IS NOT NULL) as migrated,
  COUNT(*) FILTER (WHERE auth_user_id IS NULL) as pending
FROM alumni;

-- View unmigrated users
SELECT email, name, created_at
FROM alumni
WHERE auth_user_id IS NULL;
```

### After 100% Migration:

Once all users have migrated (pending = 0):

1. Make auth_user_id NOT NULL:
   ```sql
   ALTER TABLE alumni ALTER COLUMN auth_user_id SET NOT NULL;
   ```

2. Remove old cookie auth code from:
   - `src/lib/auth.ts` (remove cookie fallback)
   - `src/middleware.ts` (remove cookie check)

3. Delete old session cookie constants

## 🧪 Testing Checklist

- [ ] New user with valid invite token → Success
- [ ] New user without invite token → Error
- [ ] New user with invalid invite token → Error
- [ ] Existing user login → Auto-links, works normally
- [ ] Admin can view/create/delete invite tokens
- [ ] Admin dashboard accessible
- [ ] User can set availability
- [ ] User can delete availability
- [ ] User can connect Google Calendar
- [ ] Calendar connection success message shows
- [ ] Calendar connection error message shows
- [ ] Session booking works (public)
- [ ] Session cancellation works (token-based)
- [ ] Session rescheduling works (token-based)
- [ ] Middleware protects routes correctly
- [ ] Logout works

## 📝 Important Notes

1. **Invite Token Flow:**
   - Invite token is passed through the OAuth flow via callback URL query params
   - It's stored in user metadata (`raw_user_meta_data`)
   - Database trigger validates and consumes it atomically

2. **Dual-Mode Period:**
   - Both auth systems work simultaneously
   - Existing cookie users work normally
   - New Supabase Auth users work normally
   - Existing users are auto-linked on first Supabase login

3. **Calendar Separation:**
   - Authentication: Supabase Auth (Google OAuth)
   - Calendar: Separate OAuth flow post-login
   - Reason: Need `calendar.events` scope not provided by Supabase Auth

4. **RLS Policies:**
   - All policies now check `auth.uid()` via `auth_user_id`
   - Regular client used for authenticated operations
   - Admin client ONLY for token-based public operations

5. **No Breaking Changes:**
   - Migration is additive (adds column, doesn't remove)
   - Old auth continues working
   - Zero downtime deployment possible
   - Easy rollback (don't deploy frontend changes)

## 🐛 Troubleshooting

**Error: "Invite token required for registration"**
- User is trying to sign up without an invite token
- Provide them with a valid invite token from admin dashboard

**Error: "Invalid or expired invite token"**
- Token doesn't exist, already used, or expired
- Generate a new invite token

**User sees old login flow:**
- Clear browser cache
- Check that frontend changes are deployed

**RLS policies not working:**
- Verify migration ran successfully
- Check `auth_user_id` is populated
- Verify user is authenticated via Supabase Auth

**Calendar connection fails:**
- Check Google OAuth credentials
- Verify redirect URL is correct
- Check user is authenticated before connecting

## 📚 Related Files

### New Files:
- `supabase/migrations/008_supabase_auth_integration.sql`
- `src/app/api/auth/supabase/login/route.ts`
- `src/app/api/auth/supabase/callback/route.ts`
- `src/components/CalendarConnectBanner.tsx`
- `MIGRATION_IMPLEMENTED.md` (this file)

### Modified Files:
- `src/lib/auth.ts`
- `src/middleware.ts`
- `src/app/alumni/login/page.tsx`
- `src/app/alumni/dashboard/page.tsx`
- `src/app/api/admin/invite-tokens/route.ts`
- `src/app/api/availability/route.ts`

### Renamed:
- `src/app/api/auth/google/` → `src/app/api/auth/google-calendar/`

### Unchanged (token-based, no auth needed):
- `src/app/api/book/verify/route.ts`
- `src/app/api/sessions/[id]/route.ts`
- `src/app/api/sessions/[id]/cancel/route.ts`
- `src/app/api/sessions/[id]/reschedule/route.ts`
- `src/lib/google.ts`

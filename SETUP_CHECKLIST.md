# Setup Checklist - Supabase Auth Migration

## ✅ Step 1: Database Migration
**Status: COMPLETED** ✓

You've run the migration. Let's verify it worked:

### Verification Queries

Run these in Supabase SQL Editor to confirm:

```sql
-- 1. Check if auth_user_id column exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'alumni' AND column_name = 'auth_user_id';

-- 2. Check if triggers were created
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name IN ('validate_invite_token_trigger', 'handle_new_user_trigger');

-- 3. Check RLS policies
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('alumni', 'availability_slots', 'invite_tokens')
ORDER BY tablename, policyname;
```

Expected results:
- auth_user_id column: UUID type
- 2 triggers: validate_invite_token_trigger, handle_new_user_trigger
- Multiple policies using auth.uid()

---

## ⏳ Step 2: Configure Google OAuth in Supabase

1. Go to: https://pemzemvmjlhhrhwmavkc.supabase.co
2. Navigate to: **Authentication** > **Providers**
3. Click on **Google**
4. Toggle **Enable Sign in with Google**
5. Enter credentials:

```
Client ID: [Your Google OAuth Client ID]
Client Secret: [Your Google OAuth Client Secret]
```

6. Add Redirect URLs:
```
http://localhost:3000/api/auth/supabase/callback
```
(Add production URL when deploying)

7. Click **Save**

---

## ⏳ Step 3: Make Yourself an Admin

Run this in Supabase SQL Editor (replace with your email):

```sql
UPDATE alumni SET is_admin = true WHERE email = 'your-email@example.com';

-- Verify:
SELECT email, is_admin FROM alumni WHERE is_admin = true;
```

---

## ⏳ Step 4: Update Google OAuth Redirect URI

You need to update the Google OAuth redirect URI in Google Cloud Console:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/supabase/callback`
   - `http://localhost:3000/api/auth/google-calendar/callback`

---

## ⏳ Step 5: Test the Implementation

### A. Test New User Signup (with invite token)

1. Create an invite token:
   - Login to your app (if you have an existing account with cookie auth)
   - Or run in SQL Editor:
   ```sql
   INSERT INTO invite_tokens (token)
   VALUES ('test-token-123')
   RETURNING *;
   ```

2. Open incognito window: http://localhost:3000/alumni/login

3. Click "Primeira vez? Tenho um token de convite"

4. Enter token: `test-token-123`

5. Click "Continuar com Google"

6. Complete Google OAuth

7. **Expected:** Redirected to dashboard, user created, token marked as used

### B. Test New User Signup (without invite token)

1. Open incognito window: http://localhost:3000/alumni/login

2. DON'T enter an invite token

3. Click "Continuar com Google"

4. **Expected:** Error message "Token de convite inválido ou expirado"

### C. Test Existing User Login (Auto-link)

If you have an existing user with cookie auth:

1. Logout from current session

2. Go to: http://localhost:3000/alumni/login

3. Click "Continuar com Google" (without invite token)

4. **Expected:**
   - Redirected to dashboard
   - User auto-linked (auth_user_id populated)
   - Everything works normally

### D. Test Calendar Connection

1. Login to dashboard

2. If you see "Conecte seu Google Calendar" banner, click **Conectar**

3. Complete Google OAuth for calendar

4. **Expected:** Success message, banner disappears

### E. Test Admin Features

1. Login as admin user

2. Visit: http://localhost:3000/alumni/admin

3. Try creating an invite token

4. Try viewing all tokens

5. **Expected:** All operations work, RLS policies enforced

### F. Test Availability Management

1. Go to: http://localhost:3000/alumni/availability

2. Add a new availability slot

3. Delete a slot

4. **Expected:** All operations work with RLS

### G. Test Public Booking (Still Works)

1. Open incognito: http://localhost:3000/book

2. Try booking a session

3. **Expected:** Public booking still works (uses admin client)

---

## 🔍 Monitor Migration Progress

Run this query periodically to see migration status:

```sql
SELECT
  COUNT(*) as total_alumni,
  COUNT(*) FILTER (WHERE auth_user_id IS NOT NULL) as migrated_users,
  COUNT(*) FILTER (WHERE auth_user_id IS NULL) as pending_users,
  ROUND(100.0 * COUNT(*) FILTER (WHERE auth_user_id IS NOT NULL) / NULLIF(COUNT(*), 0), 1) as percent_migrated
FROM alumni;
```

---

## 🎯 Success Criteria

- [ ] Database migration verified (queries above show correct structure)
- [ ] Google OAuth configured in Supabase dashboard
- [ ] Admin user created
- [ ] Google Cloud redirect URIs updated
- [ ] New user signup WITH token works ✓
- [ ] New user signup WITHOUT token fails ✓
- [ ] Existing user auto-links on login ✓
- [ ] Calendar connection works ✓
- [ ] Admin features work ✓
- [ ] Availability management works ✓
- [ ] Public booking still works ✓

---

## 🚀 When All Tests Pass

Your migration is complete! You now have:

1. **Dual-mode authentication** - both old cookie and new Supabase Auth work
2. **Invite-only signups** - validated at database level
3. **RLS security** - policies enforced at database level
4. **Calendar separation** - post-login OAuth for calendar access
5. **Zero downtime** - existing users continue working

---

## 📊 Next Steps After Testing

1. **Monitor for a few days** - Ensure all users are migrating smoothly

2. **Check migration progress** regularly with the SQL query above

3. **When 100% migrated** (all users have auth_user_id):
   - Make auth_user_id NOT NULL
   - Remove cookie auth fallback code
   - Clean up old auth code

4. **Deploy to production**:
   - Update Google OAuth redirect URIs for production domain
   - Update NEXT_PUBLIC_APP_URL in .env
   - Deploy to Vercel/hosting platform

---

## ❓ Troubleshooting

If anything doesn't work, check:

1. **Migration errors**: Run verification queries above
2. **OAuth errors**: Check Supabase dashboard > Authentication > Logs
3. **RLS errors**: Check if auth_user_id is being set correctly
4. **Console errors**: Check browser console and terminal logs

Full troubleshooting guide in: `MIGRATION_IMPLEMENTED.md`

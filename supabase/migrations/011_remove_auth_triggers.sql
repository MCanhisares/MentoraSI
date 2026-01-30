-- Migration: 011_remove_auth_triggers
-- Description: Remove auth triggers and handle invite validation in application code

-- Drop both triggers
DROP TRIGGER IF EXISTS validate_invite_token_trigger ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;

-- Drop the functions
DROP FUNCTION IF EXISTS validate_invite_token();
DROP FUNCTION IF EXISTS handle_new_user();

-- We'll handle user creation and linking in the application code (callback route)

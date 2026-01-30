import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const error_description = requestUrl.searchParams.get("error_description");
  const inviteToken = requestUrl.searchParams.get("invite_token");

  const origin = requestUrl.origin;

  // Handle OAuth errors
  if (error) {
    console.error("OAuth callback error:", error, error_description);

    // Check if it's an invite token validation error
    if (error_description?.includes("invite token")) {
      return NextResponse.redirect(
        `${origin}/alumni/login?error=invalid_invite_token`
      );
    }

    return NextResponse.redirect(
      `${origin}/alumni/login?error=auth_failed`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/alumni/login?error=no_code`
    );
  }

  try {
    const supabase = await createClient();

    // Exchange code for session - this creates the auth.users record
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Code exchange error:", exchangeError);
      return NextResponse.redirect(
        `${origin}/alumni/login?error=exchange_failed`
      );
    }

    if (!data.user) {
      return NextResponse.redirect(`${origin}/alumni/login?error=no_user`);
    }

    console.log("✅ Session created for:", data.user.email);

    // Now handle alumni creation/linking (no triggers, all in application code)
    const { data: existingAlumni } = await supabase
      .from("alumni")
      .select("*")
      .eq("email", data.user.email)
      .single();

    if (existingAlumni) {
      // Existing alumni - link to auth user (use admin to bypass RLS)
      console.log("Linking existing alumni:", existingAlumni.id);
      const adminClient = createAdminClient();
      await adminClient
        .from("alumni")
        .update({ auth_user_id: data.user.id })
        .eq("id", existingAlumni.id);
    } else {
      // New user - validate invite token
      if (!inviteToken) {
        // Delete the auth user we just created
        const adminClient = createAdminClient();
        await adminClient.auth.admin.deleteUser(data.user.id);
        return NextResponse.redirect(
          `${origin}/alumni/login?error=invite_required&needs_invite=true`
        );
      }

      // Validate invite token
      const { data: tokenData } = await supabase
        .from("invite_tokens")
        .select("*")
        .eq("token", inviteToken)
        .is("used_by", null)
        .single();

      if (!tokenData || (tokenData.expires_at && new Date(tokenData.expires_at) < new Date())) {
        // Delete the auth user
        const adminClient = createAdminClient();
        await adminClient.auth.admin.deleteUser(data.user.id);
        return NextResponse.redirect(
          `${origin}/alumni/login?error=invalid_invite_token`
        );
      }

      // Create alumni record (use admin client to bypass RLS)
      const adminClient = createAdminClient();
      const { data: newAlumni, error: alumniError } = await adminClient
        .from("alumni")
        .insert({
          auth_user_id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || data.user.email,
        })
        .select()
        .single();

      if (alumniError) {
        console.error("Failed to create alumni:", alumniError);
        const adminClient = createAdminClient();
        await adminClient.auth.admin.deleteUser(data.user.id);
        return NextResponse.redirect(`${origin}/alumni/login?error=signup_failed`);
      }

      // Mark token as used (admin client to bypass RLS)
      await adminClient
        .from("invite_tokens")
        .update({ used_by: newAlumni.id, used_at: new Date().toISOString() })
        .eq("id", tokenData.id);

      console.log("✅ Created new alumni:", newAlumni.id);
    }

    // Successful authentication - redirect to dashboard
    return NextResponse.redirect(`${origin}/alumni/dashboard`);
  } catch (error) {
    console.error("Callback error:", error);

    // Check if the error is from the invite token validation trigger
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("invite token") ||
        errorMessage.includes("Invalid or expired")) {
      return NextResponse.redirect(
        `${origin}/alumni/login?error=invalid_invite_token`
      );
    }

    return NextResponse.redirect(
      `${origin}/alumni/login?error=callback_failed`
    );
  }
}

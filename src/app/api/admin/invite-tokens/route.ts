import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentAlumni } from "@/lib/auth";
import { randomUUID } from "crypto";

interface InviteTokenRow {
  id: string;
  token: string;
  created_by: string | null;
  used_by: string | null;
  used_at: string | null;
  expires_at: string | null;
  created_at: string;
  creator?: { name: string; email: string } | null;
  user?: { name: string; email: string } | null;
}

// GET: List all invite tokens (admin only)
export async function GET() {
  try {
    const alumni = await getCurrentAlumni();

    if (!alumni) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    if (!alumni.is_admin) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    // Use regular client - RLS policies enforce admin access
    const supabase = await createClient();

    // Get all invite tokens with creator and user info
    const { data: tokens, error } = await supabase
      .from("invite_tokens")
      .select(`
        *,
        creator:created_by(name, email),
        user:used_by(name, email)
      `)
      .order("created_at", { ascending: false }) as { data: InviteTokenRow[] | null; error: unknown };

    if (error) {
      console.error("Failed to fetch invite tokens:", error);
      return NextResponse.json(
        { error: "Falha ao buscar tokens" },
        { status: 500 }
      );
    }

    return NextResponse.json({ tokens: tokens || [] });
  } catch (error) {
    console.error("Error fetching invite tokens:", error);
    return NextResponse.json(
      { error: "Erro inesperado" },
      { status: 500 }
    );
  }
}

// POST: Create a new invite token (admin only)
export async function POST(request: NextRequest) {
  try {
    const alumni = await getCurrentAlumni();

    if (!alumni) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    if (!alumni.is_admin) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { expires_in_days } = body;

    const supabase = await createClient();

    // Generate a unique token
    const token = randomUUID();

    // Calculate expiration date if provided
    let expires_at: string | null = null;
    if (expires_in_days && expires_in_days > 0) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + expires_in_days);
      expires_at = expirationDate.toISOString();
    }

    const { data: newToken, error } = await supabase
      .from("invite_tokens")
      .insert({
        token,
        created_by: alumni.id,
        expires_at,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create invite token:", error);
      return NextResponse.json(
        { error: "Falha ao criar token" },
        { status: 500 }
      );
    }

    return NextResponse.json({ token: newToken });
  } catch (error) {
    console.error("Error creating invite token:", error);
    return NextResponse.json(
      { error: "Erro inesperado" },
      { status: 500 }
    );
  }
}

// DELETE: Revoke/delete an invite token (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const alumni = await getCurrentAlumni();

    if (!alumni) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    if (!alumni.is_admin) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get("id");

    if (!tokenId) {
      return NextResponse.json(
        { error: "ID do token não fornecido" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("invite_tokens")
      .delete()
      .eq("id", tokenId);

    if (error) {
      console.error("Failed to delete invite token:", error);
      return NextResponse.json(
        { error: "Falha ao excluir token" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invite token:", error);
    return NextResponse.json(
      { error: "Erro inesperado" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface SlotOwnership {
  alumni_id: string;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const method = formData.get("_method");

  if (method === "DELETE") {
    const slotId = request.nextUrl.searchParams.get("id");

    if (!slotId) {
      return NextResponse.json({ error: "Slot ID required" }, { status: 400 });
    }

    // Verify ownership
    const { data: slot } = await supabase
      .from("availability_slots")
      .select("alumni_id")
      .eq("id", slotId)
      .single() as { data: SlotOwnership | null };

    if (!slot || slot.alumni_id !== user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await supabase.from("availability_slots").delete().eq("id", slotId);

    return NextResponse.redirect(
      new URL("/alumni/availability", request.url)
    );
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slotId = request.nextUrl.searchParams.get("id");

  if (!slotId) {
    return NextResponse.json({ error: "Slot ID required" }, { status: 400 });
  }

  // Verify ownership
  const { data: slot } = await supabase
    .from("availability_slots")
    .select("alumni_id")
    .eq("id", slotId)
    .single() as { data: SlotOwnership | null };

  if (!slot || slot.alumni_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("availability_slots")
    .delete()
    .eq("id", slotId);

  if (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

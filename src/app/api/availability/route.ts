import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAlumni } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const alumni = await getCurrentAlumni();

  if (!alumni) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  const formData = await request.formData();
  const method = formData.get("_method");

  if (method === "DELETE") {
    const slotId = request.nextUrl.searchParams.get("id");

    if (!slotId) {
      return NextResponse.json({ error: "Slot ID required" }, { status: 400 });
    }

    // RLS will enforce ownership - just delete
    const { error } = await supabase
      .from("availability_slots")
      .delete()
      .eq("id", slotId);

    if (error) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.redirect(
      new URL("/alumni/availability", request.url)
    );
  }

  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE(request: NextRequest) {
  const alumni = await getCurrentAlumni();

  if (!alumni) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  const slotId = request.nextUrl.searchParams.get("id");

  if (!slotId) {
    return NextResponse.json({ error: "Slot ID required" }, { status: 400 });
  }

  // RLS will enforce ownership - just delete
  const { error } = await supabase
    .from("availability_slots")
    .delete()
    .eq("id", slotId);

  if (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

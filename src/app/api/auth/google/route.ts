import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/google";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invite_token } = body;

    const authUrl = getAuthUrl(invite_token || undefined);

    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate auth URL" },
      { status: 500 }
    );
  }
}

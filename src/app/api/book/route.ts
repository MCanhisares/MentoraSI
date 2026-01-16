import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendVerificationEmail } from "@/lib/email";
import { format, parseISO, getDay } from "date-fns";
import { randomUUID } from "crypto";

interface SessionRow {
  id: string;
  management_token: string | null;
  verification_token: string | null;
}

// Validate USP email domain
function isValidUspEmail(email: string): boolean {
  return /@.+\.usp\.br$/i.test(email) || /@usp\.br$/i.test(email);
}

interface AvailabilitySlotRow {
  id: string;
  alumni_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  specific_date: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      booking_key,
      date,
      start_time,
      end_time,
      student_email,
      student_name,
      student_linkedin,
      student_notes,
    } = body;

    if (!booking_key || !date || !start_time || !end_time || !student_email || !student_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate USP email domain
    if (!isValidUspEmail(student_email)) {
      return NextResponse.json(
        { error: "Use um e-mail institucional da USP (@usp.br, @alumni.usp.br, etc.)" },
        { status: 400 }
      );
    }

    // Decode booking key - now contains date/time info instead of specific alumni
    let bookingInfo: { date: string; start_time: string; end_time: string };
    try {
      bookingInfo = JSON.parse(Buffer.from(booking_key, "base64").toString());
    } catch {
      return NextResponse.json(
        { error: "Invalid booking key" },
        { status: 400 }
      );
    }

    // Verify the booking key matches the provided date/time
    if (bookingInfo.date !== date || bookingInfo.start_time !== start_time) {
      return NextResponse.json(
        { error: "Booking key mismatch" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Normalize time for comparison
    const normalizedStartTime = start_time.length === 5 ? `${start_time}:00` : start_time;
    const normalizedEndTime = end_time.length === 5 ? `${end_time}:00` : end_time;

    // Get the day of week for the requested date
    const requestedDate = parseISO(date);
    const dayOfWeek = getDay(requestedDate);

    // Find all availability slots that cover this time
    // Check both recurring slots for this day of week and specific date slots
    const { data: availabilitySlots } = await supabase
      .from("availability_slots")
      .select("id, alumni_id, day_of_week, start_time, end_time, is_recurring, specific_date")
      .or(`and(is_recurring.eq.true,day_of_week.eq.${dayOfWeek}),and(is_recurring.eq.false,specific_date.eq.${date})`) as { data: AvailabilitySlotRow[] | null };

    if (!availabilitySlots || availabilitySlots.length === 0) {
      return NextResponse.json(
        { error: "No availability found for this time" },
        { status: 404 }
      );
    }

    // Filter slots that actually cover the requested time
    const matchingSlots = availabilitySlots.filter((slot) => {
      const slotStart = slot.start_time.length === 5 ? `${slot.start_time}:00` : slot.start_time;
      const slotEnd = slot.end_time.length === 5 ? `${slot.end_time}:00` : slot.end_time;

      // Check if the requested time falls within this slot
      return slotStart <= normalizedStartTime && slotEnd >= normalizedEndTime;
    });

    if (matchingSlots.length === 0) {
      return NextResponse.json(
        { error: "No availability found for this time" },
        { status: 404 }
      );
    }

    // Get all alumni IDs from matching slots
    const alumniIds = [...new Set(matchingSlots.map((s) => s.alumni_id))];

    // Check which alumni are already booked for this time
    const { data: bookedSessions } = await supabase
      .from("sessions")
      .select("alumni_id")
      .eq("session_date", date)
      .eq("start_time", normalizedStartTime)
      .in("status", ["pending", "confirmed"])
      .in("alumni_id", alumniIds);

    const bookedAlumniIds = new Set(bookedSessions?.map((s) => s.alumni_id) || []);

    // Filter to only available alumni
    const availableSlots = matchingSlots.filter((slot) => !bookedAlumniIds.has(slot.alumni_id));

    if (availableSlots.length === 0) {
      return NextResponse.json(
        { error: "All mentors are booked for this time slot" },
        { status: 409 }
      );
    }

    // Pick a random available alumni (for fair distribution)
    const selectedSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];

    // Generate tokens
    const managementToken = randomUUID();
    const verificationToken = randomUUID();

    // Create the session record with 'pending' status (awaiting email verification)
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .insert({
        slot_id: selectedSlot.id,
        alumni_id: selectedSlot.alumni_id,
        student_email,
        student_name,
        student_linkedin: student_linkedin || null,
        student_notes: student_notes || null,
        session_date: date,
        start_time: normalizedStartTime,
        end_time: normalizedEndTime,
        management_token: managementToken,
        verification_token: verificationToken,
        status: "pending",
      } as Record<string, unknown>)
      .select()
      .single() as { data: SessionRow | null; error: unknown };

    if (sessionError) {
      console.error("Failed to create session:", sessionError);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    // Get base URL for verification link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      (request.headers.get("host")?.includes("localhost")
        ? `http://${request.headers.get("host")}`
        : `https://${request.headers.get("host")}`);

    // Send verification email (NOT confirmation - that comes after verification)
    const formattedDate = format(parseISO(date), "EEEE, MMMM d, yyyy");

    try {
      await sendVerificationEmail(student_email, {
        studentName: student_name,
        date: formattedDate,
        startTime: normalizedStartTime.slice(0, 5),
        endTime: normalizedEndTime.slice(0, 5),
        verificationToken,
        baseUrl,
      });
      console.log("Verification email sent successfully");
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail the request - the session is created, user can request another email
    }

    return NextResponse.json({
      success: true,
      session_id: session?.id,
      pending_verification: true,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addDays, format, getDay, startOfDay } from "date-fns";

interface GeneratedSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  slot_id: string;
  alumni_id: string;
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

interface BookedSessionRow {
  slot_id: string;
  session_date: string;
  start_time: string;
  alumni_id: string;
}

export async function GET() {
  const supabase = await createClient();

  // Get all recurring availability slots
  const { data: availabilitySlots, error } = await supabase
    .from("availability_slots")
    .select("id, alumni_id, day_of_week, start_time, end_time, is_recurring, specific_date") as { data: AvailabilitySlotRow[] | null; error: unknown };

  if (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
  }

  // Get booked sessions for the next 14 days
  const today = format(new Date(), "yyyy-MM-dd");
  const twoWeeksLater = format(addDays(new Date(), 14), "yyyy-MM-dd");

  const { data: bookedSessions } = await supabase
    .from("sessions")
    .select("slot_id, session_date, start_time, alumni_id")
    .gte("session_date", today)
    .lte("session_date", twoWeeksLater)
    .in("status", ["pending", "confirmed"]) as { data: BookedSessionRow[] | null };

  // Create a set of booked slot+date combinations
  const bookedSet = new Set(
    bookedSessions?.map(
      (s: BookedSessionRow) => `${s.alumni_id}-${s.session_date}-${s.start_time}`
    ) || []
  );

  // Generate concrete slots for the next 14 days
  const generatedSlots: GeneratedSlot[] = [];

  for (let i = 0; i < 14; i++) {
    const date = addDays(startOfDay(new Date()), i);
    const dayOfWeek = getDay(date);
    const dateStr = format(date, "yyyy-MM-dd");

    for (const slot of availabilitySlots || []) {
      // Check if this recurring slot applies to this day
      if (slot.is_recurring && slot.day_of_week === dayOfWeek) {
        const key = `${slot.alumni_id}-${dateStr}-${slot.start_time}`;

        // Skip if already booked
        if (!bookedSet.has(key)) {
          generatedSlots.push({
            id: `${slot.id}-${dateStr}`,
            date: dateStr,
            start_time: slot.start_time,
            end_time: slot.end_time,
            slot_id: slot.id,
            alumni_id: slot.alumni_id,
          });
        }
      }

      // Check specific date slots
      if (slot.specific_date && slot.specific_date === dateStr) {
        const key = `${slot.alumni_id}-${dateStr}-${slot.start_time}`;

        if (!bookedSet.has(key)) {
          generatedSlots.push({
            id: `${slot.id}-${dateStr}`,
            date: dateStr,
            start_time: slot.start_time,
            end_time: slot.end_time,
            slot_id: slot.id,
            alumni_id: slot.alumni_id,
          });
        }
      }
    }
  }

  // Sort by date and time
  generatedSlots.sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return a.start_time.localeCompare(b.start_time);
  });

  // Return slots WITHOUT alumni_id for anonymity (but keep it for booking)
  // We'll include alumni_id in a way that can be used for booking but not displayed
  const anonymousSlots = generatedSlots.map((slot) => ({
    id: slot.id,
    date: slot.date,
    start_time: slot.start_time,
    end_time: slot.end_time,
    // Encode slot_id and alumni_id together for booking
    booking_key: Buffer.from(
      JSON.stringify({ slot_id: slot.slot_id, alumni_id: slot.alumni_id })
    ).toString("base64"),
  }));

  return NextResponse.json({ slots: anonymousSlots });
}

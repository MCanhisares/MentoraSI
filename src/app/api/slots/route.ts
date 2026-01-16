import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addDays, format, getDay, startOfDay } from "date-fns";

const SESSION_DURATION_MINUTES = 60; // 1 hour sessions

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

// Break down a time range into 1-hour slots
function breakIntoHourSlots(
  startTime: string,
  endTime: string
): Array<{ start: string; end: string }> {
  const slots: Array<{ start: string; end: string }> = [];

  // Parse times (format: HH:MM or HH:MM:SS)
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  // Generate 1-hour slots
  let currentStart = startMinutes;
  while (currentStart + SESSION_DURATION_MINUTES <= endMinutes) {
    const currentEnd = currentStart + SESSION_DURATION_MINUTES;

    const startH = Math.floor(currentStart / 60);
    const startM = currentStart % 60;
    const endH = Math.floor(currentEnd / 60);
    const endM = currentEnd % 60;

    slots.push({
      start: `${startH.toString().padStart(2, "0")}:${startM.toString().padStart(2, "0")}:00`,
      end: `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}:00`,
    });

    currentStart = currentEnd;
  }

  return slots;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const alumniIdFilter = searchParams.get("alumni_id");

  const supabase = await createClient();

  // Get availability slots (optionally filtered by alumni_id for rescheduling)
  let query = supabase
    .from("availability_slots")
    .select("id, alumni_id, day_of_week, start_time, end_time, is_recurring, specific_date");

  if (alumniIdFilter) {
    query = query.eq("alumni_id", alumniIdFilter);
  }

  const { data: availabilitySlots, error } = await query as { data: AvailabilitySlotRow[] | null; error: unknown };

  if (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
  }

  // Get booked sessions for the next 90 days (3 months)
  const today = format(new Date(), "yyyy-MM-dd");
  const threeMonthsLater = format(addDays(new Date(), 90), "yyyy-MM-dd");

  const { data: bookedSessions } = await supabase
    .from("sessions")
    .select("slot_id, session_date, start_time, alumni_id")
    .gte("session_date", today)
    .lte("session_date", threeMonthsLater)
    .in("status", ["pending", "confirmed"]) as { data: BookedSessionRow[] | null };

  // Create a set of booked alumni+date+time combinations
  // Normalize times to HH:MM:SS format for consistent matching
  const bookedSet = new Set(
    bookedSessions?.map((s: BookedSessionRow) => {
      const normalizedTime = s.start_time.length === 5 ? `${s.start_time}:00` : s.start_time;
      return `${s.alumni_id}-${s.session_date}-${normalizedTime}`;
    }) || []
  );

  // Track available slots by date+time (deduplicated)
  // Key: unique string, Value: slot info + available alumni
  interface TimeSlotData {
    date: string;
    start_time: string;
    end_time: string;
    available_alumni: Array<{ slot_id: string; alumni_id: string }>;
  }
  const slotsByDateTime: Map<string, TimeSlotData> = new Map();

  for (let i = 0; i < 90; i++) {
    const date = addDays(startOfDay(new Date()), i);
    const dayOfWeek = getDay(date);
    const dateStr = format(date, "yyyy-MM-dd");

    for (const slot of availabilitySlots || []) {
      // Check if this recurring slot applies to this day
      if (slot.is_recurring && slot.day_of_week === dayOfWeek) {
        const hourSlots = breakIntoHourSlots(slot.start_time, slot.end_time);

        for (const hourSlot of hourSlots) {
          const bookedKey = `${slot.alumni_id}-${dateStr}-${hourSlot.start}`;

          // Only add if this alumni is not booked for this time
          if (!bookedSet.has(bookedKey)) {
            const timeKey = `${dateStr}|${hourSlot.start}|${hourSlot.end}`;

            if (!slotsByDateTime.has(timeKey)) {
              slotsByDateTime.set(timeKey, {
                date: dateStr,
                start_time: hourSlot.start,
                end_time: hourSlot.end,
                available_alumni: [],
              });
            }
            slotsByDateTime.get(timeKey)!.available_alumni.push({
              slot_id: slot.id,
              alumni_id: slot.alumni_id,
            });
          }
        }
      }

      // Check specific date slots
      if (slot.specific_date && slot.specific_date === dateStr) {
        const hourSlots = breakIntoHourSlots(slot.start_time, slot.end_time);

        for (const hourSlot of hourSlots) {
          const bookedKey = `${slot.alumni_id}-${dateStr}-${hourSlot.start}`;

          if (!bookedSet.has(bookedKey)) {
            const timeKey = `${dateStr}|${hourSlot.start}|${hourSlot.end}`;

            if (!slotsByDateTime.has(timeKey)) {
              slotsByDateTime.set(timeKey, {
                date: dateStr,
                start_time: hourSlot.start,
                end_time: hourSlot.end,
                available_alumni: [],
              });
            }
            slotsByDateTime.get(timeKey)!.available_alumni.push({
              slot_id: slot.id,
              alumni_id: slot.alumni_id,
            });
          }
        }
      }
    }
  }

  // Convert to array
  const uniqueSlots = Array.from(slotsByDateTime.values()).map((slotData) => ({
    id: `${slotData.date}|${slotData.start_time}`,
    date: slotData.date,
    start_time: slotData.start_time,
    end_time: slotData.end_time,
    // Include slot_id for reschedule scenarios (when filtered by alumni_id)
    // Use the first available slot_id since they all cover the same time
    slot_id: slotData.available_alumni[0]?.slot_id || null,
    // Don't expose alumni info - booking API will find available alumni
    booking_key: Buffer.from(
      JSON.stringify({
        date: slotData.date,
        start_time: slotData.start_time,
        end_time: slotData.end_time,
      })
    ).toString("base64"),
  }));

  // Sort by date and time
  uniqueSlots.sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return a.start_time.localeCompare(b.start_time);
  });

  return NextResponse.json({ slots: uniqueSlots });
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { format, addDays } from "date-fns";

interface DateAvailabilityFormProps {
  alumniId: string;
}

export function DateAvailabilityForm({ alumniId }: DateAvailabilityFormProps) {
  const router = useRouter();
  const supabase = createClient();

  // Default to tomorrow
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const maxDate = format(addDays(new Date(), 90), "yyyy-MM-dd");

  const [selectedDate, setSelectedDate] = useState(tomorrow);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validate time range
    if (startTime >= endTime) {
      setError("End time must be after start time");
      setIsSubmitting(false);
      return;
    }

    // Validate date is in the future
    const selected = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected < today) {
      setError("Please select a future date");
      setIsSubmitting(false);
      return;
    }

    // Get day of week from the selected date (needed for schema)
    const dayOfWeek = selected.getDay();

    const { error: insertError } = await supabase
      .from("availability_slots")
      .insert({
        alumni_id: alumniId,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        is_recurring: false,
        specific_date: selectedDate,
      });

    if (insertError) {
      setError("Failed to add availability. Please try again.");
      console.error(insertError);
    } else {
      router.refresh();
      // Reset to next available date
      setSelectedDate(tomorrow);
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-[var(--error-bg)] text-[var(--error-text)] p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-[var(--foreground)] mb-1"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            min={tomorrow}
            max={maxDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border border-[var(--card-border)] bg-[var(--surface-2)] text-[var(--foreground)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-[var(--foreground)] mb-1"
          >
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border border-[var(--card-border)] bg-[var(--surface-2)] text-[var(--foreground)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-[var(--foreground)] mb-1"
          >
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border border-[var(--card-border)] bg-[var(--surface-2)] text-[var(--foreground)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <p className="text-sm text-[var(--muted)]">
        Add availability for a specific date up to 3 months in advance.
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Adding..." : "Add Date Availability"}
      </button>
    </form>
  );
}

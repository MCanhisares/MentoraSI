"use client";

import { useState, useEffect, useMemo } from "react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns";

interface Slot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  booking_key: string;
}

export function BookingCalendar() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [email, setEmail] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await fetch("/api/slots");
      const data = await response.json();
      setSlots(data.slots || []);
    } catch (error) {
      console.error("Failed to fetch slots:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group slots by date
  const slotsByDate = useMemo(() => {
    const grouped: Record<string, Slot[]> = {};
    slots.forEach((slot) => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    return grouped;
  }, [slots]);

  // Get dates with available slots
  const datesWithSlots = useMemo(() => {
    return new Set(Object.keys(slotsByDate));
  }, [slotsByDate]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !email) return;

    setIsBooking(true);
    setBookingError("");

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_key: selectedSlot.booking_key,
          date: selectedSlot.date,
          start_time: selectedSlot.start_time,
          end_time: selectedSlot.end_time,
          student_email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Booking failed");
      }

      setBookingSuccess(true);
      setSelectedSlot(null);
      setSelectedDate(null);
      setEmail("");
      fetchSlots();
    } catch (error) {
      setBookingError(
        error instanceof Error ? error.message : "Failed to book session"
      );
    } finally {
      setIsBooking(false);
    }
  };

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    if (datesWithSlots.has(dateStr) && !isBefore(date, startOfDay(new Date()))) {
      setSelectedDate(date);
      setSelectedSlot(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--card-border)] text-center">
        <p className="text-[var(--muted)]">Loading available slots...</p>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--card-border)] text-center">
        <div className="w-16 h-16 bg-[var(--success-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-[var(--success-text)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
          Session Booked!
        </h2>
        <p className="text-[var(--muted)] mb-6">
          Check your email for confirmation details and the meeting link.
        </p>
        <button
          onClick={() => setBookingSuccess(false)}
          className="text-primary-500 hover:text-primary-700"
        >
          Book another session
        </button>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--card-border)] text-center">
        <p className="text-[var(--muted)]">
          No available slots at the moment. Please check back later.
        </p>
      </div>
    );
  }

  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const slotsForSelectedDate = selectedDateStr ? slotsByDate[selectedDateStr] || [] : [];

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)]">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-[var(--surface-3)] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-[var(--surface-3)] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-[var(--muted)] py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const hasSlots = datesWithSlots.has(dateStr);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isPast = isBefore(day, startOfDay(new Date()));
            const isDayToday = isToday(day);

            return (
              <button
                key={dateStr}
                onClick={() => handleDateClick(day)}
                disabled={!hasSlots || isPast}
                className={`
                  relative aspect-square p-2 rounded-lg text-center transition-all
                  ${!isCurrentMonth ? "text-[var(--muted-foreground)] opacity-40" : ""}
                  ${isSelected ? "bg-primary-600 text-white" : ""}
                  ${hasSlots && !isPast && !isSelected ? "bg-[var(--surface-2)] hover:bg-[var(--surface-3)] cursor-pointer" : ""}
                  ${!hasSlots || isPast ? "cursor-default" : ""}
                  ${isDayToday && !isSelected ? "ring-1 ring-primary-500" : ""}
                `}
              >
                <span className={`text-sm ${isCurrentMonth && !isPast ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"} ${isSelected ? "text-white" : ""}`}>
                  {format(day, "d")}
                </span>
                {hasSlots && !isPast && (
                  <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-primary-500"}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--card-border)]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary-500" />
            <span className="text-sm text-[var(--muted)]">Available slots</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded ring-1 ring-primary-500" />
            <span className="text-sm text-[var(--muted)]">Today</span>
          </div>
        </div>
      </div>

      {/* Time Slots for Selected Date */}
      {selectedDate && (
        <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)]">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h3>

          {slotsForSelectedDate.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {slotsForSelectedDate.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`
                    p-4 rounded-lg border text-center transition-all
                    ${selectedSlot?.id === slot.id
                      ? "border-primary-500 bg-primary-600 text-white"
                      : "border-[var(--card-border)] bg-[var(--surface-2)] hover:border-primary-500 hover:bg-[var(--surface-3)]"
                    }
                  `}
                >
                  <span className="font-medium">
                    {slot.start_time.slice(0, 5)}
                  </span>
                  <span className={selectedSlot?.id === slot.id ? "text-white/70" : "text-[var(--muted)]"}> - </span>
                  <span className="font-medium">
                    {slot.end_time.slice(0, 5)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[var(--muted)]">No available slots for this date.</p>
          )}
        </div>
      )}

      {/* Booking Form */}
      {selectedSlot && (
        <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)]">
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
            Confirm Your Booking
          </h2>

          <div className="bg-primary-50 p-4 rounded-lg mb-6">
            <p className="text-primary-700">
              <strong>Selected:</strong>{" "}
              {format(parseISO(selectedSlot.date), "EEEE, MMMM d, yyyy")} at{" "}
              {selectedSlot.start_time.slice(0, 5)} -{" "}
              {selectedSlot.end_time.slice(0, 5)}
            </p>
          </div>

          {bookingError && (
            <div className="bg-[var(--error-bg)] text-[var(--error-text)] p-3 rounded-lg mb-4 text-sm">
              {bookingError}
            </div>
          )}

          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--foreground)] mb-1"
              >
                Your Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="student@university.edu"
                className="w-full border border-[var(--card-border)] bg-[var(--surface-2)] rounded-lg px-4 py-2 text-[var(--foreground)] placeholder-[var(--muted)] focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-xs text-[var(--muted)] mt-1">
                You will receive a confirmation email with the meeting link.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="px-6 py-2 border border-[var(--card-border)] rounded-lg text-[var(--foreground)] hover:bg-[var(--surface-3)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isBooking}
                className="flex-1 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBooking ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

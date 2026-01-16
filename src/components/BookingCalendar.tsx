"use client";

import { useState, useEffect } from "react";
import { format, parseISO, isSameDay } from "date-fns";

interface Slot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  booking_key: string;
}

interface GroupedSlots {
  [date: string]: Slot[];
}

export function BookingCalendar() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
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

  const groupedSlots: GroupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as GroupedSlots);

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
      setEmail("");
      fetchSlots(); // Refresh available slots
    } catch (error) {
      setBookingError(
        error instanceof Error ? error.message : "Failed to book session"
      );
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500">Loading available slots...</p>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Session Booked!
        </h2>
        <p className="text-gray-600 mb-6">
          Check your email for confirmation details and the meeting link.
        </p>
        <button
          onClick={() => setBookingSuccess(false)}
          className="text-primary-600 hover:text-primary-800"
        >
          Book another session
        </button>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500">
          No available slots at the moment. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Available Slots */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Available Time Slots
        </h2>

        <div className="space-y-6">
          {Object.entries(groupedSlots).map(([date, dateSlots]) => (
            <div key={date}>
              <h3 className="font-medium text-gray-900 mb-3">
                {format(parseISO(date), "EEEE, MMMM d, yyyy")}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {dateSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      selectedSlot?.id === slot.id
                        ? "border-primary-600 bg-primary-50 text-primary-700"
                        : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">
                      {slot.start_time.slice(0, 5)}
                    </span>
                    <span className="text-gray-400 mx-1">-</span>
                    <span className="font-medium">
                      {slot.end_time.slice(0, 5)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form */}
      {selectedSlot && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Confirm Your Booking
          </h2>

          <div className="bg-primary-50 p-4 rounded-lg mb-6">
            <p className="text-primary-800">
              <strong>Selected:</strong>{" "}
              {format(parseISO(selectedSlot.date), "EEEE, MMMM d, yyyy")} at{" "}
              {selectedSlot.start_time.slice(0, 5)} -{" "}
              {selectedSlot.end_time.slice(0, 5)}
            </p>
          </div>

          {bookingError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {bookingError}
            </div>
          )}

          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                You will receive a confirmation email with the meeting link.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedSlot(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
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

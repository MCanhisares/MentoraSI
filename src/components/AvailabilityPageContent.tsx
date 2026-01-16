"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { AvailabilityTabs } from "./AvailabilityTabs";
import { AvailabilityForm } from "./AvailabilityForm";
import { DateAvailabilityForm } from "./DateAvailabilityForm";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface AvailabilitySlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  specific_date: string | null;
}

interface AvailabilityPageContentProps {
  alumniId: string;
  slots: AvailabilitySlot[] | null;
}

export function AvailabilityPageContent({ alumniId, slots }: AvailabilityPageContentProps) {
  const [activeTab, setActiveTab] = useState<"weekly" | "individual">("weekly");

  // Separate slots by type
  const recurringSlots = slots?.filter((slot) => slot.is_recurring) || [];
  const individualSlots = slots?.filter((slot) => !slot.is_recurring) || [];

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Add Availability
        </h2>

        <AvailabilityTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "weekly" ? (
          <AvailabilityForm alumniId={alumniId} />
        ) : (
          <DateAvailabilityForm alumniId={alumniId} />
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Current Availability
        </h2>

        {/* Recurring Weekly Slots */}
        {recurringSlots.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Weekly Schedule
            </h3>
            <div className="space-y-3">
              {recurringSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      Every {DAYS_OF_WEEK[slot.day_of_week]}
                    </p>
                    <p className="text-sm text-gray-500">
                      {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                    </p>
                  </div>
                  <form action={`/api/availability?id=${slot.id}`} method="POST">
                    <input type="hidden" name="_method" value="DELETE" />
                    <button
                      type="submit"
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Individual Date Slots */}
        {individualSlots.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Individual Dates
            </h3>
            <div className="space-y-3">
              {individualSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex justify-between items-center p-4 bg-primary-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {slot.specific_date
                        ? format(parseISO(slot.specific_date), "EEEE, MMMM d, yyyy")
                        : "Unknown date"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                    </p>
                  </div>
                  <form action={`/api/availability?id=${slot.id}`} method="POST">
                    <input type="hidden" name="_method" value="DELETE" />
                    <button
                      type="submit"
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}

        {recurringSlots.length === 0 && individualSlots.length === 0 && (
          <p className="text-gray-500">
            No availability set yet. Add your first time slot above.
          </p>
        )}
      </div>
    </>
  );
}

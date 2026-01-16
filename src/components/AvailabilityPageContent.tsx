"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { AvailabilityTabs } from "./AvailabilityTabs";
import { AvailabilityForm } from "./AvailabilityForm";
import { DateAvailabilityForm } from "./DateAvailabilityForm";

const DAYS_OF_WEEK = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
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
      <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)] mb-8">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
          Adicionar Disponibilidade
        </h2>

        <AvailabilityTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "weekly" ? (
          <AvailabilityForm alumniId={alumniId} />
        ) : (
          <DateAvailabilityForm alumniId={alumniId} />
        )}
      </div>

      <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)]">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
          Disponibilidade Atual
        </h2>

        {/* Recurring Weekly Slots */}
        {recurringSlots.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wide mb-3">
              Cronograma Semanal
            </h3>
            <div className="space-y-3">
              {recurringSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex justify-between items-center p-4 bg-[var(--surface-2)] rounded-lg"
                >
                  <div>
                    <p className="font-medium text-[var(--foreground)]">
                      Toda {DAYS_OF_WEEK[slot.day_of_week]}
                    </p>
                    <p className="text-sm text-[var(--muted)]">
                      {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                    </p>
                  </div>
                  <form action={`/api/availability?id=${slot.id}`} method="POST">
                    <input type="hidden" name="_method" value="DELETE" />
                    <button
                      type="submit"
                      className="text-[var(--error-text)] hover:opacity-80 text-sm"
                    >
                      Remover
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
            <h3 className="text-sm font-medium text-[var(--muted)] uppercase tracking-wide mb-3">
              Datas Individuais
            </h3>
            <div className="space-y-3">
              {individualSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex justify-between items-center p-4 bg-primary-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-[var(--foreground)]">
                      {slot.specific_date
                        ? format(parseISO(slot.specific_date), "EEEE, MMMM d, yyyy")
                        : "Unknown date"}
                    </p>
                    <p className="text-sm text-[var(--muted)]">
                      {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                    </p>
                  </div>
                  <form action={`/api/availability?id=${slot.id}`} method="POST">
                    <input type="hidden" name="_method" value="DELETE" />
                    <button
                      type="submit"
                      className="text-[var(--error-text)] hover:opacity-80 text-sm"
                    >
                      Remover
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}

        {recurringSlots.length === 0 && individualSlots.length === 0 && (
          <p className="text-[var(--muted)]">
            Nenhuma disponibilidade definida ainda. Adicione seu primeiro horário acima.
          </p>
        )}
      </div>
    </>
  );
}

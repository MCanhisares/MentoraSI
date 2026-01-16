"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const DAYS_OF_WEEK = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];

interface AvailabilityFormProps {
  alumniId: string;
}

export function AvailabilityForm({ alumniId }: AvailabilityFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [dayOfWeek, setDayOfWeek] = useState(1);
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
      setError("O horário de término deve ser após o horário de início");
      setIsSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("availability_slots")
      .insert({
        alumni_id: alumniId,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        is_recurring: true,
      });

    if (insertError) {
      setError("Falha ao adicionar disponibilidade. Por favor, tente novamente.");
      console.error(insertError);
    } else {
      router.refresh();
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
            htmlFor="dayOfWeek"
            className="block text-sm font-medium text-[var(--foreground)] mb-1"
          >
            Dia da Semana
          </label>
          <select
            id="dayOfWeek"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(Number(e.target.value))}
            className="w-full border border-[var(--card-border)] bg-[var(--surface-2)] text-[var(--foreground)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {DAYS_OF_WEEK.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-[var(--foreground)] mb-1"
          >
            Horário de Início
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
            Horário de Término
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Adicionando..." : "Adicionar Disponibilidade"}
      </button>
    </form>
  );
}

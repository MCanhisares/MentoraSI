"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  format,
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

interface SessionData {
  id: string;
  student_email: string;
  student_name: string | null;
  session_date: string;
  start_time: string;
  end_time: string;
  status: string;
  alumni: {
    id: string;
    name: string;
  };
}

interface Slot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  booking_key: string;
  slot_id: string;
}

export default function RescheduleSessionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.id as string;
  const token = searchParams.get("token");

  const [session, setSession] = useState<SessionData | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduled, setRescheduled] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Token de acesso inválido");
      setLoading(false);
      return;
    }

    fetchSessionAndSlots();
  }, [sessionId, token]);

  const fetchSessionAndSlots = async () => {
    try {
      // Fetch session first
      const sessionResponse = await fetch(`/api/sessions/${sessionId}?token=${token}`);
      const sessionData = await sessionResponse.json();

      if (!sessionResponse.ok) {
        throw new Error(sessionData.error || "Erro ao carregar sessão");
      }

      if (sessionData.session.status === "cancelled") {
        setError("Esta sessão já foi cancelada");
        setLoading(false);
        return;
      }

      setSession(sessionData.session);

      // Fetch available slots for the same alumni
      const slotsResponse = await fetch(`/api/slots?alumni_id=${sessionData.session.alumni.id}`);
      const slotsData = await slotsResponse.json();

      setSlots(slotsData.slots || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
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

  const handleReschedule = async () => {
    if (!token || !selectedSlot) return;

    setRescheduling(true);
    try {
      // Decode booking key to get slot_id
      const slotInfo = JSON.parse(Buffer.from(selectedSlot.booking_key, "base64").toString());

      const response = await fetch(`/api/sessions/${sessionId}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          new_date: selectedSlot.date,
          new_start_time: selectedSlot.start_time,
          new_end_time: selectedSlot.end_time,
          new_slot_id: slotInfo.slot_id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao reagendar sessão");
      }

      setRescheduled(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao reagendar sessão");
    } finally {
      setRescheduling(false);
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

  const formatSessionDate = (dateStr: string) => {
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-[var(--muted)]">Carregando...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
        <div className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--card-border)] max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[var(--error-bg)] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-[var(--error-text)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            Erro
          </h1>
          <p className="text-[var(--muted)] mb-6">{error}</p>
          <Link href="/" className="text-primary-500 hover:text-primary-400">
            Voltar ao início
          </Link>
        </div>
      </main>
    );
  }

  if (rescheduled) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
        <div className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--card-border)] max-w-md w-full text-center">
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
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            Sessão Reagendada!
          </h1>
          <p className="text-[var(--muted)] mb-6">
            Sua sessão foi reagendada com sucesso. Você receberá um e-mail de confirmação com os novos detalhes.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Voltar ao Início
          </Link>
        </div>
      </main>
    );
  }

  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const slotsForSelectedDate = selectedDateStr ? slotsByDate[selectedDateStr] || [] : [];

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <nav className="bg-[var(--card-bg)] border-b border-[var(--card-border)] px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold text-primary-500">
            MentoraSI
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Reagendar Sessão
          </h1>
          <p className="text-[var(--muted)]">
            Selecione um novo horário para sua sessão de mentoria.
          </p>
        </div>

        {/* Current Session Info */}
        {session && (
          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)] mb-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">
              Sessão Atual
            </h2>
            <div className="bg-[var(--surface-2)] p-4 rounded-lg">
              <p className="text-[var(--foreground)] font-medium">
                {formatSessionDate(session.session_date)}
              </p>
              <p className="text-[var(--muted)]">
                {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
              </p>
            </div>
          </div>
        )}

        {/* Calendar */}
        <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)] mb-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Escolha uma Nova Data
          </h2>

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
            <h3 className="text-xl font-semibold text-[var(--foreground)]">
              {format(currentMonth, "MMMM yyyy")}
            </h3>
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
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
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
        </div>

        {/* Time Slots for Selected Date */}
        {selectedDate && (
          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)] mb-6">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Horários Disponíveis - {format(selectedDate, "EEEE, d 'de' MMMM")}
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
              <p className="text-[var(--muted)]">Nenhum horário disponível para esta data.</p>
            )}
          </div>
        )}

        {/* Confirm Button */}
        {selectedSlot && (
          <div className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--card-border)]">
            <div className="bg-primary-50 p-4 rounded-lg mb-6">
              <p className="text-primary-700">
                <strong>Novo horário:</strong>{" "}
                {format(new Date(selectedSlot.date + "T12:00:00"), "EEEE, d 'de' MMMM 'de' yyyy")} às{" "}
                {selectedSlot.start_time.slice(0, 5)} - {selectedSlot.end_time.slice(0, 5)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedSlot(null);
                  setSelectedDate(null);
                }}
                className="flex-1 px-6 py-3 border border-[var(--card-border)] rounded-lg text-[var(--foreground)] hover:bg-[var(--surface-3)] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReschedule}
                disabled={rescheduling}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {rescheduling ? "Reagendando..." : "Confirmar Reagendamento"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

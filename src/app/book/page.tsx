import Link from "next/link";
import { BookingCalendar } from "@/components/BookingCalendar";

export default function BookPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-700">
            MentorMatch
          </Link>
          <Link
            href="/alumni/login"
            className="text-primary-600 hover:text-primary-800 font-medium"
          >
            Alumni Login
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book a Mentoring Session
          </h1>
          <p className="text-gray-600">
            Select an available time slot to book an anonymous session with an
            alumni mentor. You will not know who you are meeting until the session.
          </p>
        </div>

        <BookingCalendar />
      </div>
    </main>
  );
}

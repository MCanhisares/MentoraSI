import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <nav className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-primary-700">MentorMatch</h1>
        <Link
          href="/alumni/login"
          className="text-primary-600 hover:text-primary-800 font-medium"
        >
          Alumni Login
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Anonymous Alumni Mentoring
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Get career guidance from experienced alumni. Book sessions anonymously
            - focus on the advice, not the names.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/book"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Book a Session
            </Link>
            <Link
              href="/alumni/login"
              className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Become a Mentor
            </Link>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Anonymous Booking
            </h3>
            <p className="text-gray-600">
              Book sessions without knowing who you will meet. Focus purely on
              getting valuable advice.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Flexible Scheduling
            </h3>
            <p className="text-gray-600">
              Alumni set their availability. Students pick from aggregated time
              slots that work for them.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Instant Calendar Sync
            </h3>
            <p className="text-gray-600">
              Sessions automatically appear in Google Calendar. No manual
              coordination needed.
            </p>
          </div>
        </div>
      </div>

      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-100">
        <p className="mb-4">Connect students with alumni mentors anonymously</p>
        <div className="flex justify-center gap-6">
          <Link href="/privacy" className="hover:text-gray-700">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-gray-700">
            Terms of Service
          </Link>
        </div>
      </footer>
    </main>
  );
}

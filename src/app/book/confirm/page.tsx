import Link from "next/link";

export default function BookingConfirmPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
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

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Session Booked!
          </h1>
          <p className="text-gray-600 mb-6">
            Your mentoring session has been confirmed. Check your email for the
            meeting details and calendar invite.
          </p>

          <div className="bg-primary-50 p-4 rounded-lg mb-6 text-left">
            <h2 className="font-medium text-primary-800 mb-2">What happens next?</h2>
            <ul className="text-sm text-primary-700 space-y-1">
              <li>1. You will receive a confirmation email</li>
              <li>2. A calendar invite will be sent to your email</li>
              <li>3. Join the meeting at the scheduled time</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              href="/book"
              className="block w-full bg-primary-600 text-white text-center px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Book Another Session
            </Link>
            <Link
              href="/"
              className="block text-primary-600 hover:text-primary-800"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

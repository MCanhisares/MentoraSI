import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - MentorMatch",
  description: "Privacy Policy for MentorMatch anonymous alumni mentoring platform",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-2xl font-bold text-primary-700">
            MentorMatch
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> January 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              MentorMatch (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you use our anonymous alumni mentoring platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-medium text-gray-800 mb-3">For Alumni (Mentors)</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Email address (via Google OAuth)</li>
              <li>Name (via Google OAuth)</li>
              <li>Google Calendar access tokens (to create meeting events)</li>
              <li>Availability schedule you set</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">For Students</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Email address (provided when booking)</li>
              <li>Booking preferences and session history</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">Automatically Collected</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Log data (IP address, browser type, pages visited)</li>
              <li>Cookies for session management</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>To facilitate anonymous mentoring session bookings</li>
              <li>To create calendar events for scheduled sessions</li>
              <li>To send booking confirmations and reminders via email</li>
              <li>To maintain and improve our platform</li>
              <li>To communicate important updates about our service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Google API Services</h2>
            <p className="text-gray-700 mb-4">
              Our use of information received from Google APIs adheres to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                className="text-primary-600 hover:text-primary-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
            <p className="text-gray-700">
              We only request access to Google Calendar to create meeting events for
              booked sessions. We do not read, modify, or delete any existing calendar events.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4">We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Service Providers:</strong> Third-party services that help us operate (e.g., Supabase for database, Resend for emails, Vercel for hosting)</li>
              <li><strong>Session Participants:</strong> When a session is booked, the student&apos;s email is shared with the matched alumni mentor</li>
              <li><strong>Legal Requirements:</strong> If required by law or to protect our rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Anonymity</h2>
            <p className="text-gray-700">
              Our platform is designed to provide anonymous bookings. Students cannot see
              which alumni mentor they will meet until the session. Alumni identities are
              not displayed on the booking interface.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Security</h2>
            <p className="text-gray-700">
              We implement appropriate technical and organizational measures to protect
              your personal information. However, no method of transmission over the
              Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
            <p className="text-gray-700">
              We retain your information for as long as your account is active or as
              needed to provide services. You may request deletion of your data by
              contacting us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Revoke Google Calendar access at any time via your Google Account settings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you
              of any changes by posting the new policy on this page and updating the
              &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-700">
              If you have questions about this Privacy Policy, please contact us at:{" "}
              <a href="mailto:support@mentormatch.com" className="text-primary-600 hover:text-primary-800">
                support@mentormatch.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-primary-600 hover:text-primary-800">
            Back to Home
          </Link>
          <span className="mx-4 text-gray-400">|</span>
          <Link href="/terms" className="text-primary-600 hover:text-primary-800">
            Terms of Service
          </Link>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";

export const metadata = {
  title: "Terms of Service - MentorMatch",
  description: "Terms of Service for MentorMatch anonymous alumni mentoring platform",
};

export default function TermsOfServicePage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> January 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing or using MentorMatch (&quot;the Service&quot;), you agree to be bound
              by these Terms of Service. If you do not agree to these terms, please do
              not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700">
              MentorMatch is an anonymous mentoring platform that connects university
              students with alumni mentors. The platform allows alumni to set their
              availability and students to book mentoring sessions without knowing
              the identity of the mentor beforehand.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>

            <h3 className="text-xl font-medium text-gray-800 mb-3">Alumni Accounts</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>You must authenticate using a valid Google account</li>
              <li>You must provide accurate information about your availability</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You grant us permission to access your Google Calendar for creating meeting events</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">Student Bookings</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You must provide a valid email address when booking</li>
              <li>You agree to attend scheduled sessions or cancel in advance</li>
              <li>You understand that mentor identity is revealed only during the session</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
            <p className="text-gray-700 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Use the Service to send spam or unsolicited communications</li>
              <li>Book sessions with no intention of attending</li>
              <li>Share confidential information disclosed during mentoring sessions without consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Mentoring Sessions</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Sessions are for educational and career guidance purposes only</li>
              <li>Mentors provide advice based on their personal experience; this is not professional consulting</li>
              <li>We do not guarantee any specific outcomes from mentoring sessions</li>
              <li>Both parties should treat each other with respect and professionalism</li>
              <li>Sessions may be conducted via Google Meet or other video conferencing tools</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cancellations</h2>
            <p className="text-gray-700">
              We encourage users to cancel sessions as early as possible if they cannot
              attend. Repeated no-shows may result in account restrictions or termination.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700">
              The Service and its original content, features, and functionality are
              owned by MentorMatch and are protected by international copyright,
              trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacy</h2>
            <p className="text-gray-700">
              Your use of the Service is also governed by our{" "}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-800">
                Privacy Policy
              </Link>
              . Please review it to understand our practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimers</h2>
            <p className="text-gray-700 mb-4">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES
              OF ANY KIND, EITHER EXPRESS OR IMPLIED.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>We do not guarantee the availability of mentors at any given time</li>
              <li>We do not verify the credentials or qualifications of alumni mentors</li>
              <li>We are not responsible for the content of mentoring sessions</li>
              <li>We do not guarantee that the Service will be uninterrupted or error-free</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, MENTORMATCH SHALL NOT BE LIABLE
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
              OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY,
              OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING
              FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
            <p className="text-gray-700">
              We may terminate or suspend your access to the Service immediately,
              without prior notice, for any reason, including breach of these Terms.
              You may also delete your account at any time by contacting us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. We will provide
              notice of significant changes by posting the new Terms on this page.
              Your continued use of the Service after changes constitutes acceptance
              of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="text-gray-700">
              These Terms shall be governed by and construed in accordance with
              applicable laws, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Us</h2>
            <p className="text-gray-700">
              If you have questions about these Terms, please contact us at:{" "}
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
          <Link href="/privacy" className="text-primary-600 hover:text-primary-800">
            Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
}

import React from "react";

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-green-700 mb-6 drop-shadow">Privacy Policy</h1>
      <div className="text-gray-700 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
            Cave is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our platform.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li><b>Account Information:</b> Name, email, phone number, and password.</li>
            <li><b>Payment Information:</b> Mobile money, card, or bank details (processed securely, not stored by Cave).</li>
            <li><b>Usage Data:</b> Transactions, services used, device info, and log data.</li>
            <li><b>Support Data:</b> Any information you provide when contacting support.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>To provide and improve our services.</li>
            <li>To process your payments and transactions.</li>
            <li>To communicate with you about your account and transactions.</li>
            <li>To comply with legal obligations and prevent fraud.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">4. Data Protection</h2>
          <p>
            We use industry-standard security measures to protect your data. Payment information is processed securely by our payment partners and is not stored on our servers.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">5. Sharing Your Information</h2>
          <p>
            We do not sell your personal information. We may share data with trusted partners (such as payment providers) only as necessary to provide our services or comply with the law.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Access, update, or delete your personal information.</li>
            <li>Object to or restrict certain processing of your data.</li>
            <li>Request a copy of your data (subject to verification).</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">7. Cookies</h2>
          <p>
            We may use cookies to improve your experience. You can control cookies through your browser settings.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any significant changes.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
          <p>
            If you have any questions or requests regarding your privacy, please contact us at <a href="mailto:support@cave.com" className="text-green-600 underline">support@cave.com</a>.
          </p>
        </section>
        <p className="text-xs text-gray-400 mt-8">This document is a sample template and should be reviewed by legal counsel before use.</p>
      </div>
    </main>
  );
} 
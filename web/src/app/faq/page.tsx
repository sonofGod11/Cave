import React from "react";

const faqs = [
  {
    question: "What services can I pay for with Cave?",
    answer: "You can pay for electricity, water, internet, airtime, data bundles, school fees, insurance, cable TV, tickets, and more—all in one app!"
  },
  {
    question: "Is Cave available everywhere in Ghana?",
    answer: "Yes! Cave is designed for all Ghanaians, no matter where you are. As long as you have internet access, you can use Cave."
  },
  {
    question: "How secure are my payments?",
    answer: "Your security is our top priority. We use bank-level encryption and never store your payment details."
  },
  {
    question: "How do I get help if I have an issue?",
    answer: "Our customer support team is available 24/7. Just use the Help button on the site or email support@cave.com."
  },
  {
    question: "Are there any fees?",
    answer: "Most payments are free, but some services may have a small processing fee. All fees are shown before you pay."
  },
  {
    question: "How do I download the Cave app?",
    answer: "Click the 'Download App' button in the navigation bar or visit the Google Play Store or Apple App Store and search for 'Cave'."
  }
];

export default function FAQPage() {
  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-green-700 mb-4 drop-shadow">Frequently Asked Questions</h1>
      <p className="text-lg text-gray-700 mb-8">Find answers to common questions about using Cave in Ghana.</p>
      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-6 border-l-4 border-green-400">
            <h2 className="text-xl font-semibold text-green-700 mb-2">{faq.question}</h2>
            <p className="text-gray-700">{faq.answer}</p>
          </div>
        ))}
      </div>
    </main>
  );
} 
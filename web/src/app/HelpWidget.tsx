"use client";
import { useState } from "react";

const faqs = [
  { q: "Why should I use Cave?", a: "Cave offers a secure, all-in-one platform to pay for all your bills and subscriptions in Ghana, with instant notifications and PCI DSS compliance." },
  { q: "Is Cave safe and secure to use?", a: "Yes! We use bank-level security and are PCI DSS compliant to keep your data and transactions safe." },
  { q: "Can I buy data bundles for any network?", a: "Yes, Cave supports all major networks in Ghana for data bundle purchases." },
  { q: "How fast is airtime topup?", a: "Airtime topups are processed instantly, 24/7." },
  { q: "Which utility bills can I pay?", a: "You can pay for electricity, water, and more—all from your Cave dashboard." },
  { q: "Can I pay for DStv, GOtv, and other cable TV?", a: "Yes, Cave supports payments for all major cable TV providers in Ghana." },
];

export default function HelpWidget() {
  const [showHelp, setShowHelp] = useState(false);
  const [faqSearch, setFaqSearch] = useState("");
  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(faqSearch.toLowerCase()));
  return (
    <>
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 z-50 bg-green-600 text-white rounded-full shadow-lg p-4 hover:bg-green-700 transition-all flex items-center gap-2"
      >
        <span role="img" aria-label="help">💬</span> Help
      </button>
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
            <button onClick={() => setShowHelp(false)} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
            <h3 className="text-xl font-bold mb-4 text-green-700">How can we help?</h3>
            <input
              type="text"
              placeholder="Search FAQs..."
              value={faqSearch}
              onChange={e => setFaqSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 placeholder-gray-500 mb-4"
            />
            <div className="max-h-72 overflow-y-auto space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-gray-400 text-center">No FAQs found.</div>
              ) : (
                filteredFaqs.map(f => (
                  <div key={f.q} className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="font-semibold text-green-700 mb-1">{f.q}</div>
                    <div className="text-gray-700 text-sm">{f.a}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 
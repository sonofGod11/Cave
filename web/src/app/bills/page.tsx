"use client";
export default function Bills() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100/40 to-orange-100/30 px-4">
      <div className="flex flex-col items-center justify-center text-center max-w-md w-full py-10 rounded-2xl bg-white/70 shadow-lg">
        <div className="mb-4">
          <svg width="56" height="56" fill="none" viewBox="0 0 56 56" className="mx-auto mb-2">
            <rect x="8" y="16" width="40" height="24" rx="8" fill="#3B82F6" fillOpacity="0.15" />
            <rect x="16" y="26" width="24" height="4" rx="2" fill="#3B82F6" fillOpacity="0.5" />
            <circle cx="44" cy="28" r="4" fill="#F59E42" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">Bills</h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6">Select a service from the dashboard to pay your bills.</p>
        <a href="/dashboard" className="inline-block px-6 py-3 rounded-full bg-blue-600 text-white font-semibold text-base shadow hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400">Back to Dashboard</a>
      </div>
    </div>
  );
} 
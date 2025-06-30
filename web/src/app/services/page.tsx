import React from "react";

const services = [
  {
    name: "Electricity",
    icon: "💡",
    description: "Pay your ECG and other electricity bills instantly."
  },
  {
    name: "Water",
    icon: "🚰",
    description: "Settle your Ghana Water bills with ease."
  },
  {
    name: "Internet",
    icon: "🌐",
    description: "Pay for broadband, fiber, and mobile internet."
  },
  {
    name: "Airtime",
    icon: "📱",
    description: "Top up your phone with airtime for all major networks."
  },
  {
    name: "Data Bundles",
    icon: "📶",
    description: "Buy data bundles for MTN, Vodafone, AirtelTigo, and more."
  },
  {
    name: "Education",
    icon: "🎓",
    description: "Pay school fees and exam fees for top Ghanaian institutions."
  },
  {
    name: "Cable TV",
    icon: "📺",
    description: "Pay for DStv, GOtv, StarTimes, and other TV services."
  },
  {
    name: "Tickets",
    icon: "🎟️",
    description: "Book event and travel tickets easily."
  },
  {
    name: "Plane Tickets",
    icon: "✈️",
    description: "Book domestic and international flights."
  },
  {
    name: "Insurance",
    icon: "🛡️",
    description: "Pay for health, auto, life, and travel insurance."
  }
];

export default function ServicesPage() {
  return (
    <main className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-green-700 mb-4 drop-shadow">Our Services</h1>
      <p className="text-lg text-gray-700 mb-8">Cave lets you pay for all your essential services in Ghana—quickly, securely, and in one place.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <div key={service.name} className="bg-white rounded-2xl shadow p-6 flex flex-col items-center border-t-4 border-green-400 hover:scale-105 transition-transform">
            <span className="text-4xl mb-3">{service.icon}</span>
            <div className="text-xl font-bold text-green-700 mb-1">{service.name}</div>
            <p className="text-gray-700 text-center">{service.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
} 
"use client";
import Link from "next/link";
import { useState } from "react";

const features = [
  {
    title: "Secure Payments",
    description: "Your transactions are protected with bank-level security and PCI DSS compliance.",
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 40 40" className="drop-shadow-lg">
        <rect x="5" y="10" width="30" height="20" rx="6" fill="#3B82F6" fillOpacity="0.8" />
        <rect x="10" y="18" width="20" height="4" rx="2" fill="#fff" />
        <circle cx="32" cy="20" r="3" fill="#F59E42" />
      </svg>
    ),
  },
  {
    title: "All Bills in One Place",
    description: "Pay for electricity, water, internet, airtime, education, TV, tickets, and more—all from one dashboard.",
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 40 40" className="drop-shadow-lg">
        <rect x="8" y="8" width="24" height="24" rx="6" fill="#F59E42" fillOpacity="0.8" />
        <rect x="14" y="14" width="12" height="4" rx="2" fill="#fff" />
        <rect x="14" y="22" width="12" height="4" rx="2" fill="#fff" />
      </svg>
    ),
  },
  {
    title: "Instant Notifications",
    description: "Get real-time updates on your payments and subscriptions, so you're always in control.",
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 40 40" className="drop-shadow-lg animate-pulse">
        <ellipse cx="20" cy="24" rx="12" ry="8" fill="#22C55E" fillOpacity="0.8" />
        <circle cx="20" cy="16" r="6" fill="#fff" />
        <circle cx="20" cy="16" r="3" fill="#3B82F6" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    name: "Kwame A.",
    role: "Entrepreneur, Accra",
    text: "Cave makes paying my bills so easy and fast. I love the instant notifications and the beautiful interface!"
  },
  {
    name: "Ama S.",
    role: "Parent, Kumasi",
    text: "I can pay for everything in one place—electricity, water, even my kids' school fees. Highly recommended!"
  },
  {
    name: "Yaw B.",
    role: "IT Specialist, Takoradi",
    text: "Security is my top concern, and Cave gives me peace of mind with every transaction."
  },
  {
    name: "Efua M.",
    role: "Teacher, Cape Coast",
    text: "The customer support is fantastic. I had an issue and it was resolved in minutes. Cave truly cares about its users!"
  },
  {
    name: "Kojo D.",
    role: "Student, Legon",
    text: "I love how simple and fast it is to buy airtime and data. Cave is a lifesaver for students!"
  }
];

const faqData = [
  {
    category: "General Questions",
    questions: [
      {
        q: "Why should I use Cave?",
        a: "Cave offers a secure, all-in-one platform to pay for all your bills and subscriptions in Ghana, with instant notifications and PCI DSS compliance.",
      },
      {
        q: "Is Cave safe and secure to use?",
        a: "Yes! We use bank-level security and are PCI DSS compliant to keep your data and transactions safe.",
      },
    ],
  },
  {
    category: "Data Bundle Questions",
    questions: [
      {
        q: "Can I buy data bundles for any network?",
        a: "Yes, Cave supports all major networks in Ghana for data bundle purchases.",
      },
    ],
  },
  {
    category: "Airtime Topup Questions",
    questions: [
      {
        q: "How fast is airtime topup?",
        a: "Airtime topups are processed instantly, 24/7.",
      },
    ],
  },
  {
    category: "Utility Bills Questions",
    questions: [
      {
        q: "Which utility bills can I pay?",
        a: "You can pay for electricity, water, and more—all from your Cave dashboard.",
      },
    ],
  },
  {
    category: "Cable TV Questions",
    questions: [
      {
        q: "Can I pay for DStv, GOtv, and other cable TV?",
        a: "Yes, Cave supports payments for all major cable TV providers in Ghana.",
      },
    ],
  },
];

function ServicesSection() {
  const services = [
    {
      name: "Electricity Bills",
      description: "Never miss a due date or wait in long lines again! Pay your electricity bills with ease using Cave.",
      icon: (
        <span className="inline-block bg-green-100 p-3 rounded-full mb-2"><span role="img" aria-label="electricity">⚡</span></span>
      ),
    },
    {
      name: "Water Bills",
      description: "Pay your water bills quickly and securely, all from your Cave dashboard.",
      icon: (
        <span className="inline-block bg-green-100 p-3 rounded-full mb-2"><span role="img" aria-label="water">💧</span></span>
      ),
    },
    {
      name: "Internet Bills",
      description: "Settle your internet bills for all major providers in Ghana, anytime.",
      icon: (
        <span className="inline-block bg-green-100 p-3 rounded-full mb-2"><span role="img" aria-label="internet">🌐</span></span>
      ),
    },
    {
      name: "Airtime Topup",
      description: "Stay connected with your loved ones and top up your airtime instantly. Available 24/7!",
      icon: (
        <span className="inline-block bg-green-100 p-3 rounded-full mb-2"><span role="img" aria-label="airtime">📱</span></span>
      ),
    },
    {
      name: "Data Bundles",
      description: "Buy data bundles for all networks in Ghana, fast and easy.",
      icon: (
        <span className="inline-block bg-green-100 p-3 rounded-full mb-2"><span role="img" aria-label="data">📶</span></span>
      ),
    },
    {
      name: "Education Bills",
      description: "Pay for tuition, fees, and other education-related bills stress-free.",
      icon: (
        <span className="inline-block bg-green-100 p-3 rounded-full mb-2"><span role="img" aria-label="education">🎓</span></span>
      ),
    },
    {
      name: "Cable TV",
      description: "Pay for DStv, GOtv, and other cable TV providers easily.",
      icon: (
        <span className="inline-block bg-green-100 p-3 rounded-full mb-2"><span role="img" aria-label="cable tv">📺</span></span>
      ),
    },
    {
      name: "Tickets",
      description: "Buy tickets for events, transport, and more—all in one place.",
      icon: (
        <span className="inline-block bg-green-100 p-3 rounded-full mb-2"><span role="img" aria-label="tickets">🎫</span></span>
      ),
    },
  ];
  return (
    <section className="w-full py-28 flex flex-col items-center px-2" style={{background: 'radial-gradient(circle at 60% 40%, #6D28D9 0%, #EC4899 40%, #F59E42 70%, #22C55E 100%)'}}>
      <h2 className="text-4xl font-extrabold text-center mb-8 text-white drop-shadow-lg">Our Services</h2>
      <p className="text-lg text-center text-white mb-16 max-w-2xl drop-shadow">Pay all your bills at once, without leaving your home. Cave offers a comprehensive range of services for your convenience.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full max-w-6xl">
        {services.map((service) => (
          <div key={service.name} className="bg-white rounded-2xl p-10 flex flex-col items-center text-center border border-green-100 w-full max-w-xs mx-auto transition-transform hover:scale-105 shadow-none">
            <span className="inline-block bg-green-100 p-5 rounded-full mb-4 text-6xl">{service.icon.props.children}</span>
            <h3 className="font-bold text-lg mb-2 text-gray-900">{service.name}</h3>
            <p className="text-base text-gray-700">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [openQuestion, setOpenQuestion] = useState<Record<number, number | null>>({});

  const handleCategory = (idx: number) => {
    setOpenCategory(openCategory === idx ? null : idx);
    setOpenQuestion({});
  };
  const handleQuestion = (catIdx: number, qIdx: number) => {
    setOpenQuestion((prev) => ({
      ...prev,
      [catIdx]: prev[catIdx] === qIdx ? null : qIdx,
    }));
  };

  return (
    <section className="relative z-10 mt-16 sm:mt-24 w-full flex flex-col items-center px-2 sm:px-0">
      <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-6 sm:mb-8 drop-shadow-md text-center">Checkout our FAQs</h2>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full max-w-5xl justify-center">
        {/* Categories List */}
        <div className="flex-1 bg-green-600/90 rounded-3xl p-4 sm:p-6 flex flex-col gap-2 sm:gap-4 shadow-xl border border-white/20 min-w-[220px] sm:min-w-[260px] mb-4 sm:mb-0">
          {faqData.map((cat, catIdx) => (
            <div key={cat.category}>
              <button
                className="flex items-center w-full text-left px-4 py-3 rounded-full bg-white/90 text-green-700 font-semibold text-base sm:text-lg shadow mb-2 focus:outline-none transition-all"
                onClick={() => handleCategory(catIdx)}
              >
                <span className="mr-2">{openCategory === catIdx ? "▼" : "▶"}</span>
                {cat.category}
              </button>
              {openCategory === catIdx && (
                <div className="flex flex-col gap-2 mt-2">
                  {cat.questions.map((q, qIdx) => (
                    <button
                      key={q.q}
                      className="flex items-center w-full text-left px-4 py-2 rounded-lg bg-white/70 text-green-900 font-medium text-base sm:text-lg shadow focus:outline-none transition-all"
                      onClick={() => handleQuestion(catIdx, qIdx)}
                    >
                      <span className="mr-2">{openQuestion[catIdx] === qIdx ? "▼" : "▶"}</span>
                      {q.q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Questions & Answers */}
        <div className="flex-1 flex flex-col gap-2 sm:gap-4 justify-center">
          {openCategory !== null && faqData[openCategory].questions.map((q, qIdx) => (
            <div key={q.q} className="mb-2">
              <button
                className="flex items-center w-full text-left px-4 py-3 rounded-full bg-white/90 text-blue-700 font-semibold text-base sm:text-lg shadow focus:outline-none transition-all"
                onClick={() => handleQuestion(openCategory, qIdx)}
              >
                <span className="mr-2">{openQuestion[openCategory] === qIdx ? "▼" : "▶"}</span>
                {q.q}
              </button>
              {openQuestion[openCategory] === qIdx && (
                <div className="px-6 py-3 bg-white/70 rounded-lg text-blue-900 mt-2 shadow-inner text-base sm:text-lg">
                  {q.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DownloadButtons() {
  return (
    <div className="flex gap-4 mt-6">
      <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-12" /></a>
      <a href="#"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="h-12" /></a>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative w-full min-h-[600px] flex flex-col items-center justify-center overflow-hidden py-24 px-4" style={{background: 'radial-gradient(circle at 60% 40%, #6D28D9 0%, #EC4899 40%, #F59E42 70%, #22C55E 100%)'}}>
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
        <span className="inline-flex items-center bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-full mb-6 text-base shadow">New <span className="ml-2">Cave is live in Ghana →</span></span>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 leading-tight text-center drop-shadow-lg">Your One-Stop Hub for Every Payment.</h1>
        <p className="text-xl sm:text-2xl text-white mb-8 max-w-2xl text-center">No more stress—pay for electricity, water, internet, and more in seconds, all in one app.</p>
        <a href="/signup" className="inline-block px-10 py-4 rounded-full bg-white text-green-700 font-bold text-xl shadow-lg hover:bg-green-100 transition-all mb-4">
          Get Started
        </a>
      </div>
    </section>
  );
}

function ThreeStepsSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center py-24" style={{background: 'radial-gradient(circle at 60% 40%, #6D28D9 0%, #EC4899 40%, #F59E42 70%, #22C55E 100%)'}}>
      <h2 className="text-4xl sm:text-5xl font-extrabold mb-10 text-white text-center drop-shadow-lg">Get Started in 3 Easy Steps</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl">
        <div className="flex flex-col items-center bg-white rounded-2xl p-8 shadow-sm">
          <span className="text-5xl mb-4">📱</span>
          <h3 className="text-xl font-bold mb-2 text-gray-900 text-center">Download Cave</h3>
          <p className="text-gray-600 text-center">Find "Cave" in your app store and install it on your phone.</p>
        </div>
        <div className="flex flex-col items-center bg-white rounded-2xl p-8 shadow-sm">
          <span className="text-5xl mb-4">📝</span>
          <h3 className="text-xl font-bold mb-2 text-gray-900 text-center">Create Your Free Account</h3>
          <p className="text-gray-600 text-center">Open the app and sign up in seconds. All you need is your basic info!</p>
        </div>
        <div className="flex flex-col items-center bg-white rounded-2xl p-8 shadow-sm">
          <span className="text-5xl mb-4">💸</span>
          <h3 className="text-xl font-bold mb-2 text-gray-900 text-center">Add Money & Pay Bills</h3>
          <p className="text-gray-600 text-center">Top up your account and pay your bills—fast, easy, and secure.</p>
        </div>
      </div>
      <a href="#download" className="mt-12 px-10 py-4 rounded-full bg-white text-green-700 font-bold text-xl shadow-lg hover:bg-green-100 transition-all">Download Cave Now</a>
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden bg-green-600">
      <HeroSection />
      <ThreeStepsSection />
      <ServicesSection />
      {/* Ghanaian Service Providers Section */}
      <section className="relative z-10 w-full flex flex-col items-center py-24" style={{background: 'radial-gradient(circle at 60% 40%, #6D28D9 0%, #EC4899 40%, #F59E42 70%, #22C55E 100%)'}}>
        <h2 className="text-4xl font-extrabold text-center mb-8 text-white drop-shadow-lg">Trusted by Ghana's Top Service Providers</h2>
        <p className="text-lg text-white mb-16 text-center drop-shadow">Making life easier for users across Ghana</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 w-full max-w-6xl px-2">
          {[
            { name: 'MTN', color: 'yellow', logo: '/MTN.jpg' },
            { name: 'Telecel', color: 'red', logo: '/Telecel.jpg' },
            { name: 'AirtelTigo', color: 'pink', logo: '/AirtelTigo.jpg' },
            { name: 'ECG', color: 'blue', logo: '/ECG.jpg' },
            { name: 'Ghana Water', color: 'cyan', logo: '/GWCL.jpg' },
            { name: 'DStv', color: 'indigo', logo: '/DStv.jpg' },
            { name: 'GOtv', color: 'orange', logo: '/GOtv.jpg' },
            { name: 'StarTimes', color: 'purple', logo: '/StarTimes.jpg' },
            { name: 'SIC Insurance', color: 'green', logo: '/SIC.jpg' },
            { name: 'Enterprise Insurance', color: 'lime', logo: '/EnterpriseInsurance.jpg' },
            { name: 'Prudential', color: 'emerald', logo: '/Prudential.jpg' },
            { name: 'UBA', color: 'gray', logo: '/UBA.jpg' },
            { name: 'Ecobank', color: 'blue', logo: '/Ecobank.jpg' },
            { name: 'GCB', color: 'green', logo: '/GCB.jpg' },
            { name: 'Ashesi University', color: 'yellow', logo: '/Ashesi.jpg' },
            { name: 'KNUST', color: 'orange', logo: '/Knust.jpg' },
            { name: 'UCC', color: 'blue', logo: '/UCC.jpg' },
            { name: 'Ghana Post', color: 'gray', logo: '/Ghanapost.jpg' },
            { name: 'National Lottery', color: 'green', logo: '/National_Lottery_Authority.jpg' },
            { name: 'GRA', color: 'red', logo: '/GRA.jpg' },
            { name: 'WAEC', color: 'blue', logo: '/WAEC.jpg' },
            { name: 'African World Airlines', color: 'cyan', logo: '/AfricanWorldAirlines.jpg' },
            { name: 'Passion Air', color: 'yellow', logo: '/PassionAir.jpg' },
          ].map((company, i) => (
            <div
              key={company.name}
              className="flex flex-col items-center bg-white rounded-2xl p-6 border border-gray-100 transition-transform hover:scale-105"
            >
              <img src={company.logo} alt={company.name} className="h-14 w-auto mb-4 object-contain" />
              <span className="font-semibold text-gray-900 text-center text-base mt-auto">{company.name}</span>
            </div>
          ))}
        </div>
      </section>
      {/* Animated Down Arrow */}
      <div className="relative z-10 flex justify-center mt-4 mb-2 animate-bounce-slow">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
          <circle cx="18" cy="18" r="18" fill="#3B82F6" fillOpacity="0.15" />
          <path d="M12 16l6 6 6-6" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {/* Feature Highlights Section */}
      <section className="relative z-10 py-24 w-full flex flex-col items-center" style={{background: 'radial-gradient(circle at 60% 40%, #6D28D9 0%, #EC4899 40%, #F59E42 70%, #22C55E 100%)'}}>
        <h2 className="text-4xl font-extrabold text-center mb-12 text-white drop-shadow-lg">How Cave Works</h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-12 w-full max-w-5xl">
          <div className="flex flex-col items-center">
            <span className="text-5xl bg-green-100 p-5 rounded-full mb-4">📝</span>
            <h3 className="text-lg font-bold mb-2 text-gray-900 text-center">Sign Up</h3>
            <p className="text-gray-600 text-center max-w-xs">Create your free Cave account in seconds with just your basic info.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-5xl bg-green-100 p-5 rounded-full mb-4">💳</span>
            <h3 className="text-lg font-bold mb-2 text-gray-900 text-center">Add Funds</h3>
            <p className="text-gray-600 text-center max-w-xs">Top up your Cave wallet securely using mobile money or bank card.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-5xl bg-green-100 p-5 rounded-full mb-4">🧾</span>
            <h3 className="text-lg font-bold mb-2 text-gray-900 text-center">Pay Any Bill</h3>
            <p className="text-gray-600 text-center max-w-xs">Choose from electricity, water, internet, TV, school fees, and more.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-5xl bg-green-100 p-5 rounded-full mb-4">⚡</span>
            <h3 className="text-lg font-bold mb-2 text-gray-900 text-center">Get Instant Confirmation</h3>
            <p className="text-gray-600 text-center max-w-xs">Receive real-time notifications and receipts for every payment.</p>
          </div>
        </div>
      </section>
      {/* Trust Badges Section */}
      <section className="relative z-10 py-10 flex flex-wrap justify-center gap-12 items-center mt-20" style={{background: 'radial-gradient(circle at 60% 40%, #6D28D9 0%, #EC4899 40%, #F59E42 70%, #22C55E 100%)'}}>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#3B82F6" /><text x="12" y="16" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">PCI</text></svg>
          <span className="text-gray-900 font-semibold">PCI DSS Compliant</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="8" fill="#22C55E" /><path d="M8 12l2.5 2.5L16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="text-green-700 font-semibold">Secured</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="6" fill="#22C55E" /><text x="12" y="16" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">Ghana</text></svg>
          <span className="text-green-700 font-semibold">Trusted in Ghana</span>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="relative z-10 mt-16 w-full flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 drop-shadow-md text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl justify-center">
          {/* First row: 3 reviews */}
          {[0,1,2].map(idx => (
            <div
              key={testimonials[idx].name}
              className="group flex flex-col bg-white rounded-2xl p-6 shadow-xl border border-gray-100 transition-transform duration-300 hover:scale-105 relative overflow-hidden"
              style={{
                background: idx === 0
                  ? 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)'
                  : idx === 1
                  ? 'linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)'
                  : 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${idx === 0 ? 'bg-teal-400 text-white' : idx === 1 ? 'bg-yellow-400 text-white' : 'bg-purple-400 text-white'}`}>{testimonials[idx].name[0]}</div>
                <div>
                  <div className="font-extrabold text-gray-900">{testimonials[idx].name}</div>
                  <div className="text-gray-500 text-sm">{testimonials[idx].role}</div>
                </div>
              </div>
              <p className="relative z-10 text-gray-700 text-lg mb-2 italic">"{testimonials[idx].text}"</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl justify-center mt-8">
          {/* Second row: 2 reviews */}
          {[3,4].map(idx => (
            <div
              key={testimonials[idx].name}
              className="group flex flex-col bg-white rounded-2xl p-6 shadow-xl border border-gray-100 transition-transform duration-300 hover:scale-105 relative overflow-hidden"
              style={{
                background: idx === 3
                  ? 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)'
                  : 'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${idx === 3 ? 'bg-red-400 text-white' : 'bg-green-400 text-white'}`}>{testimonials[idx].name[0]}</div>
                <div>
                  <div className="font-extrabold text-gray-900">{testimonials[idx].name}</div>
                  <div className="text-gray-500 text-sm">{testimonials[idx].role}</div>
                </div>
              </div>
              <p className="relative z-10 text-gray-700 text-lg mb-2 italic">"{testimonials[idx].text}"</p>
            </div>
          ))}
        </div>
      </section>
      <FAQSection />

      {/* Redesigned Professional Multi-Column Footer */}
      <footer className="relative z-10 w-full bg-green-600 text-gray-200 mt-24 pt-16 pb-8 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-12 md:gap-8">
          {/* About/Brand */}
          <div className="flex-1 min-w-[220px] flex flex-col gap-3 mb-8 md:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
                <span className="text-2xl font-extrabold text-green-600 tracking-wide">Cave</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-300">
              Tired of juggling multiple payment apps? Cave brings all your essential payments together on Ghana's most trusted platform. Electricity, water, internet, airtime, education – we've got you covered with secure, instant payments.
            </p>
            <div className="mt-2 text-xs text-gray-400">
              <b>Address:</b> Accra, Ghana
            </div>
          </div>
          {/* Services */}
          <div className="flex-1 min-w-[160px]">
            <div className="font-bold text-lg mb-3 text-white">Services</div>
            <ul className="space-y-1 text-sm">
              <li>Electricity payments</li>
              <li>Water bills</li>
              <li>Internet & data bundles</li>
              <li>Airtime top-ups</li>
              <li>Education fees</li>
              <li>Cable TV</li>
              <li>Insurance</li>
              <li>Tickets & flights</li>
            </ul>
          </div>
          {/* Company */}
          <div className="flex-1 min-w-[160px]">
            <div className="font-bold text-lg mb-3 text-white">Company</div>
            <ul className="space-y-1 text-sm">
              <li><a href="/about" className="hover:underline">About Us</a></li>
              <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:underline">Terms of Use</a></li>
              <li><a href="#contact" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>
          {/* Info */}
          <div className="flex-1 min-w-[160px]">
            <div className="font-bold text-lg mb-3 text-white">Info</div>
            <div className="text-sm font-bold mb-1 text-gray-100">(+233) 20 000 0000</div>
            <div className="text-sm mb-1 text-gray-300">support@cave.com</div>
          </div>
          {/* Follow Us */}
          <div className="flex-1 min-w-[160px]">
            <div className="font-bold text-lg mb-3 text-white">Follow us</div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <svg width="20" height="20" fill="currentColor" className="text-blue-400"><path d="M20 3.924a8.19 8.19 0 0 1-2.357.646A4.118 4.118 0 0 0 19.448 2.3a8.224 8.224 0 0 1-2.605.996A4.107 4.107 0 0 0 9.85 6.03a11.65 11.65 0 0 1-8.457-4.287a4.106 4.106 0 0 0 1.27 5.482A4.073 4.073 0 0 1 .8 6.575v.052a4.108 4.108 0 0 0 3.292 4.025a4.095 4.095 0 0 1-1.853.07a4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 0 17.542A11.616 11.616 0 0 0 6.29 19.5c7.547 0 11.675-6.155 11.675-11.49c0-.175-.004-.349-.012-.522A8.18 8.18 0 0 0 20 3.924Z"/></svg>
                <a href="#" className="hover:underline">Twitter</a>
              </li>
              <li className="flex items-center gap-2">
                <svg width="20" height="20" fill="currentColor" className="text-blue-600"><path d="M18.896 0H1.104C.494 0 0 .494 0 1.104v17.792C0 19.506.494 20 1.104 20h9.583v-7.729H8.077V9.237h2.61V7.077c0-2.587 1.582-3.997 3.892-3.997c1.106 0 2.055.082 2.333.119v2.705h-1.6c-1.257 0-1.5.597-1.5 1.473v1.93h3l-.391 3.034h-2.609V20h5.116c.61 0 1.104-.494 1.104-1.104V1.104C20 .494 19.506 0 18.896 0"/></svg>
                <a href="#" className="hover:underline">Facebook</a>
              </li>
              <li className="flex items-center gap-2">
                <svg width="20" height="20" fill="currentColor" className="text-pink-500"><path d="M10 2.163c2.577 0 2.885.01 3.897.056c1.064.049 1.637.217 2.02.362c.497.192.855.423 1.23.798c.375.375.606.733.798 1.23c.145.383.313.956.362 2.02c.046 1.012.056 1.32.056 3.897s-.01 2.885-.056 3.897c-.049 1.064-.217 1.637-.362 2.02a2.978 2.978 0 0 1-.798 1.23a2.978 2.978 0 0 1-1.23.798c-.383.145-.956.313-2.02.362c-1.012.046-1.32.056-3.897.056s-2.885-.01-3.897-.056c-1.064-.049-1.637-.217-2.02-.362a2.978 2.978 0 0 1-1.23-.798a2.978 2.978 0 0 1-.798-1.23c-.145-.383-.313-.956-.362-2.02C2.173 12.885 2.163 12.577 2.163 10s.01-2.885.056-3.897c.049-1.064.217-1.637.362-2.02a2.978 2.978 0 0 1 .798-1.23a2.978 2.978 0 0 1 1.23-.798c.383-.145.956-.313 2.02-.362C7.115 2.173 7.423 2.163 10 2.163m0-2.163C7.403 0 7.09.01 6.062.057c-1.027.047-1.73.215-2.34.462a4.978 4.978 0 0 0-1.81 1.18A4.978 4.978 0 0 0 .519 3.722c-.247.61-.415 1.313-.462 2.34C.01 7.09 0 7.403 0 10c0 2.597.01 2.91.057 3.938c.047 1.027.215 1.73.462 2.34a4.978 4.978 0 0 0 1.18 1.81a4.978 4.978 0 0 0 1.81 1.18c.61.247 1.313.415 2.34.462C7.09 19.99 7.403 20 10 20s2.91-.01 3.938-.057c1.027-.047 1.73-.215 2.34-.462a4.978 4.978 0 0 0 1.81-1.18a4.978 4.978 0 0 0 1.18-1.81c.247-.61.415-1.313.462-2.34C19.99 12.91 20 12.597 20 10c0-2.597-.01-2.91-.057-3.938c-.047-1.027-.215-1.73-.462-2.34a4.978 4.978 0 0 0-1.18-1.81a4.978 4.978 0 0 0-1.81-1.18c-.61-.247-1.313-.415-2.34-.462C12.91.01 12.597 0 10 0z"/><circle cx="10" cy="10" r="3.5"/></svg>
                <a href="#" className="hover:underline">Instagram</a>
              </li>
              <li className="flex items-center gap-2">
                <svg width="20" height="20" fill="currentColor" className="text-blue-500"><path d="M17.5 17.5h-15v-15h15v15zm-7.5-2.5c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5zm0-8.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5s-1.57-3.5-3.5-3.5z"/></svg>
                <a href="#" className="hover:underline">LinkedIn</a>
              </li>
              <li className="flex items-center gap-2">
                <svg width="20" height="20" fill="currentColor" className="text-green-400"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967c-.273-.099-.472-.148-.67.15c-.198.297-.767.967-.94 1.166c-.173.198-.347.223-.644.074c-.297-.149-1.255-.463-2.39-1.475c-.883-.788-1.48-1.761-1.653-2.059c-.173-.297-.018-.458.13-.606c.134-.133.298-.347.446-.52c.149-.174.198-.298.298-.497c.099-.198.05-.372-.025-.521c-.075-.149-.67-1.612-.916-2.207c-.242-.58-.487-.501-.67-.511c-.173-.008-.372-.01-.57-.01c-.198 0-.52.074-.792.372c-.272.297-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074c.149.198 2.099 3.21 5.09 4.374c.712.307 1.267.489 1.7.625c.714.227 1.364.195 1.877.118c.573-.085 1.758-.719 2.007-1.413c.248-.694.248-1.288.173-1.413c-.074-.124-.272-.198-.57-.347z"/></svg>
                <a href="#" className="hover:underline">WhatsApp</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full text-center text-xs text-gray-400 pt-8 mt-8 border-t border-gray-800">
          &copy; {new Date().getFullYear()} Cave. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

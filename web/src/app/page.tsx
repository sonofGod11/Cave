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
    <section className="w-full py-20 bg-green-50 flex flex-col items-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-4 text-gray-900">Our Services</h2>
      <p className="text-lg text-center text-gray-700 mb-10 max-w-2xl">Pay all your bills at once, without leaving your home. Cave offers a comprehensive range of services for your convenience.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {services.map((service) => (
          <div key={service.name} className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center border border-green-100">
            {service.icon}
            <h3 className="font-bold text-lg mb-2 text-gray-900">{service.name}</h3>
            <p className="text-gray-700 text-base">{service.description}</p>
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
    <section className="relative z-10 mt-24 w-full flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-8 drop-shadow-md text-center">Checkout our FAQs</h2>
      <div className="flex flex-col sm:flex-row gap-8 w-full max-w-5xl justify-center">
        {/* Categories List */}
        <div className="flex-1 bg-green-600/90 rounded-3xl p-6 flex flex-col gap-4 shadow-xl border border-white/20 min-w-[260px]">
          {faqData.map((cat, catIdx) => (
            <div key={cat.category}>
              <button
                className="flex items-center w-full text-left px-4 py-3 rounded-full bg-white/90 text-green-700 font-semibold text-lg shadow mb-2 focus:outline-none transition-all"
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
                      className="flex items-center w-full text-left px-4 py-2 rounded-lg bg-white/70 text-green-900 font-medium shadow focus:outline-none transition-all"
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
        <div className="flex-1 flex flex-col gap-4 justify-center">
          {openCategory !== null && faqData[openCategory].questions.map((q, qIdx) => (
            <div key={q.q} className="mb-2">
              <button
                className="flex items-center w-full text-left px-4 py-3 rounded-full bg-white/90 text-blue-700 font-semibold text-lg shadow focus:outline-none transition-all"
                onClick={() => handleQuestion(openCategory, qIdx)}
              >
                <span className="mr-2">{openQuestion[openCategory] === qIdx ? "▼" : "▶"}</span>
                {q.q}
              </button>
              {openQuestion[openCategory] === qIdx && (
                <div className="px-6 py-3 bg-white/70 rounded-lg text-blue-900 mt-2 shadow-inner">
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
    <section className="relative w-full min-h-[600px] flex items-center justify-center bg-green-600 overflow-hidden" style={{background: 'linear-gradient(120deg, #22c55e 0%, #16a34a 100%)'}}>
      {/* Abstract lines background */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 100 Q360 200 720 100 T1440 100" stroke="#fff" strokeOpacity="0.13" strokeWidth="4" fill="none" />
        <path d="M0 300 Q360 400 720 300 T1440 300" stroke="#fff" strokeOpacity="0.13" strokeWidth="4" fill="none" />
        <path d="M0 500 Q360 600 720 500 T1440 500" stroke="#fff" strokeOpacity="0.13" strokeWidth="4" fill="none" />
      </svg>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl px-6 py-16">
        {/* Left: Text */}
        <div className="flex-1 flex flex-col items-start justify-center max-w-xl">
          <span className="inline-flex items-center bg-white text-green-600 font-semibold px-4 py-2 rounded-full mb-6 text-base shadow">New <span className="ml-2">Cave is live in Ghana →</span></span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">Your One-Stop Hub for Every Payment.</h1>
          <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-lg">No more stress—pay for electricity, water, internet, and more in seconds, all in one app.</p>
          <a href="/signup" className="inline-block px-8 py-3 rounded-full border-2 border-green-500 text-white font-semibold text-lg bg-green-600 hover:bg-green-700 transition-all mb-4">
            Get Started
          </a>
          <DownloadButtons />
        </div>
        {/* Right: Floating phone images (placeholder SVGs) */}
        <div className="flex-1 flex items-center justify-center relative mt-12 md:mt-0">
          <svg width="220" height="420" viewBox="0 0 220 420" className="absolute left-0 top-8 rotate-[-15deg] drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="200" height="400" rx="40" fill="#fff" stroke="#ddd" strokeWidth="8" />
            <rect x="30" y="60" width="160" height="300" rx="24" fill="#f3f4f6" />
            <rect x="80" y="380" width="60" height="12" rx="6" fill="#eee" />
          </svg>
          <svg width="220" height="420" viewBox="0 0 220 420" className="absolute right-0 top-0 rotate-[10deg] drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="200" height="400" rx="40" fill="#fff" stroke="#ddd" strokeWidth="8" />
            <rect x="30" y="60" width="160" height="300" rx="24" fill="#e0e7ff" />
            <rect x="80" y="380" width="60" height="12" rx="6" fill="#eee" />
          </svg>
        </div>
      </div>
    </section>
  );
}

function ThreeStepsSection() {
  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-center py-20 bg-white">
      {/* Left: Phone image in a green-accented circle */}
      <div className="flex-1 flex justify-center items-center mb-10 md:mb-0">
        <div className="relative w-80 h-80 flex items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-400">
          {/* Placeholder phone SVG */}
          <svg width="180" height="360" viewBox="0 0 180 360" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="160" height="340" rx="36" fill="#fff" stroke="#ddd" strokeWidth="8" />
            <rect x="30" y="60" width="120" height="220" rx="20" fill="#f3f4f6" />
            <rect x="70" y="300" width="40" height="10" rx="5" fill="#eee" />
          </svg>
        </div>
      </div>
      {/* Right: Steps */}
      <div className="flex-1 flex flex-col items-start max-w-xl px-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-gray-900">
          3 Simple Steps to Enjoy <span className="text-green-600">Cave.</span>
        </h2>
        <ol className="space-y-6 mb-8">
          <li className="flex items-start gap-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-green-400 text-green-600 font-bold text-lg">1</span>
            <div>
              <span className="font-bold text-lg text-gray-900">Download and Install the App</span>
              <p className="text-gray-700">Visit your app store, search for "Cave" and download and install the app on your mobile device.</p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-green-400 text-green-600 font-bold text-lg">2</span>
            <div>
              <span className="font-bold text-lg text-gray-900">Sign Up on Cave for Free</span>
              <p className="text-gray-700">Open the app and follow the quick and easy sign-up process. All you need is your basic personal information.</p>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-green-400 text-green-600 font-bold text-lg">3</span>
            <div>
              <span className="font-bold text-lg text-gray-900">Add Funds and Pay Bills</span>
              <p className="text-gray-700">Once you're signed in, you can add funds to your account and start paying your bills. It's that simple!</p>
            </div>
          </li>
        </ol>
        <a href="#download" className="px-8 py-3 rounded-full border-2 border-green-500 text-white font-semibold text-lg bg-green-600 hover:bg-green-700 transition-all flex items-center gap-2">
          Get the app <span aria-hidden>→</span>
        </a>
      </div>
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
      <section className="relative z-10 w-full flex flex-col items-center mt-20 mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 drop-shadow-md text-center">
          Over <span className="text-green-600 font-extrabold text-3xl">20+</span> Ghanaian Service Providers Connected to Cave
        </h2>
        <p className="text-gray-600 mb-8 text-center">Making life easier for users across Ghana</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full max-w-6xl px-2">
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
              className={`flex flex-col items-center bg-white rounded-2xl p-4 shadow-lg border border-gray-200 transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up relative`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`w-full h-2 rounded-t-2xl mb-3 bg-${company.color}-500`} />
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
      <section className="relative z-10 mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl w-full">
        {features.map((feature, idx) => (
          <div
            key={feature.title}
            className={
              `flex flex-col items-center rounded-2xl p-7 shadow-xl border border-gray-100 transition-all duration-200 hover:scale-105 group ` +
              `bg-gradient-to-br ` +
              (idx === 0
                ? 'from-blue-50 to-blue-100/80'
                : idx === 1
                ? 'from-orange-50 to-yellow-100/80'
                : 'from-green-50 to-green-100/80')
            }
            style={{ boxShadow: idx === 0
              ? '0 8px 32px 0 rgba(59,130,246,0.10)'
              : idx === 1
              ? '0 8px 32px 0 rgba(251,191,36,0.10)'
              : '0 8px 32px 0 rgba(34,197,94,0.10)'}}
          >
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full shadow-lg"
              style={{
                background: idx === 0
                  ? 'linear-gradient(135deg, #3B82F6 60%, #60A5FA 100%)'
                  : idx === 1
                  ? 'linear-gradient(135deg, #F59E42 60%, #FBBF24 100%)'
                  : 'linear-gradient(135deg, #22C55E 60%, #4ADE80 100%)',
              }}
            >
              {feature.icon}
            </div>
            <h3 className="text-xl font-extrabold mb-2 text-center drop-shadow-md"
              style={{ color: idx === 0 ? '#2563eb' : idx === 1 ? '#f59e42' : '#22c55e' }}
            >
              {feature.title}
            </h3>
            <p className="text-gray-700 text-center text-base font-medium">
              {feature.description}
            </p>
          </div>
        ))}
      </section>
      {/* Trust Badges Row */}
      <section className="relative z-10 mt-10 flex flex-wrap justify-center gap-6 items-center">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow border border-gray-100">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#3B82F6" /><text x="12" y="16" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">PCI</text></svg>
          <span className="text-gray-900 font-semibold">PCI DSS Compliant</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow border border-gray-100">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="8" fill="#22C55E" /><path d="M8 12l2.5 2.5L16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="text-green-700 font-semibold">Secured</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow border border-gray-100">
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
              <p className="relative z-10 text-gray-700 text-lg mb-2 italic">“{testimonials[idx].text}”</p>
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
              <p className="relative z-10 text-gray-700 text-lg mb-2 italic">“{testimonials[idx].text}”</p>
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

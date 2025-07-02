import React from "react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-extrabold text-green-700 mb-4 drop-shadow">About Cave</h1>
      <p className="text-lg text-gray-700 mb-8">Empowering Ghanaians to pay for life&apos;s essentials—quickly, securely, and all in one place.</p>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-green-600 mb-2">Our Story</h2>
        <p className="text-gray-700 mb-2">
          Cave was founded with a simple goal: to make payments in Ghana effortless and accessible for everyone. We saw how time-consuming and stressful it could be to pay for electricity, water, internet, and other services. So, we built a platform that brings all your payments together—securely, instantly, and with a beautiful user experience.
        </p>
        <p className="text-gray-700">
          Today, thousands of Ghanaians trust Cave to handle their bills, airtime, data, school fees, insurance, and more. We&apos;re proud to be a Ghanaian company, built for Ghanaians, and always listening to our users.
        </p>
      </section>
      <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-2xl p-6 shadow flex flex-col items-center">
          <h3 className="text-xl font-bold text-green-700 mb-2">Our Mission</h3>
          <p className="text-gray-700 text-center">To simplify payments for every Ghanaian, making daily life easier and more connected.</p>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-6 shadow flex flex-col items-center">
          <h3 className="text-xl font-bold text-yellow-700 mb-2">Our Vision</h3>
          <p className="text-gray-700 text-center">A future where everyone in Ghana can pay for any service, anytime, anywhere—with just a tap.</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-6 shadow flex flex-col items-center">
          <h3 className="text-xl font-bold text-blue-700 mb-2">Our Values</h3>
          <ul className="list-disc ml-4 text-gray-700 text-left">
            <li>Trust & Security</li>
            <li>Innovation</li>
            <li>User-Centricity</li>
            <li>Community</li>
            <li>Transparency</li>
          </ul>
        </div>
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-green-600 mb-2">Why Choose Cave?</h2>
        <ul className="list-disc ml-6 text-gray-700 space-y-1">
          <li>Pay for electricity, water, internet, TV, airtime, data, school fees, insurance, and more—all in one app.</li>
          <li>Fast, secure, and easy-to-use platform designed for Ghanaians.</li>
          <li>24/7 support and instant notifications for every transaction.</li>
          <li>Trusted by thousands across Ghana.</li>
        </ul>
      </section>
      <section className="mb-12">
        <h2 className="text-3xl font-extrabold text-green-700 mb-6 text-center drop-shadow">Start Using Cave in 3 Easy Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <span className="text-4xl mb-3">📱</span>
            <h3 className="text-lg font-bold text-green-700 mb-2">Download Cave</h3>
            <p className="text-gray-600 text-center">Find “Cave” in your app store and install it on your phone.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <span className="text-4xl mb-3">📝</span>
            <h3 className="text-lg font-bold text-green-700 mb-2">Create Your Free Account</h3>
            <p className="text-gray-600 text-center">Open the app and sign up in seconds. All you need is your basic info!</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <span className="text-4xl mb-3">💸</span>
            <h3 className="text-lg font-bold text-green-700 mb-2">Add Money & Pay Bills</h3>
            <p className="text-gray-600 text-center">Top up your account and pay your bills—fast, easy, and secure.</p>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <a href="#download" className="px-10 py-4 rounded-full bg-green-600 text-white font-bold text-xl shadow-lg hover:bg-green-700 transition-all flex items-center gap-2">
            Download Cave Now <span aria-hidden>→</span>
          </a>
        </div>
      </section>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-green-600 mb-6">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Michael Tintant Chialin */}
          <div className="flex flex-col items-center bg-white rounded-2xl shadow p-6 border border-green-100">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-green-200 flex items-center justify-center mb-4 border-4 border-green-300 shadow-lg">
              <Image src="/michael.jpg" alt="Michael Tintant Chialin" width={96} height={96} className="object-cover w-24 h-24 rounded-full" />
            </div>
            <div className="text-xl font-bold text-green-800 mb-1">Michael Tintant Chialin</div>
            <div className="text-green-600 font-semibold mb-2">Founder & CEO</div>
            <p className="text-gray-600 text-center">Passionate about building seamless payment experiences for Ghanaians and leading the Cave vision.</p>
          </div>
          {/* Elizabeth Arthur */}
          <div className="flex flex-col items-center bg-white rounded-2xl shadow p-6 border border-green-100">
            <div className="w-24 h-24 rounded-full bg-yellow-200 flex items-center justify-center mb-4 text-4xl font-bold text-yellow-700">
              EA
            </div>
            <div className="text-xl font-bold text-yellow-800 mb-1">Elizabeth Arthur</div>
            <div className="text-yellow-600 font-semibold mb-2">Customer Service Manager</div>
            <p className="text-gray-600 text-center">Dedicated to helping users and ensuring every Cave customer has a smooth, friendly experience.</p>
          </div>
        </div>
      </section>
      <div className="mt-12 flex flex-col items-center">
        <h2 className="text-xl font-bold text-green-700 mb-2">Join the Cave Community</h2>
        <p className="text-gray-700 mb-4 text-center">Ready to experience stress-free payments? Download the Cave app today and take control of your bills and services.</p>
        <a href="#download" className="px-8 py-3 rounded-full border-2 border-green-500 text-green-700 font-semibold text-lg bg-white hover:bg-green-50 transition-all flex items-center gap-2">
          Download App <span aria-hidden>→</span>
        </a>
      </div>
    </main>
  );
} 
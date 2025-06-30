import React, { useState } from "react";
import Link from "next/link";

const articles = [
  {
    id: "budgeting-basics",
    title: "Budgeting Basics: How to Take Control of Your Money",
    summary: "Learn the fundamentals of budgeting and how to create a plan that works for you.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "saving-tips",
    title: "10 Simple Tips to Save More Every Month",
    summary: "Practical advice to help you build your savings and reach your goals.",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "understanding-credit",
    title: "Understanding Credit: What You Need to Know",
    summary: "A beginner's guide to credit, credit scores, and how to use credit wisely.",
    image: "https://images.unsplash.com/photo-1515168833906-d2a3b82b3029?auto=format&fit=crop&w=400&q=80",
  },
];

const courses = [
  {
    id: "financial-foundations",
    title: "Financial Foundations",
    description: "A step-by-step course covering budgeting, saving, and the basics of investing.",
    progress: 0.6,
    lessons: 8,
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "smart-borrowing",
    title: "Smart Borrowing & Debt Management",
    description: "Learn how to borrow responsibly, manage debt, and improve your credit health.",
    progress: 0.2,
    lessons: 5,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
];

export default function LearnPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  return (
    <main className="max-w-5xl mx-auto py-12 px-4">
      {/* Hero Section */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-green-700 mb-2 drop-shadow">Financial Literacy & Learning</h1>
        <p className="text-lg text-gray-700 mb-4 max-w-2xl mx-auto">
          Empower yourself with knowledge! Explore articles and courses to master your money, build wealth, and achieve your goals.
        </p>
      </section>

      {/* Articles */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {articles.map(article => (
            <div key={article.id} className="bg-white rounded-2xl shadow p-4 flex flex-col border-t-4 border-green-400 hover:scale-105 transition-transform">
              <img src={article.image} alt={article.title} className="rounded-xl mb-3 w-full h-32 object-cover" />
              <div className="text-lg font-bold text-green-700 mb-1">{article.title}</div>
              <p className="text-gray-700 text-sm mb-2">{article.summary}</p>
              <Link href={`#`} className="text-green-600 font-semibold hover:underline text-sm mt-auto">Read More</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Financial Education Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-2xl shadow p-6 flex flex-col border-t-4 border-blue-400 hover:scale-105 transition-transform">
              <img src={course.image} alt={course.title} className="rounded-xl mb-3 w-full h-32 object-cover" />
              <div className="text-lg font-bold text-blue-700 mb-1">{course.title}</div>
              <p className="text-gray-700 text-sm mb-2">{course.description}</p>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${course.progress * 100}%` }}></div>
                </div>
                <span className="text-xs text-gray-500">{Math.round(course.progress * 100)}%</span>
              </div>
              <div className="text-xs text-gray-500 mb-2">{course.lessons} lessons</div>
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all mt-auto"
                onClick={() => setSelectedCourse(course.id)}
              >
                {course.progress > 0 ? 'Continue Course' : 'Start Course'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Course Modal (Demo) */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg relative">
            <button onClick={() => setSelectedCourse(null)} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
            <h3 className="text-xl font-bold mb-2">Course: {courses.find(c => c.id === selectedCourse)?.title}</h3>
            <p className="text-gray-700 mb-4">(Demo) Course content, lessons, quizzes, and progress tracking would appear here.</p>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all" onClick={() => setSelectedCourse(null)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
} 
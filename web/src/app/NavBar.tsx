'use client';
import React, { useState } from "react";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "#contact" },
  { name: "Terms", href: "/terms" },
];

const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
            <span className="text-xl font-extrabold text-green-600 tracking-wide">Cave</span>
          </div>
        </Link>
        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {navLinks.map(link => (
            <li key={link.name}>
              {link.href.startsWith("/") ? (
                <Link
                  href={link.href}
                  className="text-base font-medium px-2 py-1 rounded transition hover:text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 text-gray-900"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="text-base font-medium px-2 py-1 rounded transition hover:text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 text-gray-900"
                >
                  {link.name}
                </a>
              )}
            </li>
          ))}
        </ul>
        {/* Download App Button */}
        <a
          href="#download"
          className="hidden md:inline-block border-2 border-green-500 rounded-full px-6 py-2 text-base font-bold text-green-600 bg-white hover:bg-green-50 hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          Download App <span aria-hidden>→</span>
        </a>
        <a
          href="/signin"
          className="hidden md:inline-block ml-4 px-6 py-2 rounded-full bg-green-600 text-white font-bold text-base shadow hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          Login
        </a>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-green-50 transition ml-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
          ) : (
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16"/></svg>
          )}
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-white border-t border-green-100 shadow animate-slide-down z-40 transition-all duration-300">
          <ul className="flex flex-col items-center gap-4 py-6">
            {navLinks.map(link => (
              <li key={link.name} className="w-full">
                {link.href.startsWith("/") ? (
                  <Link
                    href={link.href}
                    className="block w-full text-lg font-medium px-6 py-4 rounded transition hover:text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 text-gray-900 text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="block w-full text-lg font-medium px-6 py-4 rounded transition hover:text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 text-gray-900 text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                )}
              </li>
            ))}
            <li className="w-full">
              <a
                href="#download"
                className="block w-full border-2 border-green-500 rounded-full px-6 py-4 text-base font-bold text-green-600 bg-white hover:bg-green-50 hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 mt-2 text-center"
                onClick={() => setMenuOpen(false)}
              >
                Download App <span aria-hidden>→</span>
              </a>
            </li>
            <li className="w-full">
              <a
                href="/signin"
                className="block w-full rounded-full px-6 py-4 text-base font-bold text-white bg-green-600 hover:bg-green-700 shadow transition focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 mt-2 text-center"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar; 
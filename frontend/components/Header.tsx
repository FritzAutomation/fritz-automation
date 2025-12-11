'use client';

import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
  siteTitle: string;
}

export default function Header({ siteTitle }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                FA
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                {siteTitle}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-1">
              <li>
                <Link
                  href="/services"
                  className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors font-medium"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="#skills"
                  className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors font-medium"
                >
                  Expertise
                </Link>
              </li>
              <li>
                <Link
                  href="#industries"
                  className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors font-medium"
                >
                  Industries
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors font-medium"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/portal/login"
                  className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors font-medium"
                >
                  Client Portal
                </Link>
              </li>
              <li className="ml-2">
                <Link
                  href="/contact"
                  className="px-6 py-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all font-medium"
                >
                  Get a Quote
                </Link>
              </li>
            </ul>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
              >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Slide-out */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-80 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundColor: '#0f172a',
          zIndex: 9999
        }}
      >
        {/* Background gradient layer */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)',
            zIndex: 1
          }}
        />

        {/* Decorative gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
          <div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl"
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
          ></div>
          <div
            className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl"
            style={{ backgroundColor: 'rgba(34, 211, 238, 0.3)' }}
          ></div>
        </div>

        <div className="relative h-full flex flex-col p-6" style={{ zIndex: 100 }}>
          {/* Close button */}
          <button
            onClick={closeMobileMenu}
            className="absolute top-6 right-6 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Logo and Brand */}
          <div className="mt-4 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                FA
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">{siteTitle}</h2>
                <p className="text-gray-400 text-sm">Automation Solutions</p>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              <li style={{ animation: mobileMenuOpen ? 'slideIn 0.3s ease-out 0.1s both' : 'none' }}>
                <Link
                  href="/services"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all font-medium group"
                >
                  <svg className="w-5 h-5 text-primary-light group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Services
                </Link>
              </li>
              <li style={{ animation: mobileMenuOpen ? 'slideIn 0.3s ease-out 0.2s both' : 'none' }}>
                <Link
                  href="#skills"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all font-medium group"
                >
                  <svg className="w-5 h-5 text-primary-light group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Expertise
                </Link>
              </li>
              <li style={{ animation: mobileMenuOpen ? 'slideIn 0.3s ease-out 0.3s both' : 'none' }}>
                <Link
                  href="#industries"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all font-medium group"
                >
                  <svg className="w-5 h-5 text-primary-light group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Industries
                </Link>
              </li>
              <li style={{ animation: mobileMenuOpen ? 'slideIn 0.3s ease-out 0.35s both' : 'none' }}>
                <Link
                  href="/about"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all font-medium group"
                >
                  <svg className="w-5 h-5 text-primary-light group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About
                </Link>
              </li>
              <li style={{ animation: mobileMenuOpen ? 'slideIn 0.3s ease-out 0.4s both' : 'none' }}>
                <Link
                  href="/portal/login"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 transition-all font-medium group"
                >
                  <svg className="w-5 h-5 text-primary-light group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Client Portal
                </Link>
              </li>

              <li className="pt-6" style={{ animation: mobileMenuOpen ? 'slideIn 0.3s ease-out 0.45s both' : 'none' }}>
                <Link
                  href="/contact"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Get a Quote
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social Links */}
          <div className="border-t border-white/10 pt-6" style={{ animation: mobileMenuOpen ? 'slideIn 0.3s ease-out 0.55s both' : 'none' }}>
            <p className="text-gray-400 text-sm mb-4">Connect with us</p>
            <div className="flex gap-3">
              <a
                href="https://github.com/FritzAutomation"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all hover:scale-110"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/joshua-fritzjunker-53383590/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="mailto:forward@fritzautomation.dev"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all hover:scale-110"
                aria-label="Email"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Add keyframe animation */}
        <style jsx>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </>
  );
}

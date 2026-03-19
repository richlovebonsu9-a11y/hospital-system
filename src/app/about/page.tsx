"use client";

import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 z-10 relative">
          <Link href="/" className="text-red-500 font-bold mb-8 block hover:underline">← BACK TO HOME</Link>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Our Mission: <br />
            <span className="text-red-600 italic">Life First.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            HERWA was founded in 2026 with a single, radical vision: medical care should be as fast as a heartbeat.
            We use real-time GPS tracking and AI-powered triage to bridge the gap between emergency and hospital.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/10 skew-x-12 transform translate-x-20"></div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="p-10 border-l-4 border-red-600 bg-gray-50 rounded-xl">
            <h3 className="text-2xl font-black mb-4 uppercase italic">Sub-Second Response</h3>
            <p className="text-gray-600 leading-relaxed">
              Our dispatch system is tuned for the highest possible speed. We don't wait for paperwork; we move as soon as the SOS is pushed.
            </p>
          </div>
          <div className="p-10 border-l-4 border-slate-900 bg-gray-50 rounded-xl">
            <h3 className="text-2xl font-black mb-4 uppercase italic">AI Triage</h3>
            <p className="text-gray-600 leading-relaxed">
              Every emergency report is instantly analyzed by our medical AI to ensure critical cases get priority dispatch and bed reservation.
            </p>
          </div>
          <div className="p-10 border-l-4 border-red-600 bg-gray-50 rounded-xl">
            <h3 className="text-2xl font-black mb-4 uppercase italic">Total Transparency</h3>
            <p className="text-gray-600 leading-relaxed">
              Real-time bed tracking and live ambulance maps mean patients and families never have to wonder where their care is.
            </p>
          </div>
        </div>
      </section>

      {/* Team Info */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center mb-16">
            <h2 className="text-4xl font-black">Our Specialized Network</h2>
            <p className="text-gray-500 mt-4">Connected by technology, driven by compassion.</p>
        </div>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border-b-8 border-red-600">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">👩‍⚕️</div>
                    <h4 className="font-bold text-xl mb-1">Dr. Michael Chen</h4>
                    <span className="text-red-500 font-bold text-xs uppercase tracking-tighter">Chief of Cardiology</span>
                </div>
            ))}
        </div>
      </section>

      <footer className="py-10 text-center text-gray-400 text-xs border-t">
        © 2026 HERWA Medical Network. All rights reserved.
      </footer>
    </div>
  );
}

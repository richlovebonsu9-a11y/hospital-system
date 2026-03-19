"use client";

import React from "react";
import Link from "next/link";

export default function ServicesPage() {
  const services = [
    { title: "24/7 Emergency Care", icon: "🚨", desc: "Sub-second response times for critical heart and trauma incidents. Our GPS-linked dispatch system ensures help reaches you instantly.", detail: "Triage → Dispatch → Bed Reservation" },
    { title: "Specialized Cardiology", icon: "❤️", desc: "State-of-the-art heart monitoring and emergency cardiac intervention led by world-class specialists.", detail: "Live EKG Tracking & Remote Consults" },
    { title: "Neuro-Emergency", icon: "🧠", desc: "Rapid response protocols for stroke and neurological crises using AI-driven pre-triage models.", detail: "Advanced Neuro-imaging & Swift Intervention" },
    { title: "Advanced Diagnostics", icon: "🔬", desc: "Instant lab results and mobile diagnostic units that bring the hospital's capabilities to your doorstep.", detail: "Automated Reporting & AI Analysis" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <section className="bg-red-600 py-16 text-white text-center">
        <div className="container mx-auto px-4">
            <a href="/" className="text-red-100 font-bold mb-4 block hover:underline text-sm uppercase tracking-widest cursor-pointer">← BACK TO HUB</a>
            <h1 className="text-5xl md:text-7xl font-black italic">OUR SERVICES</h1>
            <p className="mt-4 text-red-100 max-w-xl mx-auto font-bold uppercase tracking-tighter">Comprehensive emergency medicine for the digital age.</p>
        </div>
      </section>

      {/* Services Breakdown */}
      <section className="py-20">
        <div className="container mx-auto px-4 space-y-20">
            {services.map((s, i) => (
                <div key={i} className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="md:w-1/2">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-md border-b-4 border-red-600 italic">
                            {s.icon}
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight italic">{s.title}</h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            {s.desc}
                        </p>
                        <div className="bg-slate-900 text-white p-4 rounded-lg inline-block text-xs font-black tracking-widest uppercase italic">
                           Process: {s.detail}
                        </div>
                    </div>
                    <div className="md:w-1/2 w-full aspect-video bg-gray-100 rounded-3xl shadow-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden transform hover:scale-[1.02] transition-all">
                        <span className="text-gray-300 font-black text-6xl italic">PREMIUM IMAGE</span>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-slate-50 py-20 border-t border-b">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-black mb-8 italic">Need Specialized Assistance?</h2>
            <div className="flex flex-wrap justify-center gap-8">
                <Link href="/sos" className="bg-red-600 text-white px-8 py-4 rounded-xl font-black text-xl hover:bg-red-700 shadow-xl transition-all">PUSH SOS NOW</Link>
                <Link href="/dashboard/appointments" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xl hover:bg-slate-800 shadow-xl transition-all">BOOK CONSULTATION</Link>
            </div>
        </div>
      </section>

      <footer className="py-10 text-center text-gray-400 text-xs">
        HERWA Health Network | Technology-Integrated Healthcare
      </footer>
    </div>
  );
}

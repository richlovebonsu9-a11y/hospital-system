"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar - Hidden on Mobile */}
      <div className="hidden md:block bg-gray-100 py-2 border-b text-xs text-gray-600">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>Your Health is Our Priority</div>
          <div className="flex gap-4 font-bold">
            <span>📞 +1 800 123 456</span>
            <span>📍 123 Medical Dr, NY</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center text-white font-bold text-xl">+</div>
            <span className="text-xl md:text-2xl font-bold text-slate-800">HERWA</span>
          </Link>
          <nav className="hidden md:flex gap-8 font-medium text-slate-600">
            <Link href="/" className="text-red-600">Home</Link>
            <Link href="#" className="hover:text-red-500">About</Link>
            <Link href="#" className="hover:text-red-500">Services</Link>
            {user ? (
              <button onClick={handleSignOut} className="hover:text-red-500">Sign Out</button>
            ) : (
              <Link href="/auth/login" className="hover:text-red-500">Sign In</Link>
            )}
          </nav>
          <Link href="/sos" className="bg-red-600 text-white px-4 md:px-6 py-2 rounded-md font-bold hover:bg-red-700 transition-colors text-xs md:text-base">
            SOS EMERGENCY
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-red-50 py-12 md:py-20 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 z-10 text-center md:text-left">
            <span className="text-red-600 font-bold uppercase tracking-widest text-[10px] md:text-sm">24/7 Heart & Emergency Care</span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mt-4 leading-tight">
              Get <span className="text-red-600 italic">pumped up</span> <br /> about Health
            </h1>
            <p className="text-gray-600 mt-6 text-base md:text-lg max-w-md mx-auto md:mx-0">
              Instant medical response at your doorstep. From sub-second emergency dispatch to specialized cardiology care.
            </p>
            <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              <button className="btn-primary w-full md:w-auto py-4 px-8">LEARN MORE</button>
              <button className="flex items-center justify-center gap-2 text-slate-900 font-bold hover:text-red-600 group">
                <div className="w-10 h-10 border-2 border-red-600 rounded-full flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">▶</div>
                VIEW SERVICES
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
            {/* Image Placeholder - A smiling doctor */}
            <div className="w-full aspect-square bg-white rounded-full border-[15px] border-white shadow-2xl flex items-center justify-center overflow-hidden">
               <div className="text-gray-300 transform scale-[4]">👨‍⚕️</div>
            </div>
            <div className="absolute top-10 right-0 bg-white p-6 rounded-lg shadow-xl border-l-4 border-red-600 animate-bounce">
              <span className="text-3xl block">❤️</span>
              <span className="font-bold text-slate-800 italic uppercase">Your Heart Matters</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Appointment Form */}
      <section className="bg-red-600 py-10">
        <div className="container mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl flex flex-col md:flex-row gap-6 items-center">
            <div className="text-white md:w-1/4">
              <span className="text-red-100 font-bold uppercase text-xs">Fast Access</span>
              <h2 className="text-2xl font-bold">Book Your Appointment Today!</h2>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              <input type="text" placeholder="Full Name" className="p-3 rounded bg-white text-gray-800" />
              <input type="email" placeholder="Email Address" className="p-3 rounded bg-white text-gray-800" />
              <select className="p-3 rounded bg-white text-gray-600">
                <option>Select Service</option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Emergency</option>
              </select>
            </div>
            <button className="bg-slate-900 text-white px-8 py-3 rounded font-bold hover:bg-slate-800 transition-all">
              BOOK NOW
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid & Resource Navigation */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <span className="text-red-600 font-bold uppercase tracking-widest text-xs">Command & Control</span>
          <h2 className="section-title mt-2">Hospital Resource Center</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {[ 
              { title: "Bed Monitor", icon: "🛏️", link: "/dashboard/beds", desc: "Live availability status across all ICU and Emergency wards." },
              { title: "Appointments", icon: "📅", link: "/dashboard/appointments", desc: "Book specialist consultations and view doctor schedules." },
              { title: "Live Command", icon: "📡", link: "/admin/dashboard", desc: "Admin only: Real-time emergency queue and GPS tracking." },
              { title: "Emergency SOS", icon: "🚀", link: "/sos", desc: "Instant patient intake and live symptom reporting." } 
            ].map((service, i) => (
              <Link key={i} href={service.link} className="p-8 border rounded-xl hover:border-red-600 group transition-all cursor-pointer block">
                <div className="w-16 h-16 bg-red-50 text-3xl flex items-center justify-center rounded-full mx-auto group-hover:bg-red-600 group-hover:text-white transition-all">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mt-6 text-slate-800">{service.title}</h3>
                <p className="text-gray-500 mt-4 text-xs leading-relaxed">{service.desc}</p>
                <div className="mt-4 text-red-600 font-bold text-xs uppercase italic tracking-widest">Access Module →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-300 py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold">+</div>
                <span className="text-2xl font-bold text-white">HERWA</span>
              </div>
              <p className="text-sm leading-relaxed">
                Empowering patients with sub-second emergency response and specialized medical care.
              </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-red-500">About Us</a></li>
              <li><a href="#" className="hover:text-red-500">Doctors</a></li>
              <li><a href="#" className="hover:text-red-500">Services</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>📍 123 Medical Dr, NY</li>
              <li>📞 +1 800 123 456</li>
              <li>✉️ emergency@herwa.com</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <div className="flex bg-white/10 rounded overflow-hidden">
              <input type="email" placeholder="Email" className="bg-transparent p-2 flex-1 text-sm outline-none" />
              <button className="bg-red-600 p-2">📩</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

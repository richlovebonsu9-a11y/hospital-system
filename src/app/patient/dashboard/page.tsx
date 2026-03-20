"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      }

      const { data: profile } = await supabase
        .from('patient_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      const userRole = profile?.role || session.user.user_metadata?.role || 'patient';
      
      if (userRole !== 'patient') {
        // ... handled by login/signup redirection
      }

      setUser({ ...session.user, ...profile, role: userRole });
      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold text-lg">+</div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">HERWA</span>
          </Link>
          <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-slate-600 hidden md:block">Welcome, {user?.full_name || 'Patient'}</span>
             <button 
               onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
               className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
             >
               Sign Out
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Patient Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your health and appointments seamlessly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl text-xl mb-4">📅</div>
              <h3 className="text-lg font-bold text-slate-800">Next Appointment</h3>
              <p className="text-slate-500 text-sm mt-1">Dr. Sarah Jenkins - Cardiology</p>
            </div>
            <div className="mt-4 pt-4 border-t">
               <span className="text-xs font-black text-blue-600 uppercase tracking-wider">Tomorrow, 10:30 AM</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-green-50 text-green-600 flex items-center justify-center rounded-xl text-xl mb-4">🩺</div>
              <h3 className="text-lg font-bold text-slate-800">Active Prescriptions</h3>
              <p className="text-slate-500 text-sm mt-1">Lisinopril 10mg - Once daily</p>
            </div>
            <div className="mt-4 pt-4 border-t">
               <span className="text-xs font-black text-green-600 uppercase tracking-wider">3 DAYS REMAINING</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-purple-50 text-purple-600 flex items-center justify-center rounded-xl text-xl mb-4">📄</div>
              <h3 className="text-lg font-bold text-slate-800">Recent Reports</h3>
              <p className="text-slate-500 text-sm mt-1">Blood Test Results - Normal</p>
            </div>
            <div className="mt-4 pt-4 border-t">
               <span className="text-xs font-black text-purple-600 uppercase tracking-wider">MARCH 15, 2026</span>
            </div>
          </div>

          {/* Action Cards */}
          <Link href="/dashboard/appointments" className="group bg-red-600 p-8 rounded-3xl shadow-xl hover:bg-red-700 transition-all transform hover:-translate-y-1">
             <div className="text-4xl mb-6">🗓️</div>
             <h3 className="text-2xl font-black text-white italic">Book Appointment</h3>
             <p className="text-red-100 text-sm mt-2 font-medium">Schedule a visit with our specialists in seconds.</p>
             <div className="mt-6 flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest">
                Start Booking <span className="group-hover:translate-x-1 transition-transform">→</span>
             </div>
          </Link>

          <Link href="/dashboard/beds" className="group bg-slate-900 p-8 rounded-3xl shadow-xl hover:bg-slate-800 transition-all transform hover:-translate-y-1">
             <div className="text-4xl mb-6">🛏️</div>
             <h3 className="text-2xl font-black text-white italic">Bed Availability</h3>
             <p className="text-slate-300 text-sm mt-2 font-medium">Check real-time bed status in Emergency and ICU.</p>
             <div className="mt-6 flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest">
                View Status <span className="group-hover:translate-x-1 transition-transform">→</span>
             </div>
          </Link>

          <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
             <div className="text-3xl mb-4 grayscale">🏥</div>
             <p className="text-slate-400 font-bold text-sm">More modules coming soon...</p>
          </div>
        </div>

        {/* Health Tips Section */}
        <section className="mt-12">
           <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
             <span className="w-2 h-8 bg-red-600 rounded-full"></span>
             Health Tips for You
           </h2>
           <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
             <div className="flex gap-4">
                <div className="text-3xl">💡</div>
                <div>
                   <h4 className="font-bold text-red-900">Stay Hydrated!</h4>
                   <p className="text-red-700 text-sm mt-1 leading-relaxed">Drinking enough water is essential for maintaining your energy levels and supporting heart health. Aim for 8 glasses a day.</p>
                </div>
             </div>
           </div>
        </section>
      </main>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StaffDashboard() {
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

      if (profile?.role !== 'staff' && profile?.role !== 'admin') {
         // If patient tries to access staff dashboard
         // We'll handle this more strictly later
      }

      setUser({ ...session.user, ...profile });
      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Sidebar/Navigation Mockup (Top Bar for now) */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-600/20">H</div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none uppercase italic">Herwa Staff</h1>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-none">Clinical Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 h-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">System Online</span>
           </div>
           <button 
             onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
             className="text-xs font-black text-slate-400 hover:text-white transition-colors uppercase border border-slate-800 px-4 py-2 rounded-lg"
           >
             Terminal Exit (Logout)
           </button>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        {/* Welcome Area */}
        <div className="flex justify-between items-end mb-12">
          <div>
             <h2 className="text-4xl font-black italic tracking-tighter">GOOD MORNING,</h2>
             <span className="text-5xl font-black text-red-600 tracking-tighter uppercase">{user?.full_name?.split(' ')[0] || 'OFFICER'}</span>
          </div>
          <div className="text-right">
             <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Current Station</p>
             <p className="text-xl font-black italic">General Ward Alpha</p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           {/* Primary Stats */}
           <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Total Patients", value: "42", trend: "+3 from last shift", icon: "👥", color: "blue" },
                { label: "Critical Cases", value: "08", trend: "Stability: 85%", icon: "🚨", color: "red" },
                { label: "Bed Capacity", value: "92%", trend: "4 Beds available", icon: "🛏️", color: "green" }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-800 hover:border-red-600/50 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                      <span className="text-3xl">{stat.icon}</span>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                   </div>
                   <div className="text-4xl font-black italic group-hover:text-red-500 transition-colors">{stat.value}</div>
                   <div className="mt-2 text-[10px] font-bold text-slate-500 uppercase">{stat.trend}</div>
                </div>
              ))}

              {/* Patient Queue Table Mockup */}
              <div className="md:col-span-3 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800 overflow-hidden">
                 <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="font-black italic uppercase tracking-widest text-sm">Active Patient Monitoring</h3>
                    <button className="text-[10px] font-black underline uppercase text-red-500">View All Records</button>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-800">
                             <th className="px-6 py-4">Patient UID</th>
                             <th className="px-6 py-4">Arrival</th>
                             <th className="px-6 py-4">Status</th>
                             <th className="px-6 py-4">Priority</th>
                             <th className="px-6 py-4 text-right">Action</th>
                          </tr>
                       </thead>
                       <tbody className="text-sm">
                          {[
                            { id: "PX-8821", time: "08:15 AM", status: "Triage", priority: "High", color: "red" },
                            { id: "PX-9012", time: "08:42 AM", status: "Stable", priority: "Low", color: "blue" },
                            { id: "PX-7743", time: "09:05 AM", status: "In-Surgery", priority: "Critical", color: "red" },
                            { id: "PX-1102", time: "09:30 AM", status: "Discharge", priority: "Low", color: "green" },
                          ].map((p, i) => (
                            <tr key={i} className="border-b border-slate-800 pb-2 hover:bg-white/5 transition-colors">
                               <td className="px-6 py-4 font-black">{p.id}</td>
                               <td className="px-6 py-4 text-slate-400 font-bold">{p.time}</td>
                               <td className="px-6 py-4">
                                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                    p.color === 'red' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                    p.color === 'blue' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                                    'bg-green-500/10 text-green-500 border-green-500/20'
                                  }`}>
                                    {p.status}
                                  </span>
                               </td>
                               <td className="px-6 py-4 font-bold italic">{p.priority}</td>
                               <td className="px-6 py-4 text-right">
                                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-[10px] font-black transition-all">MANAGE</button>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>

           {/* Sidebar Alerts/Tools */}
           <div className="space-y-6">
              <div className="bg-red-600 p-6 rounded-3xl shadow-xl shadow-red-600/10 relative overflow-hidden group">
                 <div className="absolute -right-4 -top-4 text-6xl opacity-20 group-hover:scale-125 transition-transform">⚡</div>
                 <h3 className="font-black italic uppercase text-lg leading-tight">Emergency <br/> Override</h3>
                 <p className="text-red-100 text-[10px] font-bold mt-2 uppercase">Initiate sub-second response</p>
                 <button className="mt-4 w-full bg-white text-red-600 font-black py-2 rounded-xl text-xs hover:bg-slate-100 transition-all">ACTIVATE NOW</button>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                 <h3 className="text-xs font-black uppercase tracking-widest mb-6 text-slate-500">Duty Schedule</h3>
                 <div className="space-y-4">
                    <div className="flex gap-3 items-start border-l-2 border-red-600 pl-4 py-1">
                       <div>
                          <p className="text-xs font-black uppercase">Morning Round</p>
                          <p className="text-[10px] text-slate-500 font-bold">WARD ALPHA • 10:00 AM</p>
                       </div>
                    </div>
                    <div className="flex gap-3 items-start border-l-2 border-slate-700 pl-4 py-1">
                       <div>
                          <p className="text-xs font-black uppercase text-slate-500">Staff Meeting</p>
                          <p className="text-[10px] text-slate-600 font-bold">BRIEFING ROOM • 12:30 PM</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-slate-800">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Internal Comms</span>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed italic">"Please ensure all patient vitals are updated before shift handover at 14:00."</p>
                 <div className="flex items-center gap-2 mt-4">
                    <div className="w-6 h-6 bg-slate-800 rounded-full"></div>
                    <span className="text-[10px] font-bold text-slate-500">Administrator</span>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Bed {
  id: string;
  ward_id: string;
  bed_number: string;
  status: string;
}

export default function BedAvailability() {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBeds();

    // Realtime listener for Bed status changes
    const subscription = supabase
      .channel('beds_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'beds' }, (payload) => {
        fetchBeds(); // Refresh list on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchBeds = async () => {
    const { data, error } = await supabase
      .from("beds")
      .select("*")
      .order("ward_id", { ascending: true })
      .order("bed_number", { ascending: true });

    if (!error) setBeds(data);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-700 border-green-200";
      case "occupied": return "bg-red-100 text-red-700 border-red-200";
      case "reserved": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const wards = Array.from(new Set(beds.map(b => b.ward_id)));

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-red-600 font-bold uppercase tracking-widest text-xs">Resource Monitor</span>
          <h1 className="text-5xl font-black text-slate-900 mt-2">Bed Availability Dashboard</h1>
          <p className="text-gray-500 mt-4">Real-time ward status and emergency bed tracking.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 font-bold text-gray-400 animate-pulse">📡 Syncing with Ward Terminals...</div>
        ) : beds.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-xl text-center border-t-8 border-red-600">
             <div className="text-6xl mb-4">🏥</div>
             <h3 className="text-2xl font-bold text-slate-800">No Beds Registered</h3>
             <p className="text-gray-500 mt-2">Please add beds to the database to start monitoring.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wards.map((ward) => (
              <div key={ward} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                   <h2 className="text-xl font-bold uppercase tracking-tight">{ward}</h2>
                   <div className="bg-red-600 px-3 py-1 rounded-full text-[10px] font-black italic">LIVE</div>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  {beds.filter(b => b.ward_id === ward).map(bed => (
                    <div key={bed.id} className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${getStatusColor(bed.status)}`}>
                        <span className="text-2xl mb-1">🛏️</span>
                        <span className="text-xs font-black uppercase tracking-tighter">Bed {bed.bed_number}</span>
                        <span className="text-[10px] font-bold mt-1 uppercase">{bed.status}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-4 border-t text-center">
                    <span className="text-xs font-bold text-gray-400">
                        {beds.filter(b => b.ward_id === ward && b.status === 'available').length} / {beds.filter(b => b.ward_id === ward).length} AVAILABLE
                    </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

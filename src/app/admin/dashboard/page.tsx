"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import "leaflet/dist/leaflet.css";

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

import L from "leaflet";

// Icons will be initialized in useEffect to avoid SSR "window is not defined" errors
let redIcon: any;
let blueIcon: any;

interface Emergency {
  id: string;
  symptoms: string;
  severity_level: number;
  status: string;
  created_at: string;
  location_lat?: number;
  location_lng?: number;
}

export default function AdminDashboard() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);

  const [iconsReady, setIconsReady] = useState(false);

  useEffect(() => {
    // Initialize icons only on the client side
    if (typeof window !== "undefined") {
      const Leaflet = require("leaflet");
      redIcon = new Leaflet.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      blueIcon = new Leaflet.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      setIconsReady(true);
    }

    // 1. Initial Fetch
    fetchEmergencies();

    // 2. Realtime Subscription as per SRS
    const subscription = supabase
      .channel('emergencies_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'emergencies' }, (payload) => {
        const newEmergency = payload.new as Emergency;
        setEmergencies((prev) => [newEmergency, ...prev]);
        
        // Play alert sound if supported
        try { new Audio('/alert.mp3').play(); } catch(e) {}
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'emergencies' }, (payload) => {
          setEmergencies((prev) => 
            prev.map(item => item.id === payload.new.id ? payload.new as Emergency : item)
          );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchEmergencies = async () => {
    const { data, error } = await supabase
      .from("emergencies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching emergencies", error);
    else setEmergencies(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from("emergencies").update({ status: newStatus }).eq("id", id);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white p-4 items-center flex justify-between">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white uppercase tracking-tighter">HQ</div>
            <h1 className="text-xl font-black">HERWA COMMAND CENTER</h1>
        </div>
        <div className="flex gap-4 items-center">
            <span className="flex items-center gap-2 text-xs text-green-400 font-bold">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                SYSTEM LIVE
            </span>
            <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Queue */}
        <div className="lg:col-span-2 space-y-4">
           <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border-l-8 border-red-600">
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Active Emergency Queue</h2>
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-black">{emergencies.length} CASES</span>
           </div>

           {loading ? (
             <div className="text-center py-20 text-gray-400 font-bold">📡 Connecting to Realtime Uplink...</div>
           ) : emergencies.length === 0 ? (
             <div className="bg-white p-20 rounded-xl text-center border-2 border-dashed border-gray-200">
                <div className="text-4xl mb-4">💤</div>
                <p className="text-gray-400 font-bold">All quiet. No active emergencies reported.</p>
             </div>
           ) : (
             <div className="space-y-4">
               {emergencies.map((e) => (
                 <div key={e.id} className={`bg-white p-6 rounded-xl shadow-md border-l-4 transition-all hover:scale-[1.01] ${e.severity_level >= 4 ? "border-red-600" : "border-blue-500"}`}>
                   <div className="flex justify-between items-start">
                     <div>
                       <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${e.severity_level >= 4 ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                         Priority {e.severity_level}
                       </span>
                       <h3 className="mt-2 text-xl font-bold text-slate-900">{e.symptoms}</h3>
                       <p className="text-xs text-gray-400 mt-1 font-mono">ID: {e.id.split('-')[0]}</p>
                       <div className="mt-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                          <span className="text-[10px] font-bold text-purple-600 uppercase italic">
                            AI Suggestion: {e.severity_level >= 4 ? "IMMEDIATE DISPATCH" : "OBSERVATION RECOMMENDED"}
                          </span>
                       </div>
                     </div>
                     <div className="text-right">
                        <span className="block text-xs font-bold text-gray-500 uppercase">{new Date(e.created_at).toLocaleTimeString()}</span>
                        <div className={`mt-2 text-xs font-black uppercase px-2 py-1 rounded shadow-sm border ${e.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                           {e.status}
                        </div>
                     </div>
                   </div>
                   
                   <div className="mt-6 pt-6 border-t flex flex-wrap gap-4">
                      <button onClick={() => updateStatus(e.id, 'triaged')} className="bg-slate-800 text-white px-4 py-2 rounded text-xs font-bold hover:bg-slate-700">TRIAGE</button>
                      <button onClick={() => updateStatus(e.id, 'dispatched')} className="bg-red-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-red-700 underline">DISPATCH READY</button>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-700">VIEW ON MAP</button>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* Sidebar Triage Info */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-black text-slate-800 uppercase text-xs mb-4 tracking-wider">AI Pre-Triage Stats</h3>
              <div className="space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Avg Response Time</span>
                    <span className="font-bold">1m 24s</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Critical Load</span>
                    <span className="font-bold text-red-600">32%</span>
                 </div>
              </div>
           </div>
           
           <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-slate-900">
              <h3 className="font-black text-slate-800 uppercase text-xs mb-4 tracking-wider">Available Units</h3>
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 flex items-center justify-center rounded text-blue-600">🚑</div>
                    <div className="flex-1">
                       <span className="block text-sm font-bold">Ambulance A4</span>
                       <span className="text-[10px] text-green-500 font-bold">IDLE / READY</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 flex items-center justify-center rounded text-blue-600">🛵</div>
                    <div className="flex-1">
                       <span className="block text-sm font-bold">Home Team T2</span>
                       <span className="text-[10px] text-red-500 font-bold">ON MISSION</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Emergency Map View */}
           <div className="bg-white p-4 rounded-xl shadow-md border-t-4 border-red-600">
              <h3 className="font-black text-slate-800 uppercase text-xs mb-4 tracking-wider">Live Incident Map</h3>
               <div className="h-[300px] bg-gray-100 rounded-lg overflow-hidden relative">
                {iconsReady && (
                  <MapContainer center={[40.7128, -74.0060]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {emergencies.map((e) => e.location_lat && e.location_lng && (
                      <Marker 
                        key={e.id} 
                        position={[e.location_lat, e.location_lng]} 
                        icon={e.severity_level >= 4 ? redIcon : blueIcon}
                      >
                        <Popup>
                          <div className="text-xs">
                            <p className="font-bold">Severity: {e.severity_level}</p>
                            <p>{e.symptoms}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                )}
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}

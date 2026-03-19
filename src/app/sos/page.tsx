"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SOSPanel() {
  const [symptoms, setSymptoms] = useState("");
  const [severity, setSeverity] = useState(3);
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Auto-capture location on load as per SRS
    handleCaptureLocation();
  }, []);

  const handleCaptureLocation = () => {
    setIsCapturingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsCapturingLocation(false);
        },
        (error) => {
          console.error("Error capturing location", error);
          setIsCapturingLocation(false);
        }
      );
    }
  };

  const startVoiceInput = () => {
    // Simple Web Speech API implementation as per SRS
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptoms((prev) => prev + " " + transcript);
      };
      recognition.start();
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to report an emergency.");
      router.push("/auth/login");
      return;
    }

    const { error } = await supabase.from("emergencies").insert({
      patient_id: user.id,
      symptoms,
      severity_level: severity,
      location_lat: location?.lat,
      location_lng: location?.lng,
      status: "pending",
    });

    if (error) {
      alert("Failed to submit emergency prompt: " + error.message);
    } else {
      alert("EMERGENCY REPORTED. Help is on the way!");
      router.push("/");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border-4 border-red-600 overflow-hidden">
        <div className="bg-red-600 p-4 md:p-8 text-white text-center">
            <h1 className="text-2xl md:text-4xl font-black italic">SOS EMERGENCY</h1>
            <p className="mt-2 text-red-100 font-bold uppercase tracking-widest text-[10px] md:text-sm">Real-time Prompt to Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div>
            <label className="block text-slate-800 font-black mb-2 uppercase text-xs tracking-wider">Symptoms / Situation</label>
            <div className="relative">
              <textarea
                required
                className="w-full h-40 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-red-600 outline-none transition-all placeholder:text-gray-300"
                placeholder="Describe what is happening (e.g. Sharp chest pain, breathing difficulty...)"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
              <button
                type="button"
                onClick={startVoiceInput}
                className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all ${isRecording ? "bg-red-600 text-white animate-pulse" : "bg-white text-red-600 hover:bg-red-50"}`}
              >
                 {isRecording ? "🛑 Recording..." : "🎤 Voice Input"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-800 font-black mb-2 uppercase text-xs tracking-wider">Severity Level (1-5)</label>
            <div className="flex justify-between px-2 text-xs font-bold text-gray-500 mb-2">
                <span>LOW</span>
                <span>CRITICAL</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              value={severity}
              onChange={(e) => setSeverity(parseInt(e.target.value))}
            />
            <div className={`mt-2 text-center text-sm font-black p-2 rounded ${severity >= 4 ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
               {severity === 1 && "Routine / Minor Issue"}
               {severity === 2 && "Stable / Needs Attention"}
               {severity === 3 && "Urgent / Serious Pain"}
               {severity === 4 && "Severe / Potential Life Threat"}
               {severity === 5 && "CRITICAL / IMMEDIATE ACTION REQUIRED"}
            </div>
          </div>

          <div className="p-4 bg-gray-100 rounded-xl border-l-4 border-blue-600 flex items-center justify-between">
            <div>
              <span className="block font-bold text-slate-800 text-sm">Geolocation Precision</span>
              <span className="text-xs text-gray-500">
                {isCapturingLocation ? "🛰️ Syncing with Satellites..." : location ? `✅ Coordinate Lock: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "❌ Location Access Refused"}
              </span>
            </div>
            <button type="button" onClick={handleCaptureLocation} className="text-blue-600 font-bold text-xs underline">Recalibrate</button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 bg-red-600 text-white text-2xl font-black rounded-2xl shadow-2xl hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95 disabled:bg-gray-400"
          >
            {isSubmitting ? "TRANSMITTING..." : "🚀 SUBMIT LIVE PROMPT"}
          </button>
          
          <p className="text-center text-gray-400 text-[10px] uppercase font-bold tracking-tighter">
            * By clicking submit, you authorize immediate healthworker dispatch and GPS tracking.
          </p>
        </form>
      </div>
    </div>
  );
}

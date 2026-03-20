"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [secretCode, setSecretCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate secret codes
    let finalRole = "patient";
    if (role === "admin") {
      if (secretCode !== "HERWA2026") {
        setMessage("Invalid Admin Authorization Code.");
        setLoading(false);
        return;
      }
      finalRole = "admin";
    } else if (role === "staff") {
      if (secretCode !== "HERWA_STAFF_2026") {
        setMessage("Invalid Staff Authorization Code.");
        setLoading(false);
        return;
      }
      finalRole = "staff";
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: finalRole
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else if (data.user) {
      // Manually upsert profile to ensure role is set correctly
      // (as a fallback in case the database trigger is slow/missing)
      await supabase.from('patient_profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        role: finalRole,
      });

      setMessage("Account created! Synchronizing systems...");
      
      // Automatic Login for seamless experience
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        router.push("/auth/login");
      } else {
        // Redirect to dashboard based on role
        setTimeout(() => {
          if (finalRole === 'admin') router.push("/admin/dashboard");
          else if (finalRole === 'staff') router.push("/staff/dashboard");
          else router.push("/patient/dashboard");
        }, 1500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 selection:bg-red-500 selection:text-white">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-xl relative">
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl p-8 md:p-12 overflow-hidden">
          {/* Progress Indicator (Mockup) */}
          <div className="flex justify-center gap-2 mb-8">
             <div className="h-1.5 w-12 bg-red-600 rounded-full"></div>
             <div className="h-1.5 w-12 bg-white/10 rounded-full"></div>
             <div className="h-1.5 w-12 bg-white/10 rounded-full"></div>
          </div>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-600/20 text-white text-3xl font-black mb-6 transform hover:rotate-12 transition-transform cursor-pointer">+</div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic">RECRUITMENT PORTAL</h1>
            <p className="text-slate-400 mt-2 text-sm font-medium uppercase tracking-[0.2em]">Join the HERWA Medical Network</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative group">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all group-hover:bg-slate-800/80"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="relative group">
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all group-hover:bg-slate-800/80"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="relative group">
              <input
                type="password"
                required
                placeholder="Secure Password"
                className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all group-hover:bg-slate-800/80"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Role Selection Tabs */}
            <div className="bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 grid grid-cols-3 gap-1">
              {['patient', 'staff', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    role === r ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Conditional Secret Code Field */}
            {(role === 'admin' || role === 'staff') && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <input
                  type="text"
                  required
                  placeholder={`${role.charAt(0).toUpperCase() + role.slice(1)} Authorization Code`}
                  className="w-full bg-red-950/20 border border-red-500/20 rounded-2xl px-5 py-4 text-red-200 placeholder-red-400/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                />
                <p className="text-[10px] text-red-400/60 mt-2 ml-2 italic font-medium">* Restricted access module. Authorization required.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-widest text-sm"
            >
              {loading ? "INITIALIZING UPLINK..." : "CREATE IDENTITY"}
            </button>

            {message && (
              <div className={`text-center text-sm font-bold p-4 rounded-xl animate-bounce ${message.includes("Invalid") ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}`}>
                {message}
              </div>
            )}

            <div className="text-center pt-4">
              <Link href="/auth/login" className="text-slate-400 hover:text-white text-xs font-bold transition-colors uppercase tracking-widest">
                Existing User? <span className="text-red-500 underline underline-offset-4">Authenticate Here</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-500 text-[10px] mt-8 font-black uppercase tracking-[0.3em] opacity-30">
          PROTECTING DATA • SAVING LIVES • HERWA OS v2.0
        </p>
      </div>
    </div>
  );
}


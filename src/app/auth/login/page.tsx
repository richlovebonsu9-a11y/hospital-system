"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else if (data.user) {
      // Fetch role for redirection
      const { data: profile } = await supabase
        .from('patient_profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      const role = profile?.role || data.user.user_metadata?.role || 'patient';
      
      setMessage("Authenticated. Redirecting to terminal...");
      
      setTimeout(() => {
        if (role === 'admin') router.push("/admin/dashboard");
        else if (role === 'staff') router.push("/staff/dashboard");
        else router.push("/patient/dashboard");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 selection:bg-red-500 selection:text-white">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-600/20 text-white text-3xl font-black mb-6 transform hover:-rotate-12 transition-transform cursor-pointer">+</div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic">UNIT LOGIN</h1>
            <p className="text-slate-400 mt-2 text-sm font-medium uppercase tracking-[0.2em]">Secure Authentication Required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="email"
                  required
                  placeholder="Registry Email"
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all group-hover:bg-slate-800/80"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <input
                  type="password"
                  required
                  placeholder="Cipher Key (Password)"
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all group-hover:bg-slate-800/80"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-widest text-sm"
            >
              {loading ? "VERIFYING CREDENTIALS..." : "START SESSION"}
            </button>

            {message && (
              <div className={`text-center text-sm font-bold p-4 rounded-xl animate-bounce ${message.includes("Redirecting") ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                {message}
              </div>
            )}

            <div className="text-center pt-4">
              <Link href="/auth/signup" className="text-slate-400 hover:text-white text-xs font-bold transition-colors uppercase tracking-widest">
                New Recruit? <span className="text-red-500 underline underline-offset-4">Register Account</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Status indicator mockup */}
        <div className="flex justify-center gap-6 mt-8 opacity-20">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-[8px] font-black text-white tracking-widest uppercase">Encryption Active</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span className="text-[8px] font-black text-white tracking-widest uppercase">Vault Secure</span>
           </div>
        </div>
      </div>
    </div>
  );
}


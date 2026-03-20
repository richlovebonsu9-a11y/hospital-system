"use client";
// BUILD TRIGGER: 1773961903 (RBAC & Multi-page navigation sync)

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staffCode, setStaffCode] = useState(""); // New field for secret
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Determine role based on secret code
    const role = staffCode === "HERWA2026" ? "admin" : "patient";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role // This is the key change!
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    } else {
      setMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border-t-8 border-red-600">
        <div>
          <div className="mx-auto h-12 w-12 bg-red-600 rounded flex items-center justify-center text-white text-3xl font-bold">+</div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create HERWA Account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join the HERWA medical network
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="rounded-md shadow-sm -space-y-px">
            <input
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-xl focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="text"
              className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-red-400 text-gray-900 rounded-b-xl focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-red-50/50"
              placeholder="Staff Authorization Code (Optional)"
              value={staffCode}
              onChange={(e) => setStaffCode(e.target.value)}
            />
          </div>

          <div className="text-xs text-gray-400 italic text-center">
            * Entering a valid staff code will grant Admin privileges.
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-md"
            >
              {loading ? "Creating..." : "CREATE ACCOUNT"}
            </button>
          </div>
          {message && <div className="text-center text-sm font-medium text-red-600">{message}</div>}
          <div className="text-center">
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-red-600">Already have an account? Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

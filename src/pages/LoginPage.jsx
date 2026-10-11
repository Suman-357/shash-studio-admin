import React, { useState } from "react";
import { adminApi } from "../services/api";

export const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await adminApi.login(email.trim(), password);
      const token = res.data?.token || res.token;
      const admin = res.data?.admin || res.admin;

      if (!token) {
        throw new Error("Invalid response from server. No token received.");
      }

      localStorage.setItem("shash_admin_token", token);
      if (admin) {
        localStorage.setItem("shash_admin_user", JSON.stringify(admin));
      }

      if (onLoginSuccess) {
        onLoginSuccess(token, admin);
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F6F4ED] p-4 text-[#1A1F1C]">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#E5DFD3] blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#D48C46]/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#2D4A37]/15 shadow-2xl p-8 sm:p-10 z-10">
        {/* Emblem & Title */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#1C3325] text-white flex items-center justify-center text-3xl mx-auto shadow-md">
            🪷
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1C3325] tracking-tight">
              SHASH Studios
            </h1>
            <p className="text-[12px] font-bold text-[#D48C46] uppercase tracking-wider mt-1">
              Admin & Coordinator Portal
            </p>
          </div>
          <p className="text-[13px] text-[#5B635E]">
            Sign in with your studio credentials to access Mysuru rosters, registrations, and batch analytics.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-[12.5px] font-semibold flex items-center gap-2">
            <span className="text-sm">⚠️</span>
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[12.5px] font-bold text-[#1C3325] mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@shashstudios.com"
              className="w-full px-4 py-3 rounded-xl bg-[#FAF8F3] border border-[#2D4A37]/20 text-[14px] text-[#1C3325] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#1C3325]/30 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1C3325] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#FAF8F3] border border-[#2D4A37]/20 text-[14px] text-[#1C3325] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#1C3325]/30 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3.5 rounded-full bg-[#1C3325] text-white font-bold text-[14.5px] shadow-lg hover:bg-[#2D4A37] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

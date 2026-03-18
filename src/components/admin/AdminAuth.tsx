"use client";

import { useState, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "ab_admin_auth";

interface AdminAuthProps {
  children: ReactNode;
}

/**
 * Simple password gate for the admin dashboard.
 * Password is set via NEXT_PUBLIC_ADMIN_PASSWORD env var.
 * Session persists in localStorage for 24 hours.
 */
export default function AdminAuth({ children }: AdminAuthProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check for existing session
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { expiry } = JSON.parse(stored);
      if (Date.now() < expiry) {
        setAuthenticated(true);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setChecking(false);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const adminPassword =
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "agencybrain2026";

    if (password === adminPassword) {
      // Store session for 24 hours
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ expiry: Date.now() + 24 * 60 * 60 * 1000 })
      );
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AB</span>
              </div>
              <span className="font-semibold text-gray-900 text-lg">
                Agency Brain
              </span>
            </div>

            <h1 className="text-center text-gray-900 font-semibold text-lg mb-1">
              Admin Login
            </h1>
            <p className="text-center text-gray-500 text-sm mb-6">
              Enter your admin password to continue.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="Password"
                  autoFocus
                  className={`w-full border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                {error && (
                  <p className="text-red-500 text-sm mt-1">
                    Incorrect password.
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors hover:bg-blue-700 cursor-pointer"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

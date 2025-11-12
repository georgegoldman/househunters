import React, { useState } from "react";
import { useAuth } from "../lib/auth";
import { Navigate, Link } from "react-router-dom";
import { Eye, EyeOff, Home, Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await login(email, password);
    if (!ok) setError("Invalid email or password. Please try again.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm mx:max-w-md mx-auto space-y-8">
        {/* header */}
        <div className="text-center space-y-3">
          <div className="inline-flex border border-neutral-500 h-14 w-14 rounded-2xl bg-black flex items-center justify-center shadow-sm">
            <Home className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-neutral-600">
            Access your property management system
          </p>
        </div>

        {/* card */}
        <div className="rounded-2xl border border-neutral-300 bg-white p-6 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-800"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-neutral-300 bg-neutral-100 pl-10 pr-3 py-3 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            {/* password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-800"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-neutral-300 bg-neutral-100 pl-10 pr-10 py-3 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                    />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign in to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* back link */}
            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-neutral-800 hover:text-neutral-600"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to website
              </Link>
            </div>
          </form>
        </div>

        {/* pill */}
        <div className="text-center mt-3">
          <div className="mx-auto inline-flex items-center rounded-full border border-neutral-300 bg-neutral-100 px-4 py-1.5">
            <Lock className="mr-2 h-4 w-4 text-neutral-700" />
            <span className="text-sm font-medium text-neutral-800">
              Secure Admin Access
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

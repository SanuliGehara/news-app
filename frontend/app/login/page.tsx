"use client";
import React, { useState } from "react";
import Recaptcha from "../../components/Recaptcha";

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      // TODO: Use environment variable for production base URL
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, captcha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      setSuccess(true);
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }
      // Redirect after 1 second
      setTimeout(() => {
        window.location.href = "/articles";
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md border-t-8 border-maroon"
      >
        <h2 className="text-2xl font-bold mb-6 text-maroon text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-maroon mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-maroon"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading || success}
          />
        </div>
        <div className="mb-4">
          <label className="block text-maroon mb-2">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-maroon"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading || success}
          />
        </div>
        <Recaptcha siteKey={siteKey} onChange={setCaptcha} />
        {error && <div className="text-red-600 mb-2 text-center font-semibold border border-red-300 p-2 rounded bg-red-50">{error}</div>}
        {success && <div className="text-green-700 mb-2 text-center font-semibold border border-green-300 p-2 rounded bg-green-50">Login successful! Redirecting...</div>}
        <button
          type="submit"
          className="w-full bg-maroon text-white py-2 rounded font-semibold hover:bg-primary transition"
          disabled={loading || !captcha || success}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-4 text-center">
          <a href="/register" className="text-maroon font-semibold underline hover:text-primary">Don't have an account? Register</a>
        </div>
      </form>
    </div>
  );
}

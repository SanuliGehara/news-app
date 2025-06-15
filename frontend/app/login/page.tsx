"use client";
import React, { useState } from "react";
import Recaptcha from "../../components/Recaptcha";
import { Eye, EyeOff } from 'lucide-react'; 

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<'error' | 'success' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      setModalMessage("Login successful! Redirecting...");
      setModalType('success');
      setShowModal(true);
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }
      // Clear form
      setEmail("");
      setPassword("");
      setCaptcha("");
      
      // Redirect after 1 second
      setTimeout(() => {
        window.location.href = "/articles";
      }, 1000);
    } catch (err: any) {
      setModalMessage(err.message || "Login failed");
      setModalType('error');
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {/* Modal for error/success */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center max-w-xs w-full">
            <span className={modalType === 'error' ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
              {modalMessage}
            </span>
            <button
              className="mt-4 px-4 py-2 bg-maroon text-white rounded hover:bg-maroon/90 transition"
              onClick={() => setShowModal(false)}
              autoFocus
            >
              Close
            </button>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md border-t-8 border-maroon"
      >
        <h2 className="text-2xl font-bold mb-6 text-maroon text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-maroon mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-maroon"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading || success}
          />
        </div>
        <div className="mb-4 relative">
          <label className="block text-maroon mb-2">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-maroon pr-10"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading || success}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-600 hover:text-maroon focus:outline-none tabIndex={-1}"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <Recaptcha siteKey={siteKey} onChange={setCaptcha} />
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

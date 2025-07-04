"use client";
import React, { useState } from "react";
import Recaptcha from "../../components/Recaptcha";
import { Eye, EyeOff } from 'lucide-react'; 

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<'error' | 'success' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Use environment variable for production base URL
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, captcha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setModalMessage("Registration successful! Redirecting to login...");
      setModalType('success');
      setShowModal(true);
      // Clear form and redirect to login page
      setEmail("");
      setPassword("");
      setName("");
      setCaptcha("");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);

    } catch (err: any) {
      setModalMessage(err.message || "Registration failed");
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
        <h2 className="text-2xl font-bold mb-2 text-maroon text-center">Create Your Account</h2>
        <div className="text-maroon text-center mb-6 font-medium">Welcome to TV Derana News App</div>
        <div className="mb-4">
          <label className="block text-maroon mb-2">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-maroon"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-maroon mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-maroon"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
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
          disabled={loading || !captcha}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="mt-4 text-center">
          <a href="/login" className="text-maroon font-semibold underline hover:text-primary">Already have an account? Login</a>
        </div>
      </form>
    </div>
  );
}

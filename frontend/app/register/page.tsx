"use client";
import React, { useState } from "react";
import Recaptcha from "../../components/Recaptcha";

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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
      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, captcha }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setSuccess(true);
      // Clear form and redirect to login page
      setEmail("");
      setPassword("");
      setName("");
      setCaptcha("");

      setTimeout(() => {
        window.location.href = "/login";
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
        <div className="mb-4">
          <label className="block text-maroon mb-2">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-maroon"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <Recaptcha siteKey={siteKey} onChange={setCaptcha} />
        {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
        {success && <div className="text-green-700 mb-2 text-center">Registration successful!</div>}
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

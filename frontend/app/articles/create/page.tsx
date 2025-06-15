"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthHeaders } from "../../../utils/api";

import RequireAuth from "../../../components/RequireAuth";
import NavBar from "../../../components/NavBar";

const CreateArticlePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Local");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("http://localhost:4000/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          title,
          content,
          category,
          imageUrl: imageUrl && imageUrl.match(/^https?:\/\//)
            ? imageUrl
            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoQpgsoU-jmhI98Vs-qzsr_xi5bkEWNrRQmg&s',
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to create article");
      }
      setSuccess("Article created successfully!");
      setTimeout(() => {
        setSuccess("");
        router.push("/articles");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to create article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <NavBar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow p-8 border-t-8 border-maroon">
          <h1 className="text-2xl font-bold text-maroon mb-6">Create New Article</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              className="border rounded px-3 py-2 focus:outline-maroon text-gray-800 placeholder-gray-400 transition"
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <textarea
              className="border rounded px-3 py-2 h-40 resize-vertical focus:outline-maroon text-gray-800 placeholder-gray-400 transition"
              placeholder="Content"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
            <select
              className="border rounded px-3 py-2 text-gray-800 bg-white focus:outline-maroon transition appearance-none"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              <option value="general">Local</option>
              <option value="sports">Sports</option>
              <option value="business">Business</option>
              <option value="tech">Tech</option>
              <option value="entertainment">Entertainment</option>
            </select>
            <input
              className="border rounded px-3 py-2 focus:outline-maroon text-gray-800 placeholder-gray-400 transition"
              type="url"
              placeholder="Image URL (optional)"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              pattern="https?://.*"
            />
            <img
              src={imageUrl && imageUrl.match(/^https?:\/\//) ? imageUrl : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoQpgsoU-jmhI98Vs-qzsr_xi5bkEWNrRQmg&s'}
              alt="Preview"
              className="max-h-48 rounded mb-2 border object-contain"
              style={{maxWidth: '100%'}}
            />
            <button
              className="bg-maroon text-white font-bold py-2 rounded hover:bg-maroon/90 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Article"}
            </button>
            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}
          </form>
        </div>
    </div>
    </>
  );
};

export default function ProtectedCreateArticlePage() {
  return (
    <RequireAuth>
      <CreateArticlePage />
    </RequireAuth>
  );
}

// Export the original for testing or advanced use
export { CreateArticlePage };


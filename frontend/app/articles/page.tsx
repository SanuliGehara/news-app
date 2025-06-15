"use client";
import React, { useEffect, useState } from "react";
import RequireAuth from "../../components/RequireAuth";
import ArticleCard from "../../components/ArticleCard";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useRouter } from "next/navigation";

interface Article {
  id: number;
  title: string;
  content: string;
  author: { name: string };
  publishedAt: string;
  views: number;
  likes: number;
}

import { useAuth } from "../../components/AuthProvider";

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "General", value: "general" },
  { label: "Sports", value: "sports" },
  { label: "Business", value: "business" },
  { label: "Tech", value: "tech" },
  { label: "Entertainment", value: "entertainment" },
];
const SORT_OPTIONS = [
  { label: "Newest", value: "date" },
  { label: "Most Viewed", value: "views" },
  { label: "Most Liked", value: "likes" },
];

import UserNavInfo from "./UserNavInfo";
import SidebarFilter from "./SidebarFilter";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [visibleArticlesCount, setVisibleArticlesCount] = useState(6);
  const router = useRouter();

  // Reset visibleArticlesCount when filters or articles change
  useEffect(() => {
    setVisibleArticlesCount(6);
  }, [category, sortBy, articles]);

  // Fetch articles when category or sort changes
  useEffect(() => {
    setLoading(true);
    setError("");
    const headers = require('../../utils/api').getAuthHeaders();
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (sortBy) params.append("sortBy", sortBy);
    fetch(`http://localhost:4000/articles?${params.toString()}`, {
      headers,
    })
      .then(res => {
        if (!res.ok) throw new Error(res.status === 401 ? "Unauthorized: Please log in again." : "Failed to fetch articles");
        return res.json();
      })
      .then(data => setArticles(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [category, sortBy]);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navbar */}
        <nav className="w-full bg-maroon shadow-lg py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-white tracking-wide">Ada Derana</span>
            <span className="ml-2 text-base text-white/80 hidden sm:inline">News Portal</span>
          </div>
          {/* User info and logout */}
          <UserNavInfo />
        </nav>
        {/* Main content with sidebar filter and articles grid */}
        <div className="flex flex-col sm:flex-row max-w-7xl mx-auto w-full px-2 gap-6 mt-8 mb-8">
          <SidebarFilter
            category={category}
            setCategory={setCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={CATEGORIES}
            sortOptions={SORT_OPTIONS}
          />
          <div className="w-full">
            {loading && <div className="text-maroon text-center py-10">Loading articles...</div>}
            {error && <div className="text-red-600 text-center py-10">{error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.slice(0, visibleArticlesCount).map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
              {!loading && articles.length === 0 && (
                <div className="text-gray-500 text-center col-span-full">No articles found.</div>
              )}
            </div>
            {/* View More button */}
            {visibleArticlesCount < articles.length && (
              <div className="flex justify-center mt-6">
                <button
                  className="bg-maroon text-white px-6 py-2 rounded shadow hover:bg-maroon/90 font-semibold transition"
                  onClick={() => setVisibleArticlesCount(
                    typeof window !== "undefined" && window.innerWidth < 640
                      ? visibleArticlesCount + 4
                      : visibleArticlesCount + 6
                  )}
                >
                  View More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Floating Plus Button (only for admin/editor) */}
      {(() => {
        const auth = useAuth();
        const role = auth?.user?.role;
        if (role === "admin" || role === "editor") {
          return (
            <button
              className="fixed bottom-8 right-8 bg-maroon text-white rounded-lg shadow-lg p-4 hover:bg-maroon/90 focus:outline-none z-50"
              title="Create New Article"
              onClick={() => router.push('/articles/create')}
              style={{ boxShadow: '0 4px 16px rgba(142,22,22,0.2)' }}
            >
              <AiOutlinePlusCircle className="text-4xl" />
            </button>
          );
        }
        return null;
      })()}

    </RequireAuth>
  );
}

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

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const headers = require('../../utils/api').getAuthHeaders();
    fetch("http://localhost:4000/articles", {
      headers,
    })
      .then(res => {
        if (!res.ok) throw new Error(res.status === 401 ? "Unauthorized: Please log in again." : "Failed to fetch articles");
        return res.json();
      })
      .then(data => setArticles(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Maroon gradient header */}
        <div className="w-full bg-gradient-to-b from-maroon to-maroon/80 py-8 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">Ada Derana - News Articles</h1>
        </div>
        {/* Subtitle and tag filter placeholder */}
        <div className="max-w-5xl mx-auto w-full px-4 -mt-8 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-maroon mb-2 text-center">Article Filter with Categories Or Tags</h2>
            <div className="text-gray-600 text-center mb-4">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </div>
            {/* Tag filter placeholder */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <span className="bg-gray-200 rounded px-3 py-1 text-xs font-medium text-gray-700 cursor-pointer">Cloud</span>
              <span className="bg-gray-200 rounded px-3 py-1 text-xs font-medium text-gray-700 cursor-pointer">Network</span>
              <span className="bg-gray-200 rounded px-3 py-1 text-xs font-medium text-gray-700 cursor-pointer">Analytics</span>
              <span className="bg-gray-200 rounded px-3 py-1 text-xs font-medium text-gray-700 cursor-pointer">Medicare</span>
              <span className="bg-gray-200 rounded px-3 py-1 text-xs font-medium text-gray-700 cursor-pointer">Learning</span>
            </div>
          </div>
        </div>
        {/* Articles grid */}
        <div className="max-w-6xl mx-auto w-full px-4">
          {loading && <div className="text-maroon text-center py-10">Loading articles...</div>}
          {error && <div className="text-red-600 text-center py-10">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
            {!loading && articles.length === 0 && (
              <div className="text-gray-500 text-center col-span-full">No articles found.</div>
            )}
          </div>
        </div>
        {/* Pagination controls (UI only) */}
        {/* <div className="flex justify-center items-center gap-4 mt-10 mb-8">
          <button className="flex items-center gap-1 text-gray-500 hover:text-maroon disabled:opacity-50" disabled>
            <span className="material-icons">chevron_left</span> Previous
          </button>
          <span className="bg-maroon text-white rounded px-3 py-1 font-semibold">1</span>
          <button className="flex items-center gap-1 text-gray-500 hover:text-maroon">
            Next <span className="material-icons">chevron_right</span>
          </button>
        </div> */}
      </div>
      {/* Floating Plus Button */}
      <button
        className="fixed bottom-8 right-8 bg-maroon text-white rounded-lg shadow-lg p-4 hover:bg-maroon/90 focus:outline-none z-50"
        title="Create New Article"
        onClick={() => router.push('/articles/create')}
        style={{ boxShadow: '0 4px 16px rgba(142,22,22,0.2)' }}
      >
        <AiOutlinePlusCircle className="text-4xl" />
      </button>
    </RequireAuth>
  );
}

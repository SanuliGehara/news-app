"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RequireAuth from "../../../components/RequireAuth";
import { getAuthHeaders } from "../../../utils/api";
import { AiOutlineEye, AiOutlineHeart, AiFillHeart, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

interface Article {
  id: number;
  title: string;
  content: string;
  author: { name: string };
  authorId: number;
  publishedAt : string;
  views: number;
  likes: number;
  tags?: string[];
  imageUrl?: string;
}

import { useAuth } from "../../../components/AuthProvider";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const auth = useAuth() as any; 
  const { user } = auth;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [articleError, setArticleError] = useState(""); // For article fetch/display errors
  const [likeError, setLikeError] = useState(""); // For like errors only
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Helper: localStorage key for liked state
  const likedKey = id ? `liked_article_${id}` : null;

  const handleLike = async () => {
    if (!id) return;
    try {
      const response = await fetch(`http://localhost:4000/articles/${id}/like`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        let msg = data?.message || "Failed to like article";
        setLikeError(msg);
        return;
      }
      setLiked(true);
      setLikeCount(likeCount + 1);
      setLikeError("");
      // Persist liked state in localStorage
      if (likedKey) localStorage.setItem(likedKey, "true");
    } catch (error) {
      setLikeError("Failed to like article");
    }
  };

  // On mount or when id changes, check liked state and fetch article
  useEffect(() => {
    if (!id) return;
    // Check liked state
    if (likedKey && localStorage.getItem(likedKey)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    // Increment view count
    fetch(`http://localhost:4000/articles/${id}/view`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    // Fetch article
    fetch(`http://localhost:4000/articles/${id}`, {
      headers: getAuthHeaders(),
    })
      .then(res => {
        if (!res.ok) throw new Error(res.status === 404 ? "Article not found" : "Failed to fetch article");
        return res.json();
      })
      .then(data => {
        setArticle(data);
        setLikeCount(data.likes);
        setLoading(false);
      })
      .catch(err => {
        setArticleError(err.message || "Failed to fetch article");
        setLoading(false);
      });
  }, [id, likedKey]);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow p-8 border-t-8 border-maroon">
          {loading && <div className="text-maroon text-center py-10">Loading article...</div>}
          {articleError && <div className="text-red-600 text-center py-10">{articleError}</div>}
          {article && (
            <>
              {/* Image placeholder */}
              <div className="h-64 bg-gray-100 flex items-center justify-center mb-6 rounded-md">
                {article.imageUrl ? (
                  <img src={article.imageUrl} alt={article.title} className="object-cover w-full h-full rounded-md" />
                ) : (
                  <div className="text-gray-400 text-6xl">
                    <span className="material-icons">image</span>
                  </div>
                )}
              </div>
              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map(tag => (
                    <span key={tag} className="bg-gray-200 text-xs rounded px-2 py-0.5 font-medium text-gray-700">{tag}</span>
                  ))}
                </div>
              )}
              {/* Edit/Delete Icons */}
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-bold text-maroon">{article.title}</h1>
                <div className="flex gap-3">
                  {/* Edit: Admins can edit any article, editors only their own */}
                  {(user?.role === "admin" || (user?.role === "editor" && user?.id == article.authorId)) && (
                    <button
                      className="p-2 rounded hover:bg-gray-100 text-maroon"
                      title="Edit Article"
                      onClick={() => router.push(`/articles/edit/${article.id}`)}
                      disabled={deleteLoading}
                    >
                      <AiOutlineEdit className="text-2xl" />
                    </button>
                  )}
                  {/* Delete only for admins */}
                  {user?.role === "admin" && (
                    <button
                      className="p-2 rounded hover:bg-gray-100 text-maroon disabled:opacity-50"
                      title="Delete Article"
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this article?')) {
                          setDeleteLoading(true);
                          setDeleteError("");
                          try {
                            const res = await fetch(`http://localhost:4000/articles/${article.id}`, {
                              method: 'DELETE',
                              headers: getAuthHeaders(),
                            });
                            if (!res.ok) {
                              const data = await res.json().catch(() => ({}));
                              setDeleteError(data?.message || 'Failed to delete article');
                              setDeleteLoading(false);
                              return;
                            }
                            router.push('/articles');
                          } catch (err: any) {
                            setDeleteError(err.message || 'Failed to delete article');
                            setDeleteLoading(false);
                          }
                        }
                      }}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? (
                        <span className="w-5 h-5 inline-block animate-spin border-2 border-maroon border-t-transparent rounded-full"></span>
                      ) : (
                        <AiOutlineDelete className="text-2xl" />
                      )}
                    </button>
                  )}
                  {deleteError && (
                    <div className="text-red-600 text-xs mt-2">{deleteError}</div>
                  )}
                </div>
              </div>
              {/* Author, Date, Views, Likes */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-6 items-center">
                <span>By {article.author?.name || "Unknown"}</span>
                <span>{new Date(article.publishedAt).toLocaleString()}</span>
                <span className="flex items-center gap-1">
                  <AiOutlineEye className="text-xl text-maroon" /> {article.views} views
                </span>
                <span className="flex items-center gap-1">
                  <button
                    className={`focus:outline-none transition-transform ${liked ? 'scale-110' : ''}`}
                    style={{ background: 'none', border: 'none', padding: 0, marginRight: 4 }}
                    onClick={handleLike}
                    disabled={liked}
                    aria-label="Like this article"
                  >
                    {liked ? (
                      <AiFillHeart className="text-2xl text-red-500" />
                    ) : (
                      <AiOutlineHeart className="text-2xl text-gray-400 hover:text-red-500 transition-colors" />
                    )}
                  </button>
                  <span>{likeCount} likes</span>
                  {likeError && (
                    <span className="text-xs text-red-500 ml-2">{likeError}</span>
                  )}
                </span>
              </div>
              {/* Content */}
              <div className="prose max-w-none text-gray-900 mb-6">
                {article.content}
              </div>
              {/* Back button */}
              <button onClick={() => router.back()} className="bg-maroon text-white rounded px-4 py-2 text-sm font-semibold hover:bg-maroon/90 transition">
                Back to Articles
              </button>
            </>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}

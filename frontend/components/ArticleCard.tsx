import React from "react";

interface ArticleCardProps {
  article: {
    id: number;
    title: string;
    content: string;
    imageUrl?: string;
    tags?: string[];
    author: { name: string };
    publishedAt: string;
    views: number;
    likes: number;
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-xl transition group">
      {/* Image (with fallback if not present) */}
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        <img
          src={article.imageUrl && article.imageUrl.match(/^https?:\/\//)
            ? article.imageUrl
            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoQpgsoU-jmhI98Vs-qzsr_xi5bkEWNrRQmg&s'}
          alt={article.title}
          className="object-cover w-full h-full"
        />
      </div>
      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pt-3">
          {article.tags.map(tag => (
            <span key={tag} className="bg-gray-200 text-xs rounded px-2 py-0.5 font-medium text-gray-700">{tag}</span>
          ))}
        </div>
      )}
      {/* Date */}
      <div className="px-4 pt-2">
        <span className="bg-gray-200 text-gray-700 text-xs rounded px-2 py-0.5">
          {new Date(article.publishedAt).toLocaleString()}
        </span>
      </div>
      {/* Title */}
      <div className="px-4 pt-2">
        <h2 className="text-lg font-bold text-maroon mb-1 group-hover:underline line-clamp-2">{article.title}</h2>
      </div>
      {/* Author, Views, Likes */}
      <div className="px-4 text-xs text-gray-500 flex flex-wrap gap-2 mb-2">
        <span>By {article.author?.name || "Unknown"}</span>
        <span>• {article.views} views</span>
        <span>• {article.likes} likes</span>
      </div>
      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-700 text-sm line-clamp-3">{article.content}</p>
      </div>
      {/* Read More Button */}
      <div className="px-4 pb-4 mt-auto">
        <a href={`/articles/${article.id}`} className="inline-block bg-maroon text-white rounded px-4 py-2 text-sm font-semibold hover:bg-maroon/90 transition">Read more</a>
      </div>
    </div>
  );
}

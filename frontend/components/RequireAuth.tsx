"use client";
import React from "react";
import { useAuth } from "./AuthProvider";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-maroon font-semibold text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-maroon font-semibold text-lg">You must be logged in to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}

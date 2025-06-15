"use client";
import React from "react";
import UserNavInfo from "../app/articles/UserNavInfo";

export default function NavBar() {
  return (
    <nav className="w-full bg-maroon shadow-lg py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-extrabold text-white tracking-wide">Ada Derana</span>
        <span className="ml-2 text-base text-white/80 hidden sm:inline">News Portal</span>
      </div>
      {/* User info and logout */}
      <UserNavInfo />
    </nav>
  );
}

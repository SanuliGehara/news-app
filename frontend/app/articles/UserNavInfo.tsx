"use client";
import React from "react";
import { useAuth } from "../../components/AuthProvider";
import { AiOutlineUser } from "react-icons/ai";

const UserNavInfo: React.FC = () => {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center">
        <AiOutlineUser className="text-white text-xl" />
      </div>
      <span className="text-white/90 text-sm capitalize">{user.role}</span>
      <button
        onClick={logout}
        className="ml-2 px-3 py-1 rounded bg-white/20 hover:bg-white/40 text-white font-semibold text-xs shadow transition"
        title="Logout"
      >
        Logout
      </button>
    </div>
  );
};

export default UserNavInfo;

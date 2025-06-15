"use client";
import Image from "next/image"; 

import RequireAuth from "../components/RequireAuth";
import NavBar from "../components/NavBar";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  // Modal state for future extensibility (e.g., welcome, logout, fetch errors)
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<'error' | 'success' | null>(null);
  return (
    <RequireAuth>
      {/* Navbar */}
      <NavBar />
      {/* Modal for error/success (future use) */}
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
      <div className="min-h-screen flex items-center justify-center bg-white p-8">
        <button
          className="bg-maroon text-white px-6 py-2 rounded shadow hover:bg-maroon/90 font-semibold transition"
          onClick={() => router.push(`/articles`)}
        >
          View Articles
        </button>
      </div>
    </RequireAuth>
  );
}

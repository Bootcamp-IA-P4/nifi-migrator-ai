// src/components/Layout.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Home, Upload, Users } from "lucide-react";

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">NEXOPS</h1>
        <nav className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 hover:text-cyan-400">
            <Home size={18} /> Home
          </Link>
          <Link to="/upload" className="flex items-center gap-2 hover:text-cyan-400">
            <Upload size={18} /> Upload
          </Link>
          <Link to="/about" className="flex items-center gap-2 hover:text-cyan-400">
            <Users size={18} /> About
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}

export default Layout;

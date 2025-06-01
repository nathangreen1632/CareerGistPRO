import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../hooks/useAuth.js";

const Layout: React.FC = () => {
  const { token, logout } = useAuth(); // assumes context provides `token` and `logout`

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar token={token} handleLogout={logout} />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-inner py-4">
        <div className="container mx-auto text-center text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} CareerGist — All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;

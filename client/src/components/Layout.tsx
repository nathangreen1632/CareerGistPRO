import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../hooks/useAuth.js";

const Layout: React.FC = () => {
  const { token, logout } = useAuth(); // assumes context provides `token` and `logout`

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar token={token} handleLogout={logout} />

      <main className="flex-1 mx-auto w-full px-4 sm:px-6 py-8 max-w-7xl">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow-inner py-4">
        <div className="mx-auto w-full px-4 sm:px-6 text-center text-gray-500 dark:text-gray-400 max-w-7xl">
          © {new Date().getFullYear()} CareerGist — All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;

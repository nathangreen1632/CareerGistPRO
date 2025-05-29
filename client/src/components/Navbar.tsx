import React from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  token: string | null;
  handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ token, handleLogout }) => {
  return (
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        <span className="text-gray-800 dark:text-white">CareerGist</span>
        <span className="text-gray-800 dark:text-red-500">PRO</span>
      </Link>

      <nav className="flex space-x-6">
        <Link
          to="/"
          className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition-all duration-200 focus:outline-none"
        >
          Home
        </Link>

        {!token ? (
          <>
            <Link
              to="/register"
              className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition-all duration-200 focus:outline-none"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition-all duration-200 focus:outline-none"
            >
              Login
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/profile"
              className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition-all duration-200 focus:outline-none"
            >
              Profile
            </Link>
            <Link
              to="/favorites"
              className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition-all duration-200 focus:outline-none"
            >
              Favorites
            </Link>
            <Link
              to="/applied"
              className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition-all duration-200 focus:outline-none"
            >
              Applied
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition-all duration-200 focus:outline-none"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;

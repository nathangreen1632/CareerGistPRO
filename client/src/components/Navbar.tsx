import React, { useState } from "react";
import { NavLink } from "react-router-dom";

interface NavbarProps {
  token: string | null;
  handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ token, handleLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const authedPages = [
    { name: "Home", path: "/" },
    { name: "Profile", path: "/profile" },
    { name: "Favorites", path: "/favorites" },
    { name: "Applied", path: "/applied" },
  ];

  const publicPages = [
    { name: "Home", path: "/" },
    { name: "Register", path: "/register" },
    { name: "Login", path: "/login" },
  ];

  const pagesToShow = token ? authedPages : publicPages;

  const linkClasses = (isActive: boolean) =>
    [
      isActive ? "text-red-500" : "hover:text-red-400",
      "transition duration-200",
    ].join(" ");

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <NavLink to="/" className="text-xl font-bold tracking-wide">
          CareerGist<span className="text-red-500">PRO</span>
        </NavLink>

        <div className="hidden lg:flex space-x-6 items-center">
          {pagesToShow.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) => linkClasses(isActive)}
            >
              {item.name}
            </NavLink>
          ))}

          {token && (
            <button
              onClick={handleLogout}
              className="hover:text-red-500 transition duration-200 focus:outline-none"
            >
              Logout
            </button>
          )}
        </div>

        <button
          className="lg:hidden text-white text-3xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-gray-800 px-6 pb-4 space-y-2">
          {pagesToShow.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) => linkClasses(isActive)}
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </NavLink>
          ))}

          {token && (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="block w-full text-left py-2 hover:text-red-400 transition duration-200"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

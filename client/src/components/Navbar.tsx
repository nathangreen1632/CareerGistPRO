import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export type NavLinkRenderProps = {
  isActive: boolean;
  isPending: boolean;
  isTransitioning?: boolean;
};

interface NavbarProps {
  token: string | null;
  handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ token, handleLogout }: NavbarProps): React.ReactElement => {
  const [menuOpen, setMenuOpen] = useState(false);

  const authedPages: {name: string; path: string;}[] = [
    { name: "Home", path: "/" },
    { name: "Profile", path: "/profile" },
    { name: "Favorites", path: "/favorites" },
    { name: "Applied", path: "/applied" },
  ];

  const publicPages: {name: string; path: string;}[] = [
    { name: "Home", path: "/" },
    { name: "Register", path: "/register" },
    { name: "Login", path: "/login" },
  ];

  const pagesToShow: {name: string, path: string}[] = token ? authedPages : publicPages;

  const linkClasses: (isActive: boolean) => string = (isActive: boolean): string =>
    [
      "block w-full text-left md:w-auto md:text-center px-2 py-2 rounded-md",
      "transition duration-200",
      isActive ? "text-red-500 font-semibold" : "text-gray-200 hover:text-red-400",
      isActive ? "md:border-b-2 md:border-red-500" : "md:border-b-2 md:border-transparent",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
    ].join(" ");

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50" role="navigation" aria-label="Primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <NavLink
            to="/"
            className="text-xl font-bold tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-md"
          >
            CareerGist<span className="text-red-500">PRO</span>
          </NavLink>

          <div className="hidden md:flex items-center space-x-6">
            {pagesToShow.map((item: {name: string, path: string;}): React.ReactElement => (
              <NavLink key={item.path} to={item.path} end className={({ isActive }: NavLinkRenderProps): string => linkClasses(isActive)}>
                {item.name}
              </NavLink>
            ))}

            {token && (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md hover:text-red-400 transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
              >
                Logout
              </button>
            )}
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={(): void => setMenuOpen((v: boolean): boolean => !v)}
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 pb-4 pt-2 space-y-1">
            {pagesToShow.map((item: {name: string, path: string}): React.ReactElement => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }: NavLinkRenderProps): string => linkClasses(isActive)}
                onClick={(): void => setMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}

            {token && (
              <button
                onClick={(): void => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-2 py-2 rounded-md hover:text-red-400 transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

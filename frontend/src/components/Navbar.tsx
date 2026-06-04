/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";

interface NavbarProps {
  isLoggedIn: boolean;
  userName?: string;
  onLogout: () => void;
  onNavClick?: (section: string) => void;
}

export default function Navbar({ isLoggedIn, userName, onLogout, onNavClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = isLoggedIn
    ? [
        { label: "Dashboard", id: "dashboard" },
        { label: "Upload Document", id: "docScan" },
        { label: "History", id: "history" },
        { label: "Profile", id: "profile" }
      ]
    : [
        { label: "Home", id: "home" },
        { label: "Features", id: "features" },
        { label: "About", id: "about" }
      ];

  const handleNavClick = (id: string) => {
    onNavClick?.(id);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-navy text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 font-bold text-xl text-gold">
            LexiAid
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-6 items-center">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className="hover:text-gold transition-colors duration-200 text-sm font-medium"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            {isLoggedIn ? (
              <div className="flex items-center gap-4 pl-6 border-l border-gray-700">
                <span className="text-sm">{userName}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded bg-gold text-navy hover:bg-yellow-400 transition-colors text-sm font-medium"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick("login")}
                className="px-4 py-2 rounded bg-gold text-navy hover:bg-yellow-400 transition-colors font-medium text-sm"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-opacity-20 hover:bg-white transition-colors"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-gold" />
              ) : (
                <Menu size={24} className="text-gold" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-700">
            <ul className="space-y-2 pt-4">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className="block w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            {isLoggedIn ? (
              <div className="space-y-2 pt-4 border-t border-gray-700 mt-4">
                <p className="px-4 text-sm text-gray-300">{userName}</p>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 rounded bg-gold text-navy hover:bg-yellow-400 transition-colors text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick("login")}
                className="block w-full text-left px-4 py-2 mt-4 rounded bg-gold text-navy hover:bg-yellow-400 transition-colors font-medium text-sm"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

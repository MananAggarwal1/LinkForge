import React from 'react';
import { LogOut, User, LayoutDashboard, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = ({ onOpenAuth }) => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="relative mx-auto flex max-w-6xl items-center gap-8 px-5 py-5 z-20">
      {/* Brand */}
      <a
        href="#"
        className="flex items-center gap-2 font-display text-lg font-bold text-foreground"
      >
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-white shadow-glow">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          >
            <path d="M9 15 15 9"></path>
            <path d="M11 6.5 12.5 5a4 4 0 0 1 5.7 5.7L16.6 12.3"></path>
            <path d="M13 17.5 11.5 19a4 4 0 0 1-5.7-5.7L7.4 11.7"></path>
          </svg>
        </span>
        <span>
          Link<span className="text-primary">Forge</span>
        </span>
      </a>

      {/* Nav items */}
      <nav className="hidden gap-6 text-sm font-medium text-muted-foreground md:flex">
        <a href="#features" className="hover:text-foreground transition">
          Features
        </a>
        <a href="#architecture" className="hover:text-foreground transition">
          Architecture
        </a>
        <a href="#faq" className="hover:text-foreground transition">
          FAQ
        </a>
      </nav>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-2.5">
        <button
          onClick={() => onOpenAuth('login')}
          className="hidden sm:inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors hover:bg-muted hover:text-foreground h-8 rounded-md px-3 text-xs text-muted-foreground"
        >
          Login
        </button>
        <button
          onClick={() => onOpenAuth('register')}
          className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors bg-primary text-white shadow-sm hover:brightness-110 h-8 rounded-md px-3.5 text-xs font-semibold"
        >
          Sign Up
        </button>

        {/* Theme Toggle Button */}
        <ThemeToggle />
      </div>
    </header>
  );
};

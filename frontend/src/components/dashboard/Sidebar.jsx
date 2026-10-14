import React from 'react';
import {
  LayoutDashboard,
  Link2,
  BarChart3,
  QrCode,
  Settings,
  PlusCircle,
  LogOut,
  Zap,
  ChevronRight,
  ShieldCheck,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ThemeToggle';

export const Sidebar = ({
  currentTab,
  onTabChange,
  linksCount = 0,
  onOpenQuickCreate,
  isOpen = true,
  onCloseMobile
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'links',
      label: 'Links',
      icon: Link2,
      badge: linksCount > 0 ? linksCount : null,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'qr-codes',
      label: 'QR Codes',
      icon: QrCode,
      badge: null,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 border-r border-border bg-card/95 backdrop-blur-md transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Sidebar Brand Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/80">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onTabChange('dashboard');
            if (onCloseMobile) onCloseMobile();
          }}
          className="flex items-center gap-2.5 font-display text-base font-bold text-foreground"
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
          <div className="flex flex-col">
            <span className="leading-none">
              Link<span className="text-primary">Forge</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-mono font-medium mt-0.5">
              Enterprise v1.0
            </span>
          </div>
        </a>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
        >
          ✕
        </button>
      </div>

      {/* Quick Forge Action Button */}
      <div className="p-4">
        <button
          type="button"
          onClick={() => {
            if (onOpenQuickCreate) onOpenQuickCreate();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-primary text-white text-xs font-semibold shadow-glow hover:brightness-110 transition duration-200"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Forge New Link</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null ? (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-primary/20 text-primary">
                  {item.badge}
                </span>
              ) : isActive ? (
                <ChevronRight className="w-3.5 h-3.5 text-primary opacity-60" />
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* System Telemetry Status Pill */}
      <div className="p-4 mx-3 mb-3 rounded-xl border border-border bg-card/60 text-[11px]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Redis Cache-Aside
          </span>
          <span className="font-mono text-primary font-bold text-[10px]">&lt;5ms</span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-tight">
          In-memory sub-millisecond redirection lookup is active.
        </p>
      </div>

      {/* Footer Profile & Controls */}
      <div className="p-3 border-t border-border/80 flex items-center justify-between gap-2 bg-card/40">
        <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary font-bold font-display flex items-center justify-center flex-shrink-0 text-xs">
            {(user?.fullName || user?.username || 'U')[0].toUpperCase()}
          </div>
          <div className="overflow-hidden min-w-0">
            <span className="font-semibold text-xs text-foreground block truncate">
              {user?.fullName || user?.username}
            </span>
            <span className="text-[10px] text-muted-foreground block truncate">
              {user?.email || `@${user?.username}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <ThemeToggle />
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

import React from 'react';
import { Menu, Plus, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export const WorkspaceHeader = ({
  currentTab,
  onOpenQuickCreate,
  onToggleSidebar
}) => {
  const { user } = useAuth();

  const tabLabels = {
    dashboard: 'Dashboard Overview',
    links: 'Link Management',
    analytics: 'Visitor Analytics & Telemetry',
    'qr-codes': 'Dynamic QR Code Studio',
    settings: 'Account & API Settings',
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 sm:px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted md:hidden"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Title */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <span className="hidden sm:inline">Workspace</span>
          <span className="hidden sm:inline">/</span>
          <span className="font-semibold text-foreground text-sm font-display">
            {tabLabels[currentTab] || 'Dashboard'}
          </span>
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-card text-[11px] font-medium text-muted-foreground shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Tenant Isolated</span>
        </div>

        <button
          type="button"
          onClick={onOpenQuickCreate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold shadow-sm hover:brightness-110 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Link</span>
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
};

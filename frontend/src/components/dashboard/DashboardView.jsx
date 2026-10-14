import React, { useEffect, useState } from 'react';
import { Sparkles, BarChart2, Link2, QrCode, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CreateLinkCard } from './CreateLinkCard';
import { LinkList } from './LinkList';
import { StatsOverview } from './StatsOverview';
import api from '../../api/client';

export const DashboardView = ({
  links,
  linksLoading,
  onLinkCreated,
  onLinkUpdated,
  onToggleActive,
  onDeleteLink,
  onOpenAnalytics,
  onOpenQr,
  onOpenEdit,
  onShowToast,
  onTabChange,
}) => {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);

  // Fetch or calculate dashboard overview stats
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get('/api/links/dashboard/overview');
        setOverview(res.data);
      } catch (e) {
        if (links) {
          const totalLinks = links.length;
          const activeLinks = links.filter((l) => l.active).length;
          const totalClicks = links.reduce((sum, l) => sum + (l.totalClicks || 0), 0);
          setOverview({ totalLinks, activeLinks, totalClicks });
        }
      }
    };

    fetchOverview();
  }, [links]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Dashboard Workspace</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            Welcome back, {user?.fullName || user?.username}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Forge short links, customize slugs, generate dynamic QR codes, and monitor telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onTabChange && onTabChange('analytics')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition shadow-sm"
          >
            <BarChart2 className="w-3.5 h-3.5 text-primary" />
            <span>View Analytics</span>
          </button>
          <button
            onClick={() => onTabChange && onTabChange('qr-codes')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-500" />
            <span>QR Studio</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <StatsOverview overview={overview} />

      {/* Shorten Form Container */}
      <div className="space-y-3">
        <h2 className="font-display font-semibold text-base sm:text-lg text-foreground flex items-center gap-2">
          <Link2 className="w-4 h-4 text-primary" />
          <span>Forge a New Link</span>
        </h2>
        <CreateLinkCard
          onLinkCreated={onLinkCreated}
          onOpenQr={onOpenQr}
          onShowToast={onShowToast}
        />
      </div>

      {/* Recent Forged Links List */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-base sm:text-lg text-foreground flex items-center gap-2">
            <span>Recent Forged Links</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-bold">
              {links.length}
            </span>
          </h2>

          {links.length > 0 && (
            <button
              onClick={() => onTabChange && onTabChange('links')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 transition"
            >
              <span>Manage all links</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <LinkList
          links={links.slice(0, 6)}
          loading={linksLoading}
          onCopy={(url) => onShowToast('Copied to clipboard!', 'info')}
          onOpenAnalytics={onOpenAnalytics}
          onOpenQr={onOpenQr}
          onOpenEdit={onOpenEdit}
          onToggleActive={onToggleActive}
          onDelete={onDeleteLink}
        />
      </div>
    </div>
  );
};

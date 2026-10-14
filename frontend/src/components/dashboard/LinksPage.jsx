import React, { useState, useMemo } from 'react';
import {
  Link2,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Lock,
  CheckCircle,
  PauseCircle,
  ExternalLink
} from 'lucide-react';
import { LinkList } from './LinkList';

export const LinksPage = ({
  links,
  linksLoading,
  onCopy,
  onOpenAnalytics,
  onOpenQr,
  onOpenEdit,
  onToggleActive,
  onDelete,
  onOpenQuickCreate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'paused', 'protected'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'clicks', 'oldest'

  const activeCount = useMemo(() => links.filter((l) => l.active).length, [links]);
  const pausedCount = useMemo(() => links.filter((l) => !l.active).length, [links]);
  const protectedCount = useMemo(() => links.filter((l) => l.hasPassword).length, [links]);

  const filteredLinks = useMemo(() => {
    let result = [...links];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.shortCode?.toLowerCase().includes(q) ||
          l.originalUrl?.toLowerCase().includes(q) ||
          l.title?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter === 'active') {
      result = result.filter((l) => l.active);
    } else if (statusFilter === 'paused') {
      result = result.filter((l) => !l.active);
    } else if (statusFilter === 'protected') {
      result = result.filter((l) => l.hasPassword);
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'clicks') {
      result.sort((a, b) => (b.totalClicks || 0) - (a.totalClicks || 0));
    }

    return result;
  }, [links, searchQuery, statusFilter, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
            Link Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Organize, monitor, edit, and analyze all your forged short URLs.
          </p>
        </div>

        <button
          onClick={onOpenQuickCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-white text-xs font-semibold shadow-glow hover:brightness-110 transition duration-200 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Forge Link</span>
        </button>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card shadow-card">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            All ({links.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              statusFilter === 'active'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('paused')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              statusFilter === 'paused'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Paused ({pausedCount})
          </button>
          <button
            onClick={() => setStatusFilter('protected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              statusFilter === 'protected'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Protected ({protectedCount})
          </button>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-input rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="newest">Newest</option>
              <option value="clicks">Most Clicks</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Links List */}
      <div>
        <LinkList
          links={filteredLinks}
          loading={linksLoading}
          onCopy={onCopy}
          onOpenAnalytics={onOpenAnalytics}
          onOpenQr={onOpenQr}
          onOpenEdit={onOpenEdit}
          onToggleActive={onToggleActive}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

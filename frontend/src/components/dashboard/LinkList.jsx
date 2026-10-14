import React, { useState, useMemo } from 'react';
import { Search, Link2Off } from 'lucide-react';
import { LinkCard } from './LinkCard';

export const LinkList = ({
  links,
  loading,
  onCopy,
  onOpenAnalytics,
  onOpenQr,
  onOpenEdit,
  onToggleActive,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'clicks'

  const filteredLinks = useMemo(() => {
    return links
      .filter((l) => {
        return (
          !searchTerm ||
          (l.title && l.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (l.shortCode && l.shortCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (l.originalUrl && l.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'clicks') {
          return b.clickCount - a.clickCount;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [links, searchTerm, sortBy]);

  return (
    <div className="space-y-4">
      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search your links or slugs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-card border border-input rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring shadow-sm h-10"
          />
        </div>

        <div className="flex items-center gap-1 bg-card border border-border rounded-md p-1 text-xs self-end sm:self-auto shadow-sm">
          <button
            onClick={() => setSortBy('newest')}
            className={`px-3 py-1.5 rounded transition font-medium ${
              sortBy === 'newest'
                ? 'bg-primary text-white font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => setSortBy('clicks')}
            className={`px-3 py-1.5 rounded transition font-medium ${
              sortBy === 'clicks'
                ? 'bg-primary text-white font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Most Clicks
          </button>
        </div>
      </div>

      {/* Links List */}
      {loading ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          Loading your links...
        </div>
      ) : filteredLinks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <Link2Off className="w-6 h-6" />
          </div>
          <h4 className="text-base font-display font-semibold text-foreground mb-1">
            {links.length === 0 ? 'No links forged yet' : 'No matching links'}
          </h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {links.length === 0
              ? 'Paste your first long URL in the form above to forge a fast short link.'
              : 'Try clearing your search query to see all your active links.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onCopy={onCopy}
              onOpenAnalytics={onOpenAnalytics}
              onOpenQr={onOpenQr}
              onOpenEdit={onOpenEdit}
              onToggleActive={onToggleActive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

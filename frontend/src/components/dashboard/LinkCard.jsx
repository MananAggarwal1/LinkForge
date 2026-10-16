import React, { useState } from 'react';
import {
  Copy,
  Check,
  QrCode,
  BarChart3,
  Edit2,
  Trash2,
  ExternalLink,
  Lock,
  Calendar,
  Globe,
  Pause,
  Play
} from 'lucide-react';
import { getEffectiveShortUrl } from '../../api/client';

export const LinkCard = ({
  link,
  onCopy,
  onOpenAnalytics,
  onOpenQr,
  onOpenEdit,
  onToggleActive,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const effectiveShortUrl = getEffectiveShortUrl(link);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(effectiveShortUrl);
    setCopied(true);
    if (onCopy) onCopy(effectiveShortUrl);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();

  return (
    <div
      className={`rounded-2xl border border-border bg-card p-5 shadow-card transition duration-150 hover:border-primary/40 ${
        !link.active ? 'opacity-60 bg-muted/40' : ''
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Link Info */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-semibold text-foreground text-base truncate max-w-md">
              {link.title || link.shortCode}
            </h3>

            {/* Badges */}
            {link.hasPassword && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Lock className="w-3 h-3" /> Password
              </span>
            )}

            {link.customAlias && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                Custom alias
              </span>
            )}

            {isExpired ? (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                Expired
              </span>
            ) : link.expiresAt ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
                <Calendar className="w-3 h-3" /> Auto-expires
              </span>
            ) : null}

            {!link.active && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Pause className="w-3 h-3" /> Paused
              </span>
            )}
          </div>

          {/* Short URL with copy */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-primary font-bold text-sm tracking-tight truncate">
              {effectiveShortUrl}
            </span>
            <button
              onClick={handleCopyClick}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              title="Copy Short Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <a
              href={effectiveShortUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              title="Open Short Link in New Tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Long URL */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate max-w-lg">
            <Globe className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate hover:text-foreground transition" title={link.originalUrl}>
              {link.originalUrl}
            </span>
          </div>
        </div>

        {/* Right side: Click counter & action buttons */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
          {/* Clicks Pill */}
          <button
            onClick={() => onOpenAnalytics(link)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted transition"
            title="Inspect click analytics"
          >
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-extrabold text-foreground">
              {link.clickCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">clicks</span>
          </button>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1 border border-border bg-card rounded-lg p-0.5">
            <button
              onClick={() => onOpenQr({ ...link, shortUrl: effectiveShortUrl })}
              className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition cursor-pointer"
              title="View & Download QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAnalytics(link)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition"
              title="View Analytics"
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenEdit(link)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
              title="Edit Link"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            {/* Pause / Resume Button before Delete */}
            <button
              onClick={() => onToggleActive && onToggleActive(link.id)}
              className={`p-1.5 rounded-md transition ${
                link.active
                  ? 'text-muted-foreground hover:text-amber-500 hover:bg-muted'
                  : 'text-amber-500 hover:text-emerald-500 hover:bg-muted'
              }`}
              title={link.active ? 'Pause Link (Deactivate)' : 'Resume Link (Activate)'}
            >
              {link.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {confirmDelete ? (
              <div className="flex items-center gap-1 pl-1">
                <button
                  onClick={() => onDelete(link.id)}
                  className="px-2 py-0.5 bg-destructive hover:brightness-110 text-white rounded text-[10px] font-bold"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-1 py-0.5 text-muted-foreground hover:text-foreground text-[10px]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-muted transition"
                title="Delete Link"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

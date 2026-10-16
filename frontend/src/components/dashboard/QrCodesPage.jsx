import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Loader2,
  Sliders,
  Share2
} from 'lucide-react';
import api, { getEffectiveShortUrl } from '../../api/client';

export const QrCodesPage = ({ links, onShowToast }) => {
  const [selectedLink, setSelectedLink] = useState(links?.[0] || null);
  const [qrSize, setQrSize] = useState(350);
  const [qrBlobUrl, setQrBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const effectiveShortUrl = getEffectiveShortUrl(selectedLink);

  // Update selectedLink if links change and none selected
  useEffect(() => {
    if (!selectedLink && links?.length > 0) {
      setSelectedLink(links[0]);
    }
  }, [links, selectedLink]);

  // Fetch QR Code whenever selected link or size changes
  useEffect(() => {
    if (!selectedLink) {
      setQrBlobUrl(null);
      return;
    }

    let active = true;
    const fetchQr = async () => {
      setLoading(true);
      try {
        // Authenticated QR fetch as blob
        const res = await api.get(`/api/links/${selectedLink.id}/qr?size=${qrSize}`, {
          responseType: 'blob',
        });
        if (active) {
          const url = URL.createObjectURL(res.data);
          setQrBlobUrl(url);
        }
      } catch (e) {
        // Fallback to public redirect QR endpoint
        if (active && selectedLink?.shortCode) {
          const apiBase = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/+$/, '') : '';
          setQrBlobUrl(`${apiBase}/r/${selectedLink.shortCode}/qr?size=${qrSize}`);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchQr();

    return () => {
      active = false;
      if (qrBlobUrl && qrBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(qrBlobUrl);
      }
    };
  }, [selectedLink, qrSize]);

  const handleDownload = () => {
    if (!qrBlobUrl || !selectedLink) return;
    const link = document.createElement('a');
    link.href = qrBlobUrl;
    link.download = `linkforge-qr-${selectedLink.shortCode || 'code'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onShowToast) onShowToast('QR Code downloaded successfully!', 'success');
  };

  const handleCopyLink = () => {
    if (!effectiveShortUrl) return;
    navigator.clipboard.writeText(effectiveShortUrl);
    setCopied(true);
    if (onShowToast) onShowToast('Short link copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
          Dynamic QR Code Studio
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Generate, customize, and export crisp vector-grade QR codes for packaging, flyers, and slides.
        </p>
      </div>

      {links.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center">
          <QrCode className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-60" />
          <h3 className="font-display font-semibold text-foreground text-base">No Links Forged Yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Forge your first short link from the Dashboard to immediately generate high-resolution QR codes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main QR Studio Preview Card */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col justify-between">
            <div>
              {/* Link Picker */}
              <div className="mb-6">
                <label className="text-xs font-semibold text-foreground block mb-2">
                  Select Target Link
                </label>
                <select
                  value={selectedLink?.id || ''}
                  onChange={(e) => {
                    const found = links.find((l) => l.id === e.target.value);
                    if (found) setSelectedLink(found);
                  }}
                  className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {links.map((link) => (
                    <option key={link.id} value={link.id}>
                      {link.title ? `${link.title} · ` : ''}/r/{link.shortCode} → {link.originalUrl}
                    </option>
                  ))}
                </select>
              </div>

              {/* QR Canvas Display */}
              <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-muted/40 border border-border relative min-h-[320px]">
                {loading ? (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="text-xs font-semibold">Generating QR Matrix...</span>
                  </div>
                ) : qrBlobUrl ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-white rounded-2xl shadow-md border border-border">
                      <img
                        src={qrBlobUrl}
                        alt="LinkForge QR Code"
                        className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
                      />
                    </div>
                    <div className="text-center">
                      <span className="font-mono text-xs font-bold text-foreground">
                        {effectiveShortUrl}
                      </span>
                      <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs truncate">
                        Destination: {selectedLink?.originalUrl}
                      </p>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Select a link to render QR code</span>
                )}
              </div>
            </div>

            {/* Bottom Studio Controls */}
            <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
              {/* Resolution options */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-muted-foreground">Dimension:</span>
                {[
                  { label: 'Standard (250px)', val: 250 },
                  { label: 'Medium (350px)', val: 350 },
                  { label: 'HD (500px)', val: 500 },
                ].map((s) => (
                  <button
                    key={s.val}
                    type="button"
                    onClick={() => setQrSize(s.val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      qrSize === s.val
                        ? 'bg-primary text-white shadow-sm'
                        : 'border border-border bg-card text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {s.val}px
                  </button>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!qrBlobUrl || loading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-primary text-white text-xs font-semibold shadow-glow hover:brightness-110 transition disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick QR Gallery of all user links */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card flex flex-col">
            <h2 className="font-display font-semibold text-sm text-foreground mb-3 flex items-center justify-between">
              <span>All Link QR Codes</span>
              <span className="text-xs text-muted-foreground">{links.length} total</span>
            </h2>

            <div className="space-y-2.5 overflow-y-auto max-h-[480px] pr-1">
              {links.map((link) => {
                const isSelected = selectedLink?.id === link.id;
                return (
                  <div
                    key={link.id}
                    onClick={() => setSelectedLink(link)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-primary/50 bg-primary/5 shadow-sm'
                        : 'border-border bg-background hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <span className="text-xs font-mono font-bold text-foreground block truncate">
                          /r/{link.shortCode}
                        </span>
                        <span className="text-[10px] text-muted-foreground block truncate">
                          {link.title || link.originalUrl}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold text-primary flex-shrink-0">
                      {isSelected ? 'Active' : 'Select'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

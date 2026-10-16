import React, { useState, useEffect } from 'react';
import { X, Download, Copy, Check, QrCode, Loader2 } from 'lucide-react';
import api, { getEffectiveShortUrl } from '../../api/client';

export const QrModal = ({ isOpen, link, onClose, onShowToast }) => {
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const effectiveShortUrl = getEffectiveShortUrl(link);

  useEffect(() => {
    if (!isOpen || !link) return;

    let objectUrl = null;
    setLoading(true);
    setError('');

    // Fetch binary PNG blob with Axios (passes JWT token)
    api
      .get(`/api/links/${link.id}/qr?size=500`, { responseType: 'blob' })
      .then((res) => {
        objectUrl = window.URL.createObjectURL(new Blob([res.data], { type: 'image/png' }));
        setQrUrl(objectUrl);
      })
      .catch(() => {
        // Fallback to public QR code endpoint
        const apiBase = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/+$/, '') : '';
        const fallback = `${apiBase}/r/${link.shortCode}/qr?size=500`;
        setQrUrl(fallback);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
    };
  }, [isOpen, link]);

  if (!isOpen || !link) return null;

  const handleDownload = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `linkforge-qr-${link.shortCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (onShowToast) onShowToast('QR code downloaded!', 'success');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(effectiveShortUrl);
    setCopied(true);
    if (onShowToast) onShowToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-2xl bg-card border border-border p-6 shadow-card text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-5 h-5" />
        </div>

        <h3 className="text-base font-display font-bold text-foreground mb-1">
          {link.title || link.shortCode}
        </h3>
        <p className="text-xs font-mono text-primary mb-5 truncate px-2">
          {effectiveShortUrl}
        </p>

        {/* QR Code Container */}
        <div className="p-4 bg-white rounded-xl shadow-sm mx-auto w-60 h-60 flex items-center justify-center mb-5 border border-border relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
              <span className="text-xs font-semibold">Generating QR...</span>
            </div>
          ) : error ? (
            <span className="text-xs text-destructive font-semibold">{error}</span>
          ) : (
            <img
              src={qrUrl}
              alt={`QR Code for ${effectiveShortUrl}`}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            disabled={loading || !qrUrl}
            className="flex-1 py-2.5 bg-primary hover:brightness-110 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-lg text-xs font-semibold flex items-center justify-center transition"
            title="Copy URL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

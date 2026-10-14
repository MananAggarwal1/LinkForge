import React, { useState } from 'react';
import {
  Link2,
  Sparkles,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Lock,
  LogIn,
  UserPlus,
  Loader2
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export const CreateLinkCard = ({ onLinkCreated, onOpenQr, onShowToast, onRequireAuth }) => {
  const { isAuthenticated, user } = useAuth();

  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [expirationOption, setExpirationOption] = useState(() => {
    return localStorage.getItem('linkforge_default_expiration') || 'never';
  }); // never, 1d, 7d, 30d
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdLink, setCreatedLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const calculateExpirationDate = (option) => {
    const now = new Date();
    if (option === '1d') {
      now.setDate(now.getDate() + 1);
      return now.toISOString();
    } else if (option === '7d') {
      now.setDate(now.getDate() + 7);
      return now.toISOString();
    } else if (option === '30d') {
      now.setDate(now.getDate() + 30);
      return now.toISOString();
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enforce mandatory signup/login before forging link
    if (!isAuthenticated) {
      if (onRequireAuth) onRequireAuth('login');
      if (onShowToast) onShowToast('Please sign in or create an account to forge links', 'info');
      return;
    }

    if (!originalUrl.trim()) return;

    setError('');
    setLoading(true);

    try {
      const payload = {
        originalUrl: originalUrl.trim(),
        customSlug: customSlug.trim() || null,
        title: title.trim() || null,
        expiresAt: calculateExpirationDate(expirationOption),
        password: password.trim() || null,
        tags: [],
      };

      const response = await api.post('/api/links', payload);
      const link = response.data;

      setCreatedLink(link);
      setOriginalUrl('');
      setCustomSlug('');
      setTitle('');
      setPassword('');
      setShowAdvanced(false);

      if (onLinkCreated) onLinkCreated(link);
      if (onShowToast) onShowToast('Short link forged successfully!', 'success');
    } catch (err) {
      if (err.response?.status === 401 && onRequireAuth) {
        onRequireAuth('login');
      } else {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.details?.customSlug ||
          err.response?.data?.details?.originalUrl ||
          'Failed to forge link';
        setError(msg);
        if (onShowToast) onShowToast(msg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    if (onShowToast) onShowToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-border bg-card p-4 text-left shadow-card sm:p-6 backdrop-blur">
        {/* If user is unauthenticated, show mandatory auth alert banner */}
        {!isAuthenticated && (
          <div className="mb-5 p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-foreground block">Sign in or register required</span>
                <span>You must have an account to shorten links, generate QR codes, and track analytics.</span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
              <button
                type="button"
                onClick={() => onRequireAuth && onRequireAuth('login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-border bg-card hover:bg-muted text-foreground transition"
              >
                <LogIn className="w-3 h-3 text-muted-foreground" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => onRequireAuth && onRequireAuth('register')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-primary text-white hover:brightness-110 transition shadow-sm"
              >
                <UserPlus className="w-3 h-3" />
                <span>Register</span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input */}
          <div>
            <label htmlFor="url" className="mb-1.5 block text-sm font-semibold text-foreground">
              Paste your long URL
            </label>
            <div className="relative">
              <Link2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="url"
                type="text"
                required
                placeholder="https://example.com/your/very/long/url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                onFocus={() => {
                  if (!isAuthenticated && onRequireAuth) {
                    onRequireAuth('login');
                  }
                }}
                className="flex w-full rounded-md border border-input bg-background px-3 py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-12 pl-10 text-base text-foreground"
              />
            </div>
          </div>

          {/* Alias & Expiration Grid */}
          <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
            {/* Custom Alias */}
            <div>
              <label htmlFor="alias" className="mb-1.5 block text-sm font-semibold text-foreground">
                Custom alias <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <div className="flex h-11 items-center overflow-hidden rounded-md border border-input bg-background focus-within:ring-1 focus-within:ring-ring">
                <span className="border-r border-border bg-muted px-3 py-3 font-mono text-xs text-muted-foreground select-none">
                  linkforge.app /
                </span>
                <input
                  id="alias"
                  placeholder="my-link"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  className="h-full flex-1 bg-transparent px-3 font-mono text-sm outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Expiration dropdown */}
            <div>
              <label htmlFor="expiration" className="mb-1.5 block text-sm font-semibold text-foreground">
                Expiration
              </label>
              <select
                id="expiration"
                value={expirationOption}
                onChange={(e) => setExpirationOption(e.target.value)}
                className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring h-11 text-foreground"
              >
                <option value="never">Never expire</option>
                <option value="1d">1 day</option>
                <option value="7d">7 days</option>
                <option value="30d">30 days</option>
              </select>
            </div>
          </div>

          {/* Advanced options trigger */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 transition"
            >
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{showAdvanced ? 'Hide title & password protection' : 'Add label or password protection'}</span>
            </button>
          </div>

          {/* Collapsible fields */}
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border animate-fade-in">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">
                  Reference Label / Title
                </label>
                <input
                  type="text"
                  placeholder="My Portfolio Link"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring h-10 text-foreground"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3 text-muted-foreground" /> Passcode Protection (Optional)
                </label>
                <input
                  type="password"
                  placeholder="Required to access link"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring h-10 text-foreground"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-xs">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-gradient-primary text-white font-semibold shadow-glow hover:brightness-110 rounded-md px-8 h-12 w-full text-base transition duration-200 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : !isAuthenticated ? (
              <>
                <Lock className="h-4 w-4" />
                <span>Sign In to Forge Link</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Forge Link</span>
              </>
            )}
          </button>
        </form>

        {/* Success / Result card */}
        {createdLink && (
          <div className="mt-5 p-4 rounded-xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3 overflow-hidden w-full sm:w-auto">
              <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div className="overflow-hidden min-w-0">
                <span className="text-[11px] text-muted-foreground font-semibold block uppercase tracking-wider">
                  Forged Link Ready
                </span>
                <a
                  href={createdLink.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm sm:text-base font-bold text-foreground hover:text-primary transition font-mono truncate block"
                >
                  {createdLink.shortUrl}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => handleCopy(createdLink.shortUrl)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:brightness-110 transition shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={() => onOpenQr(createdLink)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted text-xs font-semibold transition"
              >
                <QrCode className="w-3.5 h-3.5 text-primary" />
                <span>QR Code</span>
              </button>
              <a
                href={createdLink.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition"
                title="Test Redirect"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

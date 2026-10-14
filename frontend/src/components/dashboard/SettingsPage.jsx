import React, { useState } from 'react';
import { User, Zap, ShieldCheck, ChevronDown, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

export const SettingsPage = ({ linksCount = 0, onShowToast }) => {
  const { user, logout } = useAuth();

  const [defaultExpiration, setDefaultExpiration] = useState(() => {
    return localStorage.getItem('linkforge_default_expiration') || 'never';
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleExpirationChange = (val) => {
    setDefaultExpiration(val);
    localStorage.setItem('linkforge_default_expiration', val);
    if (onShowToast) {
      onShowToast('Link expiration preference saved', 'success');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete('/api/auth/me');
      if (onShowToast) {
        onShowToast('Account and all associated links successfully deleted.', 'info');
      }
      setShowDeleteModal(false);
      logout();
    } catch (err) {
      console.error('Failed to delete account:', err);
      if (onShowToast) {
        onShowToast(
          err.response?.data?.message || 'Failed to delete account. Please try again.',
          'error'
        );
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
          Account Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your personal profile and account credentials.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary font-display font-extrabold text-lg flex items-center justify-center">
            {(user?.fullName || user?.username || 'U')[0].toUpperCase()}
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-foreground">
              {user?.fullName || user?.username}
            </h2>
            <span className="text-xs text-muted-foreground">
              {user?.email || `@${user?.username}`}
            </span>
          </div>
          <span className="ml-auto text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active Account</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-muted-foreground block mb-1">Username</label>
            <div className="p-2.5 rounded-lg border border-input bg-background font-mono text-foreground">
              {user?.username || '—'}
            </div>
          </div>

          <div>
            <label className="font-semibold text-muted-foreground block mb-1">Email Address</label>
            <div className="p-2.5 rounded-lg border border-input bg-background text-foreground">
              {user?.email || '—'}
            </div>
          </div>

          <div>
            <label className="font-semibold text-muted-foreground block mb-1">User ID</label>
            <div className="p-2.5 rounded-lg border border-input bg-background font-mono text-foreground truncate">
              {user?.id || '—'}
            </div>
          </div>

          <div>
            <label className="font-semibold text-muted-foreground block mb-1">Plan Tier</label>
            <div className="p-2.5 rounded-lg border border-input bg-background text-foreground font-semibold flex items-center gap-1.5 text-primary">
              <Zap className="w-3.5 h-3.5" />
              <span>Unlimited Pro Tier (Free Forever)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Link Preferences Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
        <div>
          <h2 className="font-display font-bold text-base text-foreground">
            Link Preferences
          </h2>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground font-medium block">
            Default Expiration
          </label>
          <div className="relative w-full max-w-xs sm:w-72">
            <select
              value={defaultExpiration}
              onChange={(e) => handleExpirationChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-input bg-background/50 px-3.5 py-2.5 pr-10 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
            >
              <option value="never">Never expires</option>
              <option value="1d">1 day</option>
              <option value="7d">7 days</option>
              <option value="30d">30 days</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/60 dark:border-rose-900/40 dark:bg-rose-950/20 p-6 space-y-4">
        <div>
          <h2 className="font-display font-bold text-base text-rose-600 dark:text-rose-400">
            Danger Zone
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Deleting your account removes all {linksCount > 0 ? `${linksCount} ` : ''}links and historical telemetry permanently.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-scale-up space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-foreground">
                  Delete Account Permanently?
                </h3>
                <p className="text-xs text-muted-foreground">
                  This action is irreversible and cannot be undone.
                </p>
              </div>
            </div>

            <div className="text-sm text-muted-foreground bg-muted/40 p-3.5 rounded-xl border border-border/50 space-y-1">
              <p>
                Are you sure you want to permanently delete your account?
              </p>
              <p className="text-xs text-foreground/80 font-medium">
                All {linksCount > 0 ? `${linksCount} ` : 'your '}links, custom slugs, and analytics telemetry will be permanently wiped.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-muted text-sm font-medium text-foreground transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

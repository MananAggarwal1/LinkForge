import React, { useState } from 'react';
import { X, Save, Lock, Trash2, Calendar, Tag, Link2, Loader2 } from 'lucide-react';
import api from '../../api/client';

export const EditLinkModal = ({ isOpen, link, onClose, onLinkUpdated, onShowToast }) => {
  if (!isOpen || !link) return null;

  const [originalUrl, setOriginalUrl] = useState(link.originalUrl);
  const [title, setTitle] = useState(link.title || '');
  const [tagsInput, setTagsInput] = useState(link.tags ? link.tags.join(', ') : '');
  const [expiresAt, setExpiresAt] = useState(
    link.expiresAt ? link.expiresAt.slice(0, 16) : ''
  );
  const [newPassword, setNewPassword] = useState('');
  const [removePassword, setRemovePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        originalUrl: originalUrl.trim(),
        title: title.trim(),
        tags,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        password: newPassword.trim() || null,
        removePassword,
      };

      const response = await api.put(`/api/links/${link.id}`, payload);
      if (onLinkUpdated) onLinkUpdated(response.data);
      if (onShowToast) onShowToast('Link updated successfully!', 'success');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update link';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl text-foreground">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold font-display text-foreground mb-1">Edit Link Details</h3>
        <p className="text-xs text-primary font-mono mb-6">
          Slug: /r/{link.shortCode}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Destination URL
            </label>
            <input
              type="text"
              required
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Title / Label
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Expiration Date (leave empty to never expire)
            </label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="pt-2 border-t border-border">
            <label className="block text-xs font-semibold text-foreground mb-1">
              {link.hasPassword ? 'Change or Remove Password' : 'Add Password Protection'}
            </label>

            {link.hasPassword && (
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="removePwd"
                  checked={removePassword}
                  onChange={(e) => setRemovePassword(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-ring"
                />
                <label htmlFor="removePwd" className="text-xs text-destructive">
                  Remove existing password requirement
                </label>
              </div>
            )}

            {!removePassword && (
              <input
                type="password"
                placeholder={link.hasPassword ? 'Enter new password to overwrite' : 'Set password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-primary disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-glow hover:brightness-110"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { CreateLinkCard } from './CreateLinkCard';

export const QuickCreateModal = ({
  isOpen,
  onClose,
  onLinkCreated,
  onOpenQr,
  onShowToast
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-foreground">
                Forge a Short Link
              </h3>
              <p className="text-xs text-muted-foreground">
                Shorten your URL with optional custom slug & protection.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:bg-muted transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <CreateLinkCard
          onLinkCreated={(link) => {
            if (onLinkCreated) onLinkCreated(link);
            onClose();
          }}
          onOpenQr={onOpenQr}
          onShowToast={onShowToast}
        />
      </div>
    </div>
  );
};

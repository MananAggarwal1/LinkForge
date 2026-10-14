import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const typeConfig = {
    success: {
      border: 'border-emerald-500/30',
      iconColor: 'text-emerald-500',
      badgeBg: 'bg-emerald-500/10',
      Icon: CheckCircle2,
    },
    error: {
      border: 'border-destructive/30',
      iconColor: 'text-destructive',
      badgeBg: 'bg-destructive/10',
      Icon: AlertCircle,
    },
    info: {
      border: 'border-primary/30',
      iconColor: 'text-primary',
      badgeBg: 'bg-primary/10',
      Icon: Info,
    },
  }[type] || {
    border: 'border-border',
    iconColor: 'text-primary',
    badgeBg: 'bg-muted',
    Icon: Info,
  };

  const IconComponent = typeConfig.Icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-card text-foreground shadow-2xl backdrop-blur-md ${typeConfig.border}`}
      >
        <div className={`p-1 rounded-lg ${typeConfig.badgeBg} ${typeConfig.iconColor}`}>
          <IconComponent className="w-4 h-4 flex-shrink-0" />
        </div>
        <span className="text-xs font-semibold pr-2">{message}</span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

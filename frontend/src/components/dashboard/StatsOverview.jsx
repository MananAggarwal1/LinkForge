import React from 'react';
import { Link2, MousePointerClick, CheckCircle, TrendingUp } from 'lucide-react';

export const StatsOverview = ({ overview }) => {
  const totalLinks = overview?.totalLinks || 0;
  const totalClicks = overview?.totalClicks || 0;
  const activeLinks = overview?.activeLinks || 0;
  const avgClicks = totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : '0';

  const cards = [
    {
      title: 'Total Links',
      value: totalLinks,
      icon: Link2,
      color: 'bg-primary/10 text-primary border-primary/20',
      tag: 'Created',
    },
    {
      title: 'Total Clicks',
      value: totalClicks,
      icon: MousePointerClick,
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      tag: 'Telemetry',
    },
    {
      title: 'Active Links',
      value: activeLinks,
      icon: CheckCircle,
      color: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
      tag: 'Live',
    },
    {
      title: 'Avg Clicks / Link',
      value: avgClicks,
      icon: TrendingUp,
      color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      tag: 'Engagement',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-5 shadow-card transition duration-200 hover:border-primary/40 hover:-translate-y-0.5 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground">{c.title}</span>
              <div className={`w-8 h-8 rounded-lg ${c.color} border flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-foreground tracking-tight">
                {typeof c.value === 'number' ? c.value.toLocaleString() : c.value}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                {c.tag}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

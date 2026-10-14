import React from 'react';
import { Tag, Clock, BarChart3, QrCode, Zap, ShieldCheck } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: Tag,
      title: 'Custom aliases',
      desc: 'Readable links like linkforge.app/launch.',
    },
    {
      icon: Clock,
      title: 'Link expiration',
      desc: 'Auto-expire after a day, a week, or never.',
    },
    {
      icon: BarChart3,
      title: 'Click analytics',
      desc: 'Countries, devices, browsers and referrers.',
    },
    {
      icon: QrCode,
      title: 'QR codes',
      desc: 'Every link gets a downloadable QR code.',
    },
    {
      icon: Zap,
      title: 'Redis-fast redirects',
      desc: 'Cached lookups served in milliseconds.',
    },
    {
      icon: ShieldCheck,
      title: 'Safe by default',
      desc: 'URL validation and per-user rate limits.',
    },
  ];

  return (
    <section id="features" className="relative mx-auto max-w-6xl px-5 pb-24 pt-12">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3 shadow-card">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-card p-6 transition duration-150 hover:bg-card/80">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-display font-semibold text-foreground text-base">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

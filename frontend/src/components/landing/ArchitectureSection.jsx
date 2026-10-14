import React from 'react';
import { Cpu, Database, Zap, ShieldCheck, Layers, Server } from 'lucide-react';

export const ArchitectureSection = () => {
  const highlights = [
    {
      title: 'Redis Cache-Aside',
      desc: 'Sub-5ms redirection latency with 24-hour TTL and automated cache invalidation upon link mutation.',
      icon: Zap,
      badge: '<5ms Read Latency',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Spring Boot 3 & Java 21',
      desc: 'High-throughput enterprise REST controllers with Jakarta Validation and clean exception handling.',
      icon: Server,
      badge: 'Reactive & Robust',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'MongoDB Compound Indexing',
      desc: 'Indexed on { userId: 1, createdAt: -1 } for instantaneous O(log N) dashboard retrieval.',
      icon: Database,
      badge: 'O(log N) Performance',
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Async Telemetry Pool',
      desc: 'Click metrics and User-Agent parsing execute non-blocking in dedicated background thread pools.',
      icon: Cpu,
      badge: 'Zero Redirect Delay',
      color: 'text-violet-500 bg-violet-500/10 border-violet-500/20'
    },
    {
      title: 'Base62 Token Generator',
      desc: 'URL-safe alphanumeric encoding supporting 56+ billion combinations at 6 characters.',
      icon: Layers,
      badge: '56B+ Unique Slugs',
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      title: 'Multi-Tenant Data Shield',
      desc: 'Stateless HMAC-SHA256 JWT security preventing unauthorized access across accounts.',
      icon: ShieldCheck,
      badge: '100% Isolated',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    }
  ];

  return (
    <section id="architecture" className="relative mx-auto max-w-5xl px-5 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Cpu className="w-3.5 h-3.5" />
          <span>System Design Architecture</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Engineered for Extreme Speed & Scale
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          Built with production-grade backend principles to handle millions of redirects without sweat.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {highlights.map((h, i) => {
          const Icon = h.icon;
          return (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-5 shadow-card hover:border-primary/40 transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${h.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-muted text-foreground">
                    {h.badge}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-base text-foreground mb-1.5">
                  {h.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {h.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

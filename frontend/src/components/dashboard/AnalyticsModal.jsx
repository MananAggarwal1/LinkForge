import React, { useEffect, useState } from 'react';
import {
  X,
  BarChart3,
  Users,
  Globe,
  Smartphone,
  Compass,
  Laptop,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import api from '../../api/client';

export const AnalyticsModal = ({ isOpen, link, onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !link) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/api/links/${link.id}/analytics`);
        setAnalytics(response.data);
      } catch (err) {
        setError('Failed to load analytics telemetry.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [isOpen, link]);

  if (!isOpen || !link) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl text-foreground">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" /> Real-Time Link Telemetry
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-display">
            {link.title || link.shortCode}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-sm text-primary font-semibold">
              {link.shortUrl}
            </span>
            <span className="text-muted-foreground/60">•</span>
            <span className="text-xs text-muted-foreground truncate max-w-md">
              {link.originalUrl}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-xs font-semibold">Loading real-time telemetry...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm text-center">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl p-4 border border-border bg-card shadow-card">
                <span className="text-xs text-muted-foreground font-semibold block mb-1">
                  Total Clicks
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">
                  {analytics.totalClicks.toLocaleString()}
                </span>
              </div>
              <div className="rounded-2xl p-4 border border-border bg-card shadow-card">
                <span className="text-xs text-muted-foreground font-semibold block mb-1">
                  Unique Visitors
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-display">
                  {analytics.uniqueVisitors.toLocaleString()}
                </span>
              </div>
              <div className="rounded-2xl p-4 border border-border bg-card shadow-card col-span-2 sm:col-span-1">
                <span className="text-xs text-muted-foreground font-semibold block mb-1">
                  Cache Performance
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-primary font-display">
                  &lt; 5ms
                </span>
                <span className="text-[10px] text-muted-foreground uppercase block font-bold">
                  Redis In-Memory Hit
                </span>
              </div>
            </div>

            {/* Click Activity Chart (14 days) */}
            <div className="rounded-2xl p-5 border border-border bg-card shadow-card">
              <h4 className="text-sm font-bold font-display text-foreground mb-4">
                Click Trajectory (Last 14 Days)
              </h4>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.clicksByDate}>
                    <defs>
                      <linearGradient id="modalClickColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => val.slice(5)}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: 'hsl(var(--foreground))',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#modalClickColor)"
                      name="Clicks"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Breakdown Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Device Breakdown */}
              <div className="rounded-2xl p-4 border border-border bg-card shadow-card">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground uppercase tracking-wider mb-3">
                  <Smartphone className="w-3.5 h-3.5 text-primary" /> Device Type
                </div>
                {analytics.deviceBreakdown.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-3">No device telemetry yet</p>
                ) : (
                  <div className="space-y-2.5">
                    {analytics.deviceBreakdown.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-foreground font-medium">{item.name}</span>
                          <span className="text-muted-foreground font-mono">
                            {item.count} ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-gradient-primary rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Browser Breakdown */}
              <div className="rounded-2xl p-4 border border-border bg-card shadow-card">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground uppercase tracking-wider mb-3">
                  <Compass className="w-3.5 h-3.5 text-emerald-500" /> Top Browsers
                </div>
                {analytics.browserBreakdown.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-3">No browser telemetry yet</p>
                ) : (
                  <div className="space-y-2.5">
                    {analytics.browserBreakdown.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-foreground font-medium">{item.name}</span>
                          <span className="text-muted-foreground font-mono">
                            {item.count} ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Referrer Breakdown */}
              <div className="rounded-2xl p-4 border border-border bg-card shadow-card">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground uppercase tracking-wider mb-3">
                  <ArrowUpRight className="w-3.5 h-3.5 text-violet-500" /> Referrers
                </div>
                {analytics.referrerBreakdown.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-3">No referrer data yet</p>
                ) : (
                  <div className="space-y-2.5">
                    {analytics.referrerBreakdown.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-foreground font-medium">{item.name}</span>
                          <span className="text-muted-foreground font-mono">
                            {item.count} ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-violet-500 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

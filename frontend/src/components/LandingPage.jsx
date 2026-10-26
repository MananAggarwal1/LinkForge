import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  QrCode,
  Lock,
  Globe2,
  CheckCircle2,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { FeaturesSection } from './FeaturesSection';
import { FaqSection } from './landing/FaqSection';

export const LandingPage = ({ onOpenAuth }) => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-4xl px-5 pb-16 pt-10 text-center sm:pt-16">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-medium text-muted-foreground shadow-card mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span>Next-Generation URL Shortener & Analytics</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl text-foreground tracking-tight">
          Forge shorter links.
          <br />
          <span className="gradient-text">
            Share smarter.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Turn long, complex URLs into high-converting short links with real-time click telemetry,
          custom aliases, passcode protection, and dynamic QR codes — completely free.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onOpenAuth('register')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-6 py-3.5 text-sm font-semibold text-white shadow-glow hover:brightness-110 transition duration-200 w-full sm:w-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenAuth('login')}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition duration-200 shadow-card w-full sm:w-auto"
          >
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span>Sign In to Dashboard</span>
          </button>
        </div>

        {/* Interactive Showcase Preview Mockup (Display-only preview) */}
        <div className="mt-14 mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border bg-card/80 p-5 sm:p-7 shadow-card text-left backdrop-blur relative overflow-hidden">
            {/* Top Bar Decoration */}
            <div className="flex items-center justify-between pb-4 border-b border-border/70 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="text-xs font-mono text-muted-foreground ml-2">linkforge.app / preview</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                <Shield className="w-3 h-3" />
                <span>Protected Workspace</span>
              </div>
            </div>

            {/* Simulated Link Forger (Visual preview only) */}
            <div className="space-y-4 opacity-95">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                  Target Destination URL
                </label>
                <div className="h-11 rounded-lg border border-input bg-background/70 px-3.5 flex items-center text-sm font-mono text-muted-foreground select-none">
                  <span className="truncate">https://linkforge.dev/product/launch-2026?ref=app</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                    Custom Slug
                  </label>
                  <div className="h-10 rounded-lg border border-input bg-background/70 px-3 flex items-center text-xs font-mono text-primary font-bold select-none">
                    <span>linkforge.app / launch-2026</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                    Cache Strategy & Protection
                  </label>
                  <div className="h-10 rounded-lg border border-input bg-background/70 px-3 flex items-center justify-between text-xs text-muted-foreground select-none">
                    <span>Redis Cache-Aside (&lt;5ms)</span>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
                  </div>
                </div>
              </div>

              {/* Callout to sign up */}
              <div className="mt-5 p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block text-sm">Account Required to Forge Links</span>
                    <span>Sign up or log in to create short links, download QR codes, and monitor analytics.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="whitespace-nowrap px-4 py-2 text-xs font-bold rounded-lg bg-primary text-white hover:brightness-110 transition shadow-sm w-full sm:w-auto text-center"
                >
                  Create Free Account
                </button>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted">
                <Zap className="w-3 h-3 text-amber-500" /> &lt;5ms Redirection
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted">
                <BarChart3 className="w-3 h-3 text-primary" /> Real-Time Analytics
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted">
                <QrCode className="w-3 h-3 text-emerald-500" /> Dynamic QR Codes
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted">
                <Shield className="w-3 h-3 text-violet-500" /> Multi-Tenant Isolation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Card Features Section */}
      <FeaturesSection />

      {/* Interactive FAQ Section */}
      <FaqSection />

      {/* Bottom CTA Banner */}
      <section className="relative mx-auto max-w-5xl px-5 py-16">
        <div className="rounded-3xl border border-border bg-gradient-to-b from-card to-card/50 p-8 sm:p-12 text-center shadow-card relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-30" />
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Ready to forge smarter links?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm sm:text-base text-muted-foreground">
            Sign up in seconds and gain full access to your personalized dashboard, link analytics, and QR code tools.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuth('register')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-6 py-3.5 text-sm font-semibold text-white shadow-glow hover:brightness-110 transition duration-200 w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-muted transition duration-200 shadow-card w-full sm:w-auto"
            >
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </section>

      {/* Multi-Column Modern Footer */}
      <footer className="border-t border-border bg-card/40 py-12 px-5 text-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-display text-base font-bold text-foreground mb-3">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-primary text-white">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 15 15 9"></path>
                  <path d="M11 6.5 12.5 5a4 4 0 0 1 5.7 5.7L16.6 12.3"></path>
                  <path d="M13 17.5 11.5 19a4 4 0 0 1-5.7-5.7L7.4 11.7"></path>
                </svg>
              </span>
              <span>Link<span className="text-primary">Forge</span></span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enterprise-grade URL shortener with sub-5ms Redis caching, multi-tenant isolation, and dynamic QR code generation.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-foreground mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition">Features</a></li>
              <li><a href="#faq" className="hover:text-foreground transition">FAQ</a></li>
              <li><button onClick={() => onOpenAuth('register')} className="hover:text-foreground transition">Create Account</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-foreground mb-3">
              Tech Stack
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><span>React 18 & Vite</span></li>
              <li><span>Spring Boot 3 & Java 21</span></li>
              <li><span>Redis (Cache-Aside)</span></li>
              <li><span>MongoDB Database</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-foreground mb-3">
              Security & Speed
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><span>HMAC-SHA256 JWT</span></li>
              <li><span>BCrypt Password Hashing</span></li>
              <li><span>Base62 URL Encoding</span></li>
              <li><span>Async Telemetry Processing</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 LinkForge. High-Performance URL Shortener & Analytics Platform.</p>
          <div className="flex items-center gap-4">
            <a href="#features" className="hover:text-foreground transition">Privacy</a>
            <a href="#features" className="hover:text-foreground transition">Terms</a>
            <a href="#faq" className="hover:text-foreground transition">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

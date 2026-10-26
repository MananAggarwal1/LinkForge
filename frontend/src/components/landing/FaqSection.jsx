import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How does LinkForge achieve sub-5ms redirection speed?',
      a: 'LinkForge utilizes high-speed in-memory caching. Popular links are cached in RAM with a 24-hour TTL, allowing our high-throughput redirect controller to return HTTP 302 redirects in under 5 milliseconds without database bottlenecks.'
    },
    {
      q: 'Are custom slugs and aliases completely free?',
      a: 'Yes! You can choose any custom slug (e.g. linkforge.app/my-launch) at no cost. If a slug is already taken, our system alerts you immediately.'
    },
    {
      q: 'How does passcode protection safeguard links?',
      a: 'When you enable password protection, visitors attempting to visit the link are presented with a clean verification prompt. The destination URL is only resolved once the correct passcode is verified.'
    },
    {
      q: 'What visitor telemetry and analytics are tracked?',
      a: 'We capture total clicks, unique visitors, device categories (Desktop, Mobile, Tablet), browser families, operating systems, referrer channels, and a 14-day chronological click trajectory.'
    },
    {
      q: 'Can I generate and download dynamic QR codes?',
      a: 'Yes! Every link automatically comes with a ZXing-powered QR code that you can preview in multiple resolutions and download directly as a high-resolution PNG for flyers, slides, and packaging.'
    },
    {
      q: 'Is my data isolated and private from other accounts?',
      a: 'Yes. LinkForge implements strict multi-tenant security backed by Spring Security and JWT tokens. All link queries are scoped to your user ID, preventing other users from reading, altering, or inspecting your analytics.'
    }
  ];

  return (
    <section id="faq" className="relative mx-auto max-w-4xl px-5 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Got Questions?</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Everything you need to know about LinkForge, architecture, and security.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card shadow-card overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-display font-semibold text-sm sm:text-base text-foreground hover:text-primary transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed animate-fade-in border-t border-border/50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

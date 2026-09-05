import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is LinkGuard?',
      a: 'LinkGuard is a dedicated affiliate link monitoring SaaS built for bloggers, publishers, and affiliate marketers. It automatically crawls your website sitemap, indexes every outbound affiliate link (Amazon, ClickBank, ShareASale, Impact, etc.), and runs daily background health checks to alert you the instant a link breaks, redirects wrongly, or goes out of stock.'
    },
    {
      q: 'How does LinkGuard find affiliate links?',
      a: 'When you connect your domain, LinkGuard reads your public sitemap.xml to discover published articles. It then parses the HTML of each post to extract outbound links, matching them against affiliate network signatures (such as amazon.com/dp, amzn.to, hop.clickbank.net, shareasale.com/r.cfm, custom tracking redirects, and affiliate parameters).'
    },
    {
      q: 'How often are links checked?',
      a: 'LinkGuard runs autonomous health checks every single day at approximately 2:00 AM UTC. On the Pro and Business plans, you can also trigger on-demand scans whenever you publish or update articles, or schedule twice-daily checks.'
    },
    {
      q: 'Can LinkGuard detect out-of-stock products?',
      a: 'Yes! Generic link checkers only check if a page returns HTTP 200. LinkGuard goes deeper by analyzing the product availability elements on merchant landing pages. If an Amazon product returns 200 OK but displays "Currently unavailable" or "Out of stock", LinkGuard flags it as a Warning so you can replace the recommendation.'
    },
    {
      q: 'Does it work with Amazon affiliate links?',
      a: 'Absolutely. LinkGuard is optimized for Amazon Associates links, including amzn.to shortlinks, full product URLs, ASIN revisions, international Amazon locales (amazon.com, amazon.co.uk, amazon.in, amazon.de, etc.), and custom associate tracking tags.'
    },
    {
      q: 'How do Telegram alerts work?',
      a: 'You simply start our official Telegram bot (@LinkGuardAlertsBot) and connect your account in one click. Whenever our crawler detects a broken link, redirect failure, or out-of-stock warning, it delivers an instant message to your phone with the exact article title, broken URL, and a direct button to fix the link.'
    },
    {
      q: 'What happens if a website has thousands of articles?',
      a: 'LinkGuard is built on a scalable background job queue. It breaks large sitemaps into batched worker jobs with smart rate limiting to ensure zero load or throttling on your host server.'
    },
    {
      q: 'Can I monitor multiple websites?',
      a: 'Yes! The Pro plan includes up to 5 websites, while the Business plan includes up to 25 websites. You can seamlessly toggle between domains from your dashboard sidebar.'
    }
  ];

  return (
    <section id="faq" className="py-20 md:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Frequently Asked Questions
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything you need to know about LinkGuard
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Have questions about how our affiliate crawler protects your revenue? Here are the answers.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-200/90 rounded-2xl overflow-hidden transition-all duration-200 bg-slate-50/50 hover:bg-slate-50"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

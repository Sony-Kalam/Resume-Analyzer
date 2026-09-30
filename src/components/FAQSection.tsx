import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does this website connect to the n8n Cloud form URL?',
      a: 'The portal integrates with https://sony-kalam.app.n8n.cloud/form/04ee9b4a-38a3-4345-8668-b67e089790e6 in two complementary ways: via an interactive responsive iframe embed with browser chrome, and through a dedicated native intake form that proxies structured payloads directly to your n8n cloud webhook.',
    },
    {
      q: 'Why choose n8n over closed platforms like Zapier or Make?',
      a: 'n8n offers unlimited branching logic, native support for complex JavaScript/Python transformations, self-hosting or managed cloud freedom, transparent data privacy without per-step extortion fees, and seamless AI agent integrations.',
    },
    {
      q: 'What should I do if the n8n form shows "404 Not Found"?',
      a: 'In n8n Cloud, newly created form triggers default to inactive until the workflow toggle is switched to "Active" (top right in the n8n editor), or until "Test step" is actively listening. Once active, submissions route into the workflow pipeline instantaneously.',
    },
    {
      q: 'Can I customize the n8n endpoint URL or test staging webhooks?',
      a: 'Yes! Click the Settings gear icon in the top navigation bar to update the target n8n URL, test webhook payloads, or inspect execution latency.',
    },
    {
      q: 'What is the typical delivery timeline for custom n8n automations?',
      a: 'Targeted single-pipeline builds (e.g., Form to Google Sheets + Slack + automated email reply) are typically engineered and verified in 48 to 72 hours. Complex multi-branch enterprise integrations usually span 1 to 2 weeks.',
    },
  ];

  return (
    <section id="faq" className="py-20 border-b border-neutral-850 bg-neutral-950/40">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono text-amber-400 font-semibold mb-2">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white [text-wrap:balance]">
            Everything you need to know about our n8n automation ecosystem.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-white hover:text-amber-400 transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-neutral-300 leading-relaxed border-t border-neutral-850/60">
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

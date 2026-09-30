import { TrendingUp, Clock, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface CaseStudiesProps {
  onSelectService?: (service: string) => void;
}

export function CaseStudies({ onSelectService }: CaseStudiesProps) {
  const cases = [
    {
      client: 'Vanguard Global Logistics',
      category: 'Autonomous Dispatch & Invoice Reconciliation',
      headline: 'Eliminated 18 weekly hours of cross-platform manual data entry',
      metrics: [
        { label: 'Latency Reduction', value: '-82%' },
        { label: 'Monthly Handled Events', value: '38,000+' },
        { label: 'Reconciliation Errors', value: '0.00%' }
      ],
      description:
        'Architected a resilient n8n pipeline orchestrating freight order webhooks, verifying customs documents via vision LLMs, and synchronizing with QuickBooks and Slack in sub-second intervals.',
      service: 'Workflow Automation'
    },
    {
      client: 'Aura Health Technologies',
      category: 'HIPAA-Compliant Patient Intake & CRM Routing',
      headline: 'Accelerated patient intake qualification from 4.2 hours to 90 seconds',
      metrics: [
        { label: 'Response Time', value: '< 90s' },
        { label: 'Conversion Lift', value: '+34%' },
        { label: 'Data Encryption', value: 'AES-256' }
      ],
      description:
        'Engineered an encrypted intake portal routing patient consult requests into n8n Cloud, qualifying insurance coverage automatically, and provisioning provider calendars.',
      service: 'CRM & Lead Pipeline'
    },
    {
      client: 'Kinetix Ventures',
      category: 'Autonomous Pitch Deck Intelligence & Founder Onboarding',
      headline: 'Screened 450+ quarterly investment applications with deterministic scoring',
      metrics: [
        { label: 'Review Speed', value: '4.8x' },
        { label: 'Founder NPS', value: '96/100' },
        { label: 'Pipeline Automation', value: '100%' }
      ],
      description:
        'Deployed custom webhooks connected to an n8n parsing engine that ingests deck PDFs, checks financial benchmarks against market comps, and drafts partner memos automatically.',
      service: 'AI Agent Integration'
    }
  ];

  return (
    <section id="case-studies" className="py-20 border-t border-neutral-800/80 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
            Verifiable Impact
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Production Case Studies
          </h2>
          <p className="mt-3 text-neutral-400 text-base leading-relaxed">
            Quantified outcomes from live workflow deployments built for scaling businesses.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map(item => (
            <div
              key={item.client}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors group"
            >
              <div>
                <div className="text-xs font-mono text-neutral-400">{item.category}</div>
                <div className="text-sm font-semibold text-white mt-1">{item.client}</div>

                <h3 className="mt-4 text-lg font-bold text-neutral-100 group-hover:text-amber-300 transition-colors leading-snug">
                  {item.headline}
                </h3>

                <p className="mt-3 text-xs text-neutral-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Proof Metrics Strip */}
                <div className="mt-6 grid grid-cols-3 gap-2 py-3 border-y border-neutral-800/80 text-center font-mono">
                  {item.metrics.map(m => (
                    <div key={m.label}>
                      <div className="text-base font-extrabold text-amber-400 tabular-nums">
                        {m.value}
                      </div>
                      <div className="text-[10px] text-neutral-400 leading-tight mt-0.5">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-mono">Verified Deployment</span>
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectService) {
                      onSelectService(item.service);
                    } else {
                      document.getElementById('portal')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>Build Similar</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

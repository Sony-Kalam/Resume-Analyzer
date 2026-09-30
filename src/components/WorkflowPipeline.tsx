import { CheckCircle2, Clock, GitFork, Send, ShieldCheck, Terminal } from 'lucide-react';

interface WorkflowPipelineProps {
  n8nUrl: string;
}

export function WorkflowPipeline({ n8nUrl }: WorkflowPipelineProps) {
  const steps = [
    {
      number: '01',
      title: 'Inbound Form Trigger',
      desc: 'Form submission arrives at your custom n8n endpoint. Headers and JSON payload are captured with cryptographic timestamping.',
      tag: 'Webhook Trigger',
      timing: '~15ms',
    },
    {
      number: '02',
      title: 'Validation & Enrichment',
      desc: 'Schema validator confirms required fields, verifies email deliverables, and enriches data via external API lookups.',
      tag: 'Code & IF Nodes',
      timing: '~45ms',
    },
    {
      number: '03',
      title: 'Atomic Database Sync',
      desc: 'Clean records are committed to CRM and PostgreSQL databases with transaction locks to prevent duplicate submissions.',
      tag: 'DB / CRM Node',
      timing: '~120ms',
    },
    {
      number: '04',
      title: 'Dispatch & Notification',
      desc: 'Instant auto-responder delivers customized next steps to the client while notifying Sony Kalam’s engineering team on Slack.',
      tag: 'Slack / Email Node',
      timing: '~80ms',
    },
  ];

  return (
    <section id="pipeline" className="py-20 border-t border-neutral-800/80 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
              System Mechanism
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Execution Architecture
            </h2>
            <p className="mt-3 text-neutral-400 text-base leading-relaxed">
              Every submission to Sony Kalam’s n8n workflow executes a deterministic four-phase pipeline in sub-second time.
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-400 p-3 rounded-lg border border-neutral-800 bg-neutral-900/80 shrink-0">
            <div className="flex items-center gap-2 text-neutral-300">
              <Terminal className="h-3.5 w-3.5 text-amber-400" />
              <span>Target: /form/04ee9b4a-38a3-4345...</span>
            </div>
          </div>
        </div>

        {/* Four-step chronological progression */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold font-mono text-amber-400">{step.number}</span>
                  <span className="text-[11px] font-mono text-neutral-400">{step.timing}</span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-xs text-neutral-300 leading-relaxed">{step.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  {step.tag}
                </span>
                <span>Stage {idx + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Live pipeline health breakdown banner */}
        <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900/70 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <GitFork className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="text-neutral-300">
              Configured Instance: <strong className="text-white font-medium">sony-kalam.app.n8n.cloud</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Fail-safe: Circuit Breaker + Sentry Alert</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Self-Healing</span>
          </div>
        </div>
      </div>
    </section>
  );
}

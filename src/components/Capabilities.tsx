import { Workflow, Cpu, Database, Network, ArrowUpRight } from 'lucide-react';
import bentoPipelineImg from '../assets/images/bento_workflow_pipeline_1790759585609.jpg';

interface CapabilitiesProps {
  onSelectService: (serviceName: string) => void;
}

export function Capabilities({ onSelectService }: CapabilitiesProps) {
  return (
    <section id="capabilities" className="py-20 border-t border-neutral-800/80 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
            Engineered Competencies
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Specialized Automation Capabilities
          </h2>
          <p className="mt-3 text-neutral-400 text-base leading-relaxed">
            Eliminating fragmented manual handoffs with resilient, monitored event-driven architectures.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Marquee Large Span (col-span-2) */}
          <div className="md:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 flex flex-col justify-between hover:border-neutral-700 transition-colors group">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">01. Workflow Orchestration</span>
                <Workflow className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="mt-4 text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                High-Throughput n8n Cloud Architectures
              </h3>
              <p className="mt-3 text-neutral-300 text-sm leading-relaxed max-w-xl">
                Custom execution graphs with conditional branching, error fallback routing, state validation, and rate-limited API batching. Designed to process thousands of transactions daily without silent drops.
              </p>

              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-400 font-mono">
                <span>Webhook Trigger Nodes</span>
                <span aria-hidden="true">·</span>
                <span>Scheduled Crons</span>
                <span aria-hidden="true">·</span>
                <span>Sub-workflow Delegation</span>
                <span aria-hidden="true">·</span>
                <span>Automated Retries</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-mono">Target: 99.9% Pipeline Execution SLA</span>
              <button
                type="button"
                onClick={() => onSelectService('Workflow Automation')}
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>Request Custom Architecture</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: AI Pipeline with Image Showcase */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-colors group">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
              <img
                src={bentoPipelineImg}
                alt="Automated AI data pipeline nodes in modern studio environment"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="text-xs font-mono text-neutral-300 bg-neutral-950/70 backdrop-blur-md px-2.5 py-1 rounded">
                  02. AI Pipelines
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Agentic Workflows & Document Processing
              </h3>
              <p className="mt-2 text-neutral-300 text-xs leading-relaxed">
                Embedding multi-modal AI models into n8n nodes for instant PDF extraction, ticket classification, and contextual email drafting.
              </p>

              <button
                type="button"
                onClick={() => onSelectService('AI Agent Integration')}
                className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>Explore AI Pipelines</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: CRM & Revenue Pipeline Sync */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors group">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">03. Revenue Infrastructure</span>
                <Database className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                CRM & Database Bi-Directional Sync
              </h3>
              <p className="mt-2 text-neutral-300 text-xs leading-relaxed">
                Seamless synchronization between Postgres, Supabase, Airtable, HubSpot, Stripe, and Google Sheets with zero duplicate records.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-mono">Zero Record Drift</span>
              <button
                type="button"
                onClick={() => onSelectService('CRM & Lead Pipeline')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                Configure Sync &rarr;
              </button>
            </div>
          </div>

          {/* Card 4: Custom Webhook Portals & Intake (col-span-2) */}
          <div className="md:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 flex flex-col justify-between hover:border-neutral-700 transition-colors group">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">04. Intake Gateways</span>
                <Network className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="mt-4 text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Bespoke Webhook Forms & Client Portals
              </h3>
              <p className="mt-3 text-neutral-300 text-sm leading-relaxed max-w-xl">
                Frontend client portals mapped directly to your n8n Form trigger endpoints (e.g. <span className="font-mono text-amber-300">04ee9b4a...</span>). Complete with validation, multipart payloads, and instant user confirmations.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-neutral-400 font-mono">
                <span>Direct REST POST</span>
                <span aria-hidden="true">/</span>
                <span>Payload Encryption</span>
                <span aria-hidden="true">/</span>
                <span>Auto-Retry Deadletters</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-mono">Direct n8n Cloud Form Integration</span>
              <button
                type="button"
                onClick={() => onSelectService('Custom API Pipelines')}
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>Deploy Intake Form</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

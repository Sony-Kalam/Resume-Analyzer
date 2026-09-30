import { ArrowDownRight, ArrowRight, CheckCircle2, ShieldCheck, Zap, Layers, RefreshCw } from 'lucide-react';
import heroStudioImg from '../assets/images/hero_automation_studio_1790759573755.jpg';
import type { EndpointHealth } from '../types';

interface HeroProps {
  onNavigateToForm?: () => void;
  n8nUrl: string;
  health?: EndpointHealth;
  onCheckHealth?: () => void;
}

export function Hero({ onNavigateToForm, n8nUrl, health, onCheckHealth }: HeroProps) {
  const scrollToForm = () => {
    if (onNavigateToForm) {
      onNavigateToForm();
    } else {
      const el = document.getElementById('portal') || document.getElementById('form');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-gradient-to-b from-amber-500/10 via-amber-950/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Subtle unboxed metadata kicker */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-neutral-400 mb-6">
          <span className="text-amber-400 font-semibold">n8n Cloud Automation</span>
          <span aria-hidden="true">·</span>
          <span>Instance: sony-kalam.app.n8n.cloud</span>
          <span aria-hidden="true">·</span>
          <span>Zero-Latency Routing</span>
        </div>

        {/* Display headline */}
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
            Automated Workflows & Resilient Pipelines for Modern Operations
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-neutral-300 leading-relaxed max-w-3xl">
            Sony Kalam engineers custom webhook architectures, autonomous n8n workflows, and multi-system data pipelines that eliminate operational friction and accelerate business speed.
          </p>
        </div>

        {/* Action controls */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={scrollToForm}
            className="flex items-center gap-2.5 rounded-lg bg-amber-400 px-6 py-3.5 text-sm font-semibold text-neutral-950 hover:bg-amber-300 active:scale-[0.98] transition-all shadow-md shadow-amber-400/20"
          >
            <span>Submit Project Intake Form</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <a
            href="#pipeline"
            className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/60 px-5 py-3.5 text-sm font-medium text-neutral-200 hover:border-neutral-700 hover:text-white transition-colors"
          >
            <span>Explore Pipeline Architecture</span>
            <ArrowDownRight className="h-4 w-4 text-neutral-400" />
          </a>
        </div>

        {/* Quantitative Proof Strip adjacent to claims */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-neutral-800/80">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              99.8%
            </div>
            <div className="text-xs text-neutral-400 mt-1">Webhook Delivery Reliability</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              &lt; 60s
            </div>
            <div className="text-xs text-neutral-400 mt-1">Automated Triage & Dispatch</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              45+
            </div>
            <div className="text-xs text-neutral-400 mt-1">Integrated APIs & Cloud Nodes</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums tracking-tight">
              Live
            </div>
            <div className="text-xs text-neutral-400 mt-1">Form Trigger Connected</div>
          </div>
        </div>

        {/* Hero visual carrier with studio imagery and live overlay */}
        <div className="mt-12 relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 aspect-[16/9] max-h-[520px] shadow-2xl">
          <img
            src={heroStudioImg}
            alt="Sony Kalam high-performance automation engineering studio with workflow node monitors"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Measured contrast scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

          {/* Bottom telemetry card overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800/90 text-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="font-semibold text-white">Production Gateway</span>
                <span className="text-neutral-400 ml-2 font-mono truncate hidden md:inline">
                  {n8nUrl}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-neutral-400 font-mono text-[11px]">
              <span>Protocol: REST / Webhook Form</span>
              <span className="hidden sm:inline">·</span>
              <span className="text-amber-400">Node v20 / n8n Cloud</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

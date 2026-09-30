import { useState } from 'react';
import { Settings, ExternalLink, Menu, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { EndpointHealth } from '../types';

interface HeaderProps {
  onOpenSettings: () => void;
  onNavigateToForm: () => void;
  n8nUrl: string;
  health: EndpointHealth;
}

export function Header({ onOpenSettings, onNavigateToForm, n8nUrl, health }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#" 
          className="text-lg font-bold tracking-tight text-white hover:text-neutral-200 transition-colors shrink-0"
        >
          Sony Kalam
        </a>

        {/* Zone 2: 4-5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <a href="#capabilities" className="hover:text-white transition-colors">
            Capabilities
          </a>
          <a href="#pipeline" className="hover:text-white transition-colors">
            Mechanism
          </a>
          <a href="#form-portal" className="hover:text-white transition-colors">
            Form Portal
          </a>
          <a href="#case-studies" className="hover:text-white transition-colors">
            Impact
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            Integration FAQ
          </a>
        </nav>

        {/* Zone 3: Primary action + endpoint controller */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSettings}
            title={`Configure Endpoint: ${n8nUrl}`}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/80 px-2.5 py-1.5 text-xs text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
          >
            <Settings className="h-3.5 w-3.5 text-neutral-400" />
            <span className="hidden sm:inline font-mono text-[11px] max-w-[120px] truncate">
              n8n Cloud
            </span>
            {health.workflowActive ? (
              <span className="h-2 w-2 rounded-full bg-emerald-500" title="Active" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-amber-500" title="Standby / Test Mode" />
            )}
          </button>

          <button
            type="button"
            onClick={onNavigateToForm}
            className="rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-300 active:scale-[0.98] transition-all whitespace-nowrap shadow-sm shadow-amber-400/20"
          >
            Launch Project Form
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-neutral-950 px-4 py-4 space-y-3">
          <a
            href="#capabilities"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-300 hover:text-white"
          >
            Capabilities
          </a>
          <a
            href="#pipeline"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-300 hover:text-white"
          >
            Mechanism
          </a>
          <a
            href="#form-portal"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-300 hover:text-white"
          >
            Form Portal
          </a>
          <a
            href="#case-studies"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-300 hover:text-white"
          >
            Impact
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-neutral-300 hover:text-white"
          >
            Integration FAQ
          </a>
          <div className="pt-2 border-t border-neutral-900 flex justify-between items-center text-xs text-neutral-400">
            <span>n8n: sony-kalam.app.n8n.cloud</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSettings();
              }}
              className="text-amber-400 font-medium hover:underline"
            >
              Configure
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

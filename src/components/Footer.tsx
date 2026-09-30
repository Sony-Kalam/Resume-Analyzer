import { ExternalLink } from 'lucide-react';

interface FooterProps {
  n8nUrl: string;
}

export function Footer({ n8nUrl }: FooterProps) {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-12 text-xs text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-900">
          <div>
            <div className="text-base font-bold text-white tracking-tight">
              Sony Kalam
            </div>
            <div className="text-neutral-500 mt-1">
              Production Automation Engineering & Cloud Systems Architecture
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-6 text-neutral-400">
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
              Case Studies
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              Integration FAQ
            </a>
            <a
              href={n8nUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors font-mono"
            >
              <span>n8n Cloud</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </nav>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-neutral-500 text-[11px] font-mono">
          <div>
            &copy; {new Date().getFullYear()} Sony Kalam. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Form Target: 04ee9b4a-38a3-4345-8668-b67e089790e6</span>
            <span aria-hidden="true">·</span>
            <span>REST Webhook Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

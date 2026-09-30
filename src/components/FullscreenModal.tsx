import { X, ExternalLink, RotateCw } from 'lucide-react';
import { useState } from 'react';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  n8nUrl: string;
}

export function FullscreenModal({ isOpen, onClose, n8nUrl }: FullscreenModalProps) {
  const [iframeKey, setIframeKey] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950/95 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex h-14 items-center justify-between border-b border-neutral-800 px-6 bg-neutral-950">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white">n8n Form Viewport</span>
          <span className="text-xs font-mono text-neutral-400 truncate max-w-sm">
            {n8nUrl}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIframeKey(k => k + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-xs text-neutral-300 hover:text-white"
          >
            <RotateCw className="h-3.5 w-3.5 text-neutral-400" />
            <span>Reload</span>
          </button>

          <a
            href={n8nUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 text-xs font-semibold text-neutral-950 hover:bg-amber-300"
          >
            <span>Open Externally</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900"
            aria-label="Close fullscreen modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Frame */}
      <div className="flex-1 w-full bg-neutral-950 relative">
        <iframe
          key={iframeKey}
          src={n8nUrl}
          title="Fullscreen Sony Kalam Form"
          className="w-full h-full border-0"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-modals"
        />
      </div>
    </div>
  );
}

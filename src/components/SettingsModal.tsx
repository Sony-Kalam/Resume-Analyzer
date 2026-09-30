import { useState } from 'react';
import { X, CheckCircle2, AlertCircle, RotateCw, ExternalLink, Sliders } from 'lucide-react';
import { DEFAULT_N8N_URL, EndpointHealth } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSaveUrl: (url: string) => void;
  health: EndpointHealth;
  onCheckHealth: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  currentUrl,
  onSaveUrl,
  health,
  onCheckHealth
}: SettingsModalProps) {
  const [urlInput, setUrlInput] = useState(currentUrl);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onSaveUrl(urlInput.trim());
    onClose();
  };

  const handlePreset = (preset: string) => {
    setUrlInput(preset);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white transition-colors"
          aria-label="Close settings dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Sliders className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">n8n Cloud Configuration</h3>
        </div>
        <p className="text-xs text-neutral-400 mb-6">
          Manage the target n8n cloud form trigger, test webhook, or alternative workflow endpoint.
        </p>

        {/* Health status block */}
        <div className="mb-6 p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 text-xs font-mono">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400">Endpoint Health Check:</span>
            <button
              type="button"
              onClick={onCheckHealth}
              disabled={health.checking}
              className="flex items-center gap-1.5 text-amber-400 hover:underline disabled:opacity-50"
            >
              <RotateCw className={`h-3 w-3 ${health.checking ? 'animate-spin' : ''}`} />
              <span>{health.checking ? 'Testing...' : 'Check Status'}</span>
            </button>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-neutral-500">Status Code:</span>
              <span className="text-white font-bold">
                {health.status !== null ? `HTTP ${health.status}` : 'Not tested'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Latency:</span>
              <span className="text-white">
                {health.latencyMs !== null ? `${health.latencyMs}ms` : '--'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Workflow State:</span>
              {health.workflowActive ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Active & Receiving
                </span>
              ) : (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Inactive / Test Mode
                </span>
              )}
            </div>
          </div>

          {!health.workflowActive && health.status === 404 && (
            <div className="mt-3 p-2 rounded bg-amber-950/40 border border-amber-800/80 text-amber-300 text-[11px] leading-relaxed">
              💡 <strong>Note on 404 in n8n Cloud</strong>: The form trigger node is currently inactive. In n8n, simply toggle the switch in the top right of your workflow to <strong>Active</strong>.
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Active n8n URL
            </label>
            <input
              type="url"
              required
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Quick presets */}
          <div>
            <span className="block text-[11px] font-mono text-neutral-400 mb-1.5">Quick Presets:</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => handlePreset(DEFAULT_N8N_URL)}
                className="px-2.5 py-1 rounded border border-neutral-800 bg-neutral-900 hover:border-neutral-700 text-neutral-300 text-[11px]"
              >
                Reset Default Form
              </button>
              <button
                type="button"
                onClick={() =>
                  handlePreset(
                    'https://sony-kalam.app.n8n.cloud/webhook/04ee9b4a-38a3-4345-8668-b67e089790e6'
                  )
                }
                className="px-2.5 py-1 rounded border border-neutral-800 bg-neutral-900 hover:border-neutral-700 text-neutral-300 text-[11px]"
              >
                Production Webhook
              </button>
              <button
                type="button"
                onClick={() =>
                  handlePreset(
                    'https://sony-kalam.app.n8n.cloud/webhook-test/04ee9b4a-38a3-4345-8668-b67e089790e6'
                  )
                }
                className="px-2.5 py-1 rounded border border-neutral-800 bg-neutral-900 hover:border-neutral-700 text-neutral-300 text-[11px]"
              >
                Test Webhook
              </button>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-neutral-800 hover:bg-neutral-900 text-xs font-semibold text-neutral-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-semibold text-neutral-950 transition-colors shadow-sm shadow-amber-400/20"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

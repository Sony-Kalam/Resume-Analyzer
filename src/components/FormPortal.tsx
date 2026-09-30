import { useState, useEffect } from 'react';
import { 
  Globe, 
  Send, 
  RotateCw, 
  ExternalLink, 
  Maximize2, 
  Copy, 
  Check, 
  Terminal, 
  FileText, 
  History, 
  AlertCircle, 
  CheckCircle2, 
  Code2, 
  Sliders,
  Download,
  Trash2
} from 'lucide-react';
import { FormDataState, SubmissionRecord, EndpointHealth } from '../types';

interface FormPortalProps {
  n8nUrl: string;
  onOpenSettings: () => void;
  onOpenFullscreen: () => void;
  submissions: SubmissionRecord[];
  onAddSubmission: (sub: SubmissionRecord) => void;
  onClearSubmissions: () => void;
  health: EndpointHealth;
  onCheckHealth: () => void;
  preselectedService?: string;
}

export function FormPortal({
  n8nUrl,
  onOpenSettings,
  onOpenFullscreen,
  submissions,
  onAddSubmission,
  onClearSubmissions,
  health,
  onCheckHealth,
  preselectedService = 'Workflow Automation'
}: FormPortalProps) {
  const [activeTab, setActiveTab] = useState<'embed' | 'native' | 'tester' | 'history'>('native');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Form State
  const [formData, setFormData] = useState<FormDataState>({
    fullName: '',
    email: '',
    company: '',
    serviceCategory: preselectedService,
    budgetRange: '$2,500 - $7,500',
    urgency: '1-2 Weeks',
    projectDescription: '',
    specificationUrl: '',
    customParameters: '{\n  "source": "sony-kalam-website",\n  "environment": "production"\n}'
  });

  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, serviceCategory: preselectedService }));
    }
  }, [preselectedService]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    status: number;
    latencyMs: number;
    message: string;
    payload?: any;
    responseBody?: any;
  } | null>(null);

  // Tester State
  const [testPayloadText, setTestPayloadText] = useState(
    JSON.stringify(
      {
        fullName: 'Sony Kalam Client Test',
        email: 'client@example.com',
        serviceCategory: 'Workflow Automation',
        notes: 'Verifying n8n cloud form trigger connectivity',
        timestamp: new Date().toISOString()
      },
      null,
      2
    )
  );
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  // Copy handler
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(n8nUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Submit Handler for Native Form
  const handleNativeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setSubmitResult({
        success: false,
        status: 400,
        latencyMs: 0,
        message: 'Please provide both your full name and a valid business email address.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    let parsedCustom = {};
    try {
      if (formData.customParameters.trim()) {
        parsedCustom = JSON.parse(formData.customParameters);
      }
    } catch {
      // ignore or wrap
    }

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      company: formData.company || 'Not Specified',
      serviceCategory: formData.serviceCategory,
      budgetRange: formData.budgetRange,
      urgency: formData.urgency,
      projectDescription: formData.projectDescription,
      specificationUrl: formData.specificationUrl || '',
      submittedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      metadata: {
        ...parsedCustom,
        formTriggerUrl: n8nUrl
      }
    };

    const startTime = Date.now();
    try {
      // First attempt via server-side proxy
      const res = await fetch('/api/n8n/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: n8nUrl,
          payload
        })
      });

      const latencyMs = Date.now() - startTime;
      const data = await res.json();

      const newRecord: SubmissionRecord = {
        id: `sub_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        url: n8nUrl,
        status: data.status || res.status,
        statusText: data.statusText || res.statusText,
        latencyMs,
        payload,
        responseBody: data.responseBody,
        mode: 'native-proxy'
      };

      onAddSubmission(newRecord);

      if (data.status === 404) {
        setSubmitResult({
          success: false,
          status: 404,
          latencyMs,
          message: 'Received 404 from n8n Cloud. In n8n, Form Trigger nodes require the workflow to be set to "Active" (toggle top right of workflow) or in active Test listening mode.',
          payload,
          responseBody: data.responseBody
        });
      } else if (data.ok || (data.status >= 200 && data.status < 300)) {
        setSubmitResult({
          success: true,
          status: data.status || 200,
          latencyMs,
          message: 'Inquiry successfully transmitted to Sony Kalam n8n automation pipeline.',
          payload,
          responseBody: data.responseBody
        });
      } else {
        setSubmitResult({
          success: false,
          status: data.status || 500,
          latencyMs,
          message: data.error || 'Server responded with non-200 code',
          payload,
          responseBody: data.responseBody
        });
      }
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      const fallbackRecord: SubmissionRecord = {
        id: `sub_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        url: n8nUrl,
        status: 0,
        statusText: 'Network Failed',
        latencyMs,
        payload,
        error: err.message,
        mode: 'native-proxy'
      };
      onAddSubmission(fallbackRecord);

      setSubmitResult({
        success: false,
        status: 0,
        latencyMs,
        message: `Network transmission error: ${err.message}. Your submission has been archived locally.`,
        payload
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Run Test Ping
  const handleTestPing = async () => {
    setIsTesting(true);
    setTestResult(null);

    let parsed = {};
    try {
      parsed = JSON.parse(testPayloadText);
    } catch (e: any) {
      setTestResult({
        ok: false,
        status: 400,
        statusText: 'Bad JSON Request',
        latencyMs: 0,
        error: `Invalid JSON format: ${e.message}`,
        clientLatencyMs: 0
      });
      setIsTesting(false);
      return;
    }

    const startTime = Date.now();
    try {
      const res = await fetch('/api/n8n/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: n8nUrl,
          payload: parsed
        })
      });
      const data = await res.json();
      const latencyMs = Date.now() - startTime;

      setTestResult({
        ...data,
        clientLatencyMs: latencyMs
      });

      onAddSubmission({
        id: `test_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        url: n8nUrl,
        status: data.status || res.status,
        statusText: data.statusText || 'OK',
        latencyMs,
        payload: parsed,
        responseBody: data.responseBody,
        mode: 'test-ping'
      });
    } catch (err: any) {
      setTestResult({
        ok: false,
        error: err.message,
        status: 0,
        clientLatencyMs: Date.now() - startTime
      });
    } finally {
      setIsTesting(false);
    }
  };

  // cURL generator
  const curlCommand = `curl -X POST "${n8nUrl}" \\
  -H "Content-Type: application/json" \\
  -d '${testPayloadText.replace(/'/g, "'\\''")}'`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <section id="form-portal" className="py-20 border-t border-neutral-800/80 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
              Integration & Intake Gateway
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Interactive Form Portal
            </h2>
            <p className="mt-3 text-neutral-400 text-base leading-relaxed">
              Submit workflow requirements through the native intake engine or directly inspect the embedded n8n cloud form.
            </p>
          </div>

          {/* Quick status bar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 text-xs font-mono text-neutral-300">
              <span className="text-neutral-400">Endpoint:</span>
              <span className="text-amber-400 truncate max-w-[200px]" title={n8nUrl}>
                {n8nUrl.split('/form/')[1] || n8nUrl}
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2 rounded-lg border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
              title="Edit Endpoint Settings"
            >
              <Sliders className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection Bar */}
        <div className="mt-8 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('native')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'native'
                  ? 'border-amber-400 text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <FileText className="h-4 w-4 text-amber-400" />
              <span>Native Intake Form</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('embed')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'embed'
                  ? 'border-amber-400 text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Globe className="h-4 w-4 text-amber-400" />
              <span>Live n8n Form Embed</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tester')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'tester'
                  ? 'border-amber-400 text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Terminal className="h-4 w-4 text-amber-400" />
              <span>Webhook Debugger</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-amber-400 text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <History className="h-4 w-4 text-amber-400" />
              <span>Audit Log ({submissions.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Native Rapid Intake Form */}
        {activeTab === 'native' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-2">Project & Workflow Intake</h3>
              <p className="text-xs text-neutral-400 mb-6">
                Directly submitted to Sony Kalam’s active n8n automation pipeline. Receive immediate validation and execution response.
              </p>

              {submitResult && (
                <div
                  className={`mb-6 p-4 rounded-xl border text-xs ${
                    submitResult.success
                      ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                      : 'border-amber-500/40 bg-amber-950/30 text-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {submitResult.success ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="font-semibold text-sm">
                        {submitResult.success ? 'Submission Dispatched Successfully' : 'Transmission Status Notice'}
                      </div>
                      <div>{submitResult.message}</div>
                      <div className="font-mono text-[11px] opacity-80 pt-1">
                        HTTP Status: {submitResult.status} · Latency: {submitResult.latencyMs}ms
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleNativeSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Full Name <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Business Email <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Organization / Company
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Dynamics Ltd."
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Service Category
                    </label>
                    <select
                      value={formData.serviceCategory}
                      onChange={e => setFormData({ ...formData, serviceCategory: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                    >
                      <option value="Workflow Automation">Workflow Automation (n8n Cloud)</option>
                      <option value="AI Agent Integration">AI Agent & LLM Document Pipelines</option>
                      <option value="CRM & Lead Pipeline">CRM & Revenue Database Sync</option>
                      <option value="Custom API Pipelines">Custom API & Webhook Architecture</option>
                      <option value="Emergency Debugging">Emergency Workflow Audit / Repair</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Target Timeline / Urgency
                    </label>
                    <select
                      value={formData.urgency}
                      onChange={e => setFormData({ ...formData, urgency: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                    >
                      <option value="Immediate (< 48 hrs)">Immediate (&lt; 48 hours)</option>
                      <option value="1-2 Weeks">1 to 2 Weeks</option>
                      <option value="Planning Phase">Planning Phase (Within 30 Days)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Budget Allocation
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={e => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                    >
                      <option value="< $2,500">&lt; $2,500 (Single Workflow)</option>
                      <option value="$2,500 - $7,500">$2,500 – $7,500 (Multi-node Pipeline)</option>
                      <option value="$7,500+">$7,500+ (Enterprise Architecture)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Project Requirements & Workflow Objectives
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe the tools you wish to connect (e.g. n8n, HubSpot, Stripe, PostgreSQL), expected trigger frequency, and key objectives..."
                    value={formData.projectDescription}
                    onChange={e => setFormData({ ...formData, projectDescription: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-sm text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Link to Technical Spec or Reference (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://docs.google.com/... or Figma / Notion link"
                    value={formData.specificationUrl}
                    onChange={e => setFormData({ ...formData, specificationUrl: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>

                {/* Technical Custom JSON Params */}
                <details className="rounded-lg border border-neutral-800 bg-neutral-950/80 p-3">
                  <summary className="text-xs font-mono text-neutral-400 cursor-pointer hover:text-white transition-colors">
                    + Advanced: Custom Webhook Metadata (JSON)
                  </summary>
                  <div className="mt-3">
                    <textarea
                      rows={3}
                      value={formData.customParameters}
                      onChange={e => setFormData({ ...formData, customParameters: e.target.value })}
                      className="w-full rounded border border-neutral-800 bg-neutral-900 p-2 font-mono text-xs text-neutral-300 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </details>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-400 py-3.5 px-6 text-sm font-semibold text-neutral-950 hover:bg-amber-300 active:scale-[0.99] disabled:opacity-50 transition-all shadow-md shadow-amber-400/20"
                  >
                    {isSubmitting ? (
                      <>
                        <RotateCw className="h-4 w-4 animate-spin" />
                        <span>Transmitting to n8n Cloud Pipeline...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit to Sony Kalam Workflow</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Side Information Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
                <h4 className="text-sm font-bold text-white mb-2">Endpoint Target</h4>
                <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800 font-mono text-[11px] text-amber-300 break-all">
                  {n8nUrl}
                </div>

                <div className="mt-4 space-y-3 text-xs text-neutral-400">
                  <div className="flex items-center justify-between">
                    <span>Host Platform</span>
                    <span className="text-neutral-200 font-mono">n8n Cloud</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Protocol</span>
                    <span className="text-neutral-200 font-mono">POST / REST</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Target Node</span>
                    <span className="text-neutral-200 font-mono">n8n-nodes-base.form</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={onOpenSettings}
                    className="w-full py-2 px-3 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Sliders className="h-3.5 w-3.5 text-amber-400" />
                    <span>Change n8n Endpoint URL</span>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
                <h4 className="text-sm font-bold text-white mb-2">Guaranteed SLAs</h4>
                <ul className="space-y-2.5 text-xs text-neutral-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Sub-minute automated acknowledgment sent to your business email.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Technical scope and feasibility audit delivered within 24 hours.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Direct engineering review by Sony Kalam.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live n8n Form Embed */}
        {activeTab === 'embed' && (
          <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden shadow-2xl">
            {/* Simulated Browser Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-neutral-950 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-3 flex items-center gap-2 rounded-md bg-neutral-900 px-3 py-1 text-xs font-mono text-neutral-300 border border-neutral-800 max-w-md truncate">
                  <Globe className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{n8nUrl}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIframeKey(prev => prev + 1)}
                  className="flex items-center gap-1.5 rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1.5 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
                  title="Reload Form Frame"
                >
                  <RotateCw className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="hidden sm:inline">Reload</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="flex items-center gap-1.5 rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1.5 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
                  title="Copy Direct Link"
                >
                  {copiedUrl ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-neutral-400" />
                  )}
                  <span className="hidden sm:inline">{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenFullscreen}
                  className="flex items-center gap-1.5 rounded bg-neutral-900 border border-neutral-800 px-2.5 py-1.5 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
                  title="Open Fullscreen View"
                >
                  <Maximize2 className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </button>

                <a
                  href={n8nUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded bg-amber-400 px-3 py-1.5 font-semibold text-neutral-950 hover:bg-amber-300 transition-colors"
                >
                  <span>Open in n8n Cloud</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Embedded iFrame Viewport */}
            <div className="relative w-full bg-neutral-950 min-h-[680px]">
              <iframe
                key={iframeKey}
                src={n8nUrl}
                title="Sony Kalam n8n Form"
                className="w-full h-[700px] border-0"
                sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-modals"
              />

              {/* Embedded Fallback Guidance Drawer */}
              <div className="p-4 border-t border-neutral-800 bg-neutral-900/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5 text-neutral-300">
                  <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Workflow Activation Note:</strong> In n8n Cloud, form URLs respond when the workflow is toggled to <strong>Active</strong> in your n8n workspace or when actively listening for test steps. If an external CSP restricts embedding, click <a href={n8nUrl} target="_blank" rel="noopener noreferrer" className="text-amber-400 underline font-medium">Open in n8n Cloud</a> or use the <strong>Native Intake Form</strong> tab above.
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('native')}
                  className="shrink-0 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium transition-colors"
                >
                  Switch to Native Form
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Webhook Debugger & API Inspector */}
        {activeTab === 'tester' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-amber-400" />
                  <span>Payload Dispatch Tester</span>
                </h3>
                <span className="text-xs font-mono text-neutral-400">JSON Payload</span>
              </div>
              <p className="text-xs text-neutral-400 mb-4">
                Execute an ad-hoc POST ping to test the n8n form trigger endpoint and monitor latency.
              </p>

              <textarea
                rows={10}
                value={testPayloadText}
                onChange={e => setTestPayloadText(e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-3 font-mono text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
              />

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTestPing}
                  disabled={isTesting}
                  className="flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-amber-300 disabled:opacity-50 transition-colors"
                >
                  {isTesting ? (
                    <>
                      <RotateCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Test Webhook Ping</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setTestPayloadText(
                      JSON.stringify(
                        {
                          fullName: 'Sony Kalam Sample Intake',
                          email: 'sonypriya364@gmail.com',
                          serviceCategory: 'AI Agent Integration',
                          budget: '$5,000',
                          testId: `test_${Date.now()}`
                        },
                        null,
                        2
                      )
                    )
                  }
                  className="text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  Reset Sample
                </button>
              </div>

              {/* cURL snippet */}
              <div className="mt-6 pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-neutral-400">cURL Command</span>
                  <button
                    type="button"
                    onClick={handleCopyCurl}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:underline"
                  >
                    {copiedCurl ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 overflow-x-auto">
                  {curlCommand}
                </pre>
              </div>
            </div>

            {/* Response Viewer */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-amber-400" />
                    <span>Real-Time Response Inspector</span>
                  </h3>
                  {testResult && (
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded ${
                        testResult.status >= 200 && testResult.status < 300
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      HTTP {testResult.status}
                    </span>
                  )}
                </div>

                {testResult ? (
                  <div className="space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-2 gap-3 p-3 rounded bg-neutral-950 border border-neutral-800">
                      <div>
                        <span className="text-neutral-500">Latency:</span>{' '}
                        <span className="text-white font-bold">{testResult.latencyMs || testResult.clientLatencyMs}ms</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Status:</span>{' '}
                        <span className="text-white">{testResult.statusText || testResult.status}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-neutral-400 block mb-1">Response Body:</span>
                      <pre className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 max-h-[300px] overflow-auto">
                        {typeof testResult.responseBody === 'object'
                          ? JSON.stringify(testResult.responseBody, null, 2)
                          : String(testResult.responseBody || testResult.error || 'Empty response')}
                      </pre>
                    </div>

                    {testResult.status === 404 && (
                      <div className="p-3 rounded bg-amber-950/40 border border-amber-800/80 text-amber-300 text-xs">
                        ⚠️ <strong>Workflow Inactive</strong>: In n8n Cloud, form URLs return 404 when the workflow toggle is inactive. Open your n8n workflow canvas and toggle the top-right switch from Inactive to <strong>Active</strong>.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-neutral-500 text-xs font-mono border border-dashed border-neutral-800 rounded-lg">
                    No execution initiated yet. Click "Send Test Webhook Ping" to inspect headers and latency.
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span>Direct Node Proxy: /api/n8n/submit</span>
                <button
                  type="button"
                  onClick={onCheckHealth}
                  className="text-amber-400 hover:underline"
                >
                  Verify Server Connectivity
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Submission History & Audit Log */}
        {activeTab === 'history' && (
          <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Execution Audit Trail</h3>
                <p className="text-xs text-neutral-400">
                  Locally archived records for submissions and webhook tests dispatched during this session.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {submissions.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(submissions, null, 2)], {
                          type: 'application/json'
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `sony-kalam-n8n-audit-${Date.now()}.json`;
                        a.click();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-xs text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5 text-neutral-400" />
                      <span>Export JSON</span>
                    </button>

                    <button
                      type="button"
                      onClick={onClearSubmissions}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-xs text-red-400 hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Clear History</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {submissions.length === 0 ? (
              <div className="p-12 text-center text-neutral-500 text-xs font-mono border border-dashed border-neutral-800 rounded-xl">
                No submissions or pings logged yet. Submissions sent via the Native Form or Webhook Debugger will appear here.
              </div>
            ) : (
              <div className="divide-y divide-neutral-800/80 overflow-x-auto">
                {submissions.map(sub => (
                  <div key={sub.id} className="py-4 space-y-2 text-xs font-mono">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            sub.status >= 200 && sub.status < 300
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          HTTP {sub.status}
                        </span>
                        <span className="text-white font-semibold">{sub.mode}</span>
                        <span className="text-neutral-500">·</span>
                        <span className="text-neutral-400">{sub.timestamp}</span>
                      </div>

                      <div className="text-neutral-400 text-[11px]">
                        Latency: <strong className="text-neutral-200">{sub.latencyMs}ms</strong>
                      </div>
                    </div>

                    <div className="p-3 rounded bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 overflow-x-auto">
                      <div className="text-neutral-500 mb-1">Payload:</div>
                      <pre>{JSON.stringify(sub.payload, null, 2)}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

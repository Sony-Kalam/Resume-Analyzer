/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Capabilities } from './components/Capabilities';
import { WorkflowPipeline } from './components/WorkflowPipeline';
import { FormPortal } from './components/FormPortal';
import { CaseStudies } from './components/CaseStudies';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { SettingsModal } from './components/SettingsModal';
import { FullscreenModal } from './components/FullscreenModal';
import { DEFAULT_N8N_URL, SubmissionRecord, EndpointHealth } from './types';

export default function App() {
  const [n8nUrl, setN8nUrl] = useState<string>(() => {
    return localStorage.getItem('sony_kalam_n8n_url') || DEFAULT_N8N_URL;
  });

  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(() => {
    try {
      const stored = localStorage.getItem('sony_kalam_n8n_subs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [health, setHealth] = useState<EndpointHealth>({
    checking: false,
    lastChecked: null,
    status: null,
    statusText: null,
    latencyMs: null,
    workflowActive: false
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Workflow Automation');

  // Sync n8n URL to local storage
  const handleSaveUrl = (newUrl: string) => {
    setN8nUrl(newUrl);
    localStorage.setItem('sony_kalam_n8n_url', newUrl);
    checkHealth(newUrl);
  };

  // Add submission to audit trail and store
  const handleAddSubmission = (sub: SubmissionRecord) => {
    setSubmissions(prev => {
      const updated = [sub, ...prev].slice(0, 50);
      try {
        localStorage.setItem('sony_kalam_n8n_subs', JSON.stringify(updated));
      } catch (e) {
        // quota safety
      }
      return updated;
    });
  };

  const handleClearSubmissions = () => {
    setSubmissions([]);
    localStorage.removeItem('sony_kalam_n8n_subs');
  };

  // Health check handler
  const checkHealth = async (targetUrl = n8nUrl) => {
    setHealth(prev => ({ ...prev, checking: true }));
    try {
      const res = await fetch('/api/n8n/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });
      const data = await res.json();
      setHealth({
        checking: false,
        lastChecked: new Date().toLocaleTimeString(),
        status: data.status,
        statusText: data.statusText,
        latencyMs: data.latencyMs,
        workflowActive: data.workflowActive,
        error: data.error
      });
    } catch (err: any) {
      setHealth({
        checking: false,
        lastChecked: new Date().toLocaleTimeString(),
        status: 0,
        statusText: 'Failed',
        latencyMs: null,
        workflowActive: false,
        error: err.message
      });
    }
  };

  useEffect(() => {
    checkHealth(n8nUrl);
  }, []);

  const scrollToForm = (serviceName?: string) => {
    if (serviceName) {
      setSelectedService(serviceName);
    }
    const elem = document.getElementById('form-portal');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      <Header
        onOpenSettings={() => setSettingsOpen(true)}
        onNavigateToForm={() => scrollToForm()}
        n8nUrl={n8nUrl}
        health={health}
      />

      <main className="flex-1">
        <Hero
          onNavigateToForm={() => scrollToForm()}
          n8nUrl={n8nUrl}
        />

        <Capabilities
          onSelectService={service => scrollToForm(service)}
        />

        <WorkflowPipeline
          n8nUrl={n8nUrl}
        />

        <FormPortal
          n8nUrl={n8nUrl}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenFullscreen={() => setFullscreenOpen(true)}
          submissions={submissions}
          onAddSubmission={handleAddSubmission}
          onClearSubmissions={handleClearSubmissions}
          health={health}
          onCheckHealth={() => checkHealth(n8nUrl)}
          preselectedService={selectedService}
        />

        <CaseStudies
          onSelectService={service => scrollToForm(service)}
        />

        <FAQSection />
      </main>

      <Footer n8nUrl={n8nUrl} />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentUrl={n8nUrl}
        onSaveUrl={handleSaveUrl}
        health={health}
        onCheckHealth={() => checkHealth(n8nUrl)}
      />

      <FullscreenModal
        isOpen={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
        n8nUrl={n8nUrl}
      />
    </div>
  );
}

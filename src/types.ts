export interface FormDataState {
  fullName: string;
  email: string;
  company: string;
  serviceCategory: string;
  budgetRange: string;
  urgency: string;
  projectDescription: string;
  specificationUrl: string;
  customParameters: string;
}

export interface SubmissionRecord {
  id: string;
  timestamp: string;
  url: string;
  status: number;
  statusText: string;
  latencyMs: number;
  payload: Record<string, any>;
  responseBody?: any;
  error?: string;
  mode: 'native-proxy' | 'direct' | 'test-ping';
}

export interface EndpointHealth {
  checking: boolean;
  lastChecked: string | null;
  status: number | null;
  statusText: string | null;
  latencyMs: number | null;
  workflowActive: boolean;
  error?: string;
}

export const DEFAULT_N8N_URL = 'https://sony-kalam.app.n8n.cloud/form/04ee9b4a-38a3-4345-8668-b67e089790e6';

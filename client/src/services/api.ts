import type { AnalysisResult } from '../types/analysis';

export interface HealthResponse {
  status: string;
  app: string;
  model_configured: string;
  api_key_present: boolean;
  environment: string;
}

export interface AnalyzeResponse {
  success: boolean;
  result?: AnalysisResult;
  error?: string;
  code?: string;
}

export async function checkBackendHealth(): Promise<HealthResponse | null> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Backend health check error:', err);
    return null;
  }
}

export async function analyzeImages(
  claimFile: File,
  evidenceFile: File
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('claimImage', claimFile);
  formData.append('evidenceImage', evidenceFile);

  const res = await fetch('/api/analyze', {
    method: 'POST',
    body: formData,
  });

  const data: AnalyzeResponse = await res.json();

  if (!res.ok || !data.success || !data.result) {
    const errorMessage = data.error || `Analysis request failed with status ${res.status}`;
    const error = new Error(errorMessage) as any;
    error.code = data.code || 'REQUEST_FAILED';
    throw error;
  }

  return data.result;
}

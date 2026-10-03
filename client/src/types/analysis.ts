export type VerdictType = 
  | 'SUPPORTED' 
  | 'PARTIALLY_SUPPORTED' 
  | 'NOT_SUPPORTED' 
  | 'INSUFFICIENT_EVIDENCE';

export type ConfidenceType = 'high' | 'medium' | 'low';

export interface NumericalBreakdown {
  has_numerical_claim: boolean;
  claimed_value?: string | null;
  actual_value?: string | null;
  calculated_difference?: string | null;
  metric?: string | null;
}

export interface AnalysisResult {
  verdict: VerdictType;
  claim: string;
  evidence: string[];
  comparison: string;
  explanation: string;
  key_findings: string[];
  missing_information: string[];
  confidence: ConfidenceType;
  numerical_breakdown?: NumericalBreakdown | null;
  is_demo?: boolean;
  demo_id?: string;
  analyzed_at?: string;
  model_used?: string;
}

export interface DemoItem {
  id: string;
  title: string;
  claimShort: string;
  evidenceShort: string;
  expectedVerdict: VerdictType;
  claimImageUrl: string;
  evidenceImageUrl: string;
  claimFileName: string;
  evidenceFileName: string;
  claimFileSize: string;
  evidenceFileSize: string;
  predefinedResult: AnalysisResult;
}

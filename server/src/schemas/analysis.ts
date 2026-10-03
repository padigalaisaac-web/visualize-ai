import { z } from 'zod';

export const VerdictEnum = z.enum([
  'SUPPORTED',
  'PARTIALLY_SUPPORTED',
  'NOT_SUPPORTED',
  'INSUFFICIENT_EVIDENCE'
]);

export const ConfidenceEnum = z.enum(['high', 'medium', 'low']);

export const NumericalBreakdownSchema = z.object({
  has_numerical_claim: z.boolean(),
  claimed_value: z.string().nullable().optional(),
  actual_value: z.string().nullable().optional(),
  calculated_difference: z.string().nullable().optional(),
  metric: z.string().nullable().optional()
}).nullable().optional();

export const AnalysisResultSchema = z.object({
  verdict: VerdictEnum,
  claim: z.string().min(1, 'Claim is required'),
  evidence: z.array(z.string()).min(1, 'At least one evidence item is required'),
  comparison: z.string().min(1, 'Comparison is required'),
  explanation: z.string().min(1, 'Explanation is required'),
  key_findings: z.array(z.string()).default([]),
  missing_information: z.array(z.string()).default([]),
  confidence: ConfidenceEnum,
  numerical_breakdown: NumericalBreakdownSchema
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

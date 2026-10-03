import type { DemoItem } from '../types/analysis';

export const DEMO_EXAMPLES: DemoItem[] = [
  {
    id: 'demo-1',
    title: 'Sales Growth Claim (300% vs 50%)',
    claimShort: '“Sales increased by 300%.”',
    evidenceShort: '2025: ₹10 lakh → 2026: ₹15 lakh',
    expectedVerdict: 'NOT_SUPPORTED',
    claimImageUrl: '/demo_images/demo1_claim.png',
    evidenceImageUrl: '/demo_images/demo1_evidence.png',
    claimFileName: 'demo1_claim.png',
    evidenceFileName: 'demo1_evidence.png',
    claimFileSize: '41.2 KB',
    evidenceFileSize: '44.8 KB',
    predefinedResult: {
      verdict: 'NOT_SUPPORTED',
      claim: 'Sales increased by 300%.',
      evidence: [
        'Fiscal Year 2025 audited sales stood at ₹10 Lakh.',
        'Fiscal Year 2026 audited sales increased to ₹15 Lakh.',
        'Total revenue delta between 2025 and 2026 is +₹5 Lakh.'
      ],
      comparison: 'The claim asserts a 300% sales increase. However, the audited evidence documents growth from ₹10 lakh to ₹15 lakh. Mathematically, ((15 - 10) / 10) * 100 = 50%, not 300%. A 300% increase would have resulted in ₹40 lakh.',
      explanation: 'The evidence shows an increase from ₹10 lakh to ₹15 lakh, which is a 50% increase, not 300%. The claim exaggerates the actual growth by a factor of six.',
      key_findings: [
        'Baseline 2025 Sales: ₹10 Lakh',
        'Subsequent 2026 Sales: ₹15 Lakh',
        'Actual growth rate: 50.0%',
        'Claimed growth rate: 300%'
      ],
      missing_information: [
        'No other business divisions or secondary sales figures are presented that could account for the remaining 250% discrepancy.'
      ],
      confidence: 'high',
      numerical_breakdown: {
        has_numerical_claim: true,
        claimed_value: '300% increase',
        actual_value: '₹10L to ₹15L (50% increase)',
        calculated_difference: 'Discrepancy of 250 percentage points between claim and verified audit data.',
        metric: 'Annual Sales Growth'
      },
      is_demo: true,
      demo_id: 'demo-1',
      model_used: 'Gemma 4 (Multimodal Vision)'
    }
  },
  {
    id: 'demo-2',
    title: 'Revenue Milestone (Exact 50% Match)',
    claimShort: '“Revenue increased by 50%.”',
    evidenceShort: 'Baseline: ₹10 Lakh → Current: ₹15 Lakh (+50%)',
    expectedVerdict: 'SUPPORTED',
    claimImageUrl: '/demo_images/demo2_claim.png',
    evidenceImageUrl: '/demo_images/demo2_evidence.png',
    claimFileName: 'demo2_claim.png',
    evidenceFileName: 'demo2_evidence.png',
    claimFileSize: '39.8 KB',
    evidenceFileSize: '43.1 KB',
    predefinedResult: {
      verdict: 'SUPPORTED',
      claim: 'Revenue increased by 50%.',
      evidence: [
        '2025 Base Year Revenue is documented at ₹10 Lakh.',
        '2026 Current Year Revenue is verified at ₹15 Lakh.',
        'Net difference is +₹5 Lakh (+50.0%).'
      ],
      comparison: 'The claim asserts a 50% increase in revenue. The official statutory ledger records an increase from ₹10 lakh to ₹15 lakh. The formula ((15 - 10) / 10) * 100 yields exactly 50%. The claim is directly substantiated.',
      explanation: 'The provided evidence directly supports the claim. The statutory ledger verifies that revenue progressed from ₹10 lakh in 2025 to ₹15 lakh in 2026, which represents an exact 50% growth.',
      key_findings: [
        'Exact numerical alignment with audited financial data.',
        'Both timeframe and metric directly correlate.',
        'No contradictory figures detected in the provided evidence.'
      ],
      missing_information: [],
      confidence: 'high',
      numerical_breakdown: {
        has_numerical_claim: true,
        claimed_value: '50% revenue growth',
        actual_value: '₹10L → ₹15L (+50.0%)',
        calculated_difference: 'Exact match (0% discrepancy)',
        metric: 'Revenue Percentage Increase'
      },
      is_demo: true,
      demo_id: 'demo-2',
      model_used: 'Gemma 4 (Multimodal Vision)'
    }
  },
  {
    id: 'demo-3',
    title: 'Dual Product Claim (Price & Battery Life)',
    claimShort: '“Cheaper and lasts twice as long.”',
    evidenceShort: 'Price: $80 vs $100 | Battery: 12h vs 10h (+20%)',
    expectedVerdict: 'PARTIALLY_SUPPORTED',
    claimImageUrl: '/demo_images/demo3_claim.png',
    evidenceImageUrl: '/demo_images/demo3_evidence.png',
    claimFileName: 'demo3_claim.png',
    evidenceFileName: 'demo3_evidence.png',
    claimFileSize: '42.0 KB',
    evidenceFileSize: '46.7 KB',
    predefinedResult: {
      verdict: 'PARTIALLY_SUPPORTED',
      claim: 'Our product is cheaper and lasts twice as long.',
      evidence: [
        'Retail price: Competitor is $100; UltraPack Pro is $80 ($20 / 20% cheaper).',
        'Continuous runtime benchmark: Competitor lasts 10 hours; UltraPack Pro lasts 12 hours (+2 hours / 20% increase).'
      ],
      comparison: 'The claim contains two distinct factual assertions: 1) "cheaper" (Supported: $80 < $100), and 2) "lasts twice as long" (Not Supported: 12 hours vs 10 hours is only 1.2x, not the claimed 2.0x / 20 hours).',
      explanation: 'The pricing part of the claim is substantiated by the lab test ($80 vs $100). However, the longevity claim that it lasts "twice as long" is contradicted: battery life is only 20% higher (12h vs 10h), not 100% higher.',
      key_findings: [
        'Price assertion: Fully supported ($80 vs $100).',
        'Duration assertion: Contradicted (12h observed vs 20h required for 2x).',
        'Combined verdict: Partially Supported due to one true assertion and one exaggerated assertion.'
      ],
      missing_information: [
        'Whether specific power-saving modes exist that were tested separately is not shown in the primary benchmark table.'
      ],
      confidence: 'high',
      numerical_breakdown: {
        has_numerical_claim: true,
        claimed_value: 'Price: Cheaper; Battery: 2x (200% / +100%)',
        actual_value: 'Price: $80 vs $100 (-20%); Battery: 12h vs 10h (+20%)',
        calculated_difference: 'Battery run time falls 8 hours short of the claimed 2x duration.',
        metric: 'Product Economics and Battery Life'
      },
      is_demo: true,
      demo_id: 'demo-3',
      model_used: 'Gemma 4 (Multimodal Vision)'
    }
  }
];

export async function dataUrlToFile(url: string, filename: string): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  const mimeType = url.endsWith('.png') ? 'image/png' : blob.type || 'image/png';
  return new File([blob], filename, { type: mimeType });
}


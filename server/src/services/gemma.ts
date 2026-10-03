import { GoogleGenAI } from '@google/genai';
import { AnalysisResult, AnalysisResultSchema } from '../schemas/analysis.js';

const SYSTEM_INSTRUCTION = `You are VisualProof AI, a multimodal evidence analysis system.

You will receive two images:
IMAGE 1 = CLAIM
IMAGE 2 = EVIDENCE

Your job is to understand both images and determine whether the evidence supports the claim.

First identify the main factual claim in IMAGE 1.
Then identify the relevant factual information visible in IMAGE 2.
Compare the claim and evidence.

Possible verdicts:
SUPPORTED:
The available evidence directly supports the claim.

PARTIALLY_SUPPORTED:
Some parts of the claim are supported, but one or more important parts are unsupported or contradicted.

NOT_SUPPORTED:
The evidence contradicts the claim or clearly fails to support it.

INSUFFICIENT_EVIDENCE:
The provided evidence does not contain enough information to determine whether the claim is supported.

IMPORTANT RULES:
1. Only use information visible in the provided images.
2. Do not invent facts.
3. Do not use outside knowledge to fill missing information.
4. If information is unclear, say so.
5. Distinguish between evidence and inference.
6. Explain the reasoning in simple language.
7. If numerical values are present, calculate the relevant difference or percentage carefully.
8. If the claim contains multiple parts, evaluate each part.
9. If evidence is missing, explicitly identify what is missing.
10. Do not claim certainty when the evidence is ambiguous.
11. If numerical figures are present (e.g. percentages, currency, ratios, durations), fill the "numerical_breakdown" object with:
    - has_numerical_claim: true
    - claimed_value: string (e.g. "300% increase")
    - actual_value: string (e.g. "50% increase (₹10L to ₹15L)")
    - calculated_difference: string (e.g. "250 percentage point exaggeration")
    - metric: string (e.g. "Annual Sales")
    Otherwise set has_numerical_claim to false.

Return ONLY valid JSON with no markdown wrapping or formatting, strictly conforming to the following structure:
{
  "verdict": "SUPPORTED" | "PARTIALLY_SUPPORTED" | "NOT_SUPPORTED" | "INSUFFICIENT_EVIDENCE",
  "claim": "string",
  "evidence": ["string"],
  "comparison": "string",
  "explanation": "string",
  "key_findings": ["string"],
  "missing_information": ["string"],
  "confidence": "high" | "medium" | "low",
  "numerical_breakdown": {
    "has_numerical_claim": boolean,
    "claimed_value": "string or null",
    "actual_value": "string or null",
    "calculated_difference": "string or null",
    "metric": "string or null"
  }
}`;

export interface ImageInput {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

function cleanJsonString(raw: string): string {
  let text = raw.trim();
  // Strip markdown code fences if model enclosed in ```json ... ```
  if (text.startsWith('```')) {
    const firstNewline = text.indexOf('\n');
    if (firstNewline !== -1) {
      text = text.substring(firstNewline + 1);
    }
    const lastFence = text.lastIndexOf('```');
    if (lastFence !== -1) {
      text = text.substring(0, lastFence);
    }
  }
  return text.trim();
}

export async function analyzeClaimAndEvidence(
  claimImage: ImageInput,
  evidenceImage: ImageInput
): Promise<{ result: AnalysisResult; modelUsed: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.trim() === 'your_gemini_api_key_here') {
    throw new Error('MISSING_API_KEY');
  }

  // Model is configurable through GEMINI_MODEL env var
  const modelName = process.env.GEMINI_MODEL?.trim() || 'gemma-4-31b-it';

  const ai = new GoogleGenAI({ apiKey });

  const promptText = `Analyze these two images.
IMAGE 1 (First attached image) is the CLAIM.
IMAGE 2 (Second attached image) is the EVIDENCE.

Extract the claim from IMAGE 1, examine the factual data in IMAGE 2, compare them rigorously, and output the analysis in the specified JSON structure.`;

  let responseText = '';

  try {
    // Attempt standard generateContent multimodal call
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          role: 'user',
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: claimImage.mimetype,
                data: claimImage.buffer.toString('base64'),
              },
            },
            {
              inlineData: {
                mimeType: evidenceImage.mimetype,
                data: evidenceImage.buffer.toString('base64'),
              },
            },
          ],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    responseText = response.text || '';
  } catch (primaryErr: any) {
    console.warn(`Primary generateContent error on model ${modelName}:`, primaryErr.message);

    // If 503 high demand or 500 internal error, try the alternative Gemma 4 MoE model or retry
    const altModel = modelName === 'gemma-4-31b-it' ? 'gemma-4-26b-a4b-it' : modelName;

    try {
      console.log(`Attempting with Gemma 4 variant: ${altModel}...`);
      const fallbackResponse = await ai.models.generateContent({
        model: altModel,
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${SYSTEM_INSTRUCTION}\n\n${promptText}` },
              {
                inlineData: {
                  mimeType: claimImage.mimetype,
                  data: claimImage.buffer.toString('base64'),
                },
              },
              {
                inlineData: {
                  mimeType: evidenceImage.mimetype,
                  data: evidenceImage.buffer.toString('base64'),
                },
              },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });
      responseText = fallbackResponse.text || '';
    } catch (fallbackErr: any) {
      console.warn(`Alternative model attempt error:`, fallbackErr.message);

      // Final attempt without responseMimeType in case json mode isn't supported
      const rawResponse = await ai.models.generateContent({
        model: altModel,
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${SYSTEM_INSTRUCTION}\n\n${promptText}` },
              {
                inlineData: {
                  mimeType: claimImage.mimetype,
                  data: claimImage.buffer.toString('base64'),
                },
              },
              {
                inlineData: {
                  mimeType: evidenceImage.mimetype,
                  data: evidenceImage.buffer.toString('base64'),
                },
              },
            ],
          },
        ],
      });
      responseText = rawResponse.text || '';
    }
  }


  if (!responseText) {
    throw new Error('EMPTY_RESPONSE_FROM_MODEL');
  }

  const cleaned = cleanJsonString(responseText);
  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err: any) {
    console.error('Failed to parse model JSON:', cleaned);
    throw new Error('INVALID_JSON_FROM_MODEL');
  }

  // Validate with Zod
  const validation = AnalysisResultSchema.safeParse(parsed);
  if (!validation.success) {
    console.error('Schema validation failed:', validation.error.format());
    
    // Normalize if fields are missing or slightly malformed
    const normalized: AnalysisResult = {
      verdict: ['SUPPORTED', 'PARTIALLY_SUPPORTED', 'NOT_SUPPORTED', 'INSUFFICIENT_EVIDENCE'].includes(parsed.verdict)
        ? parsed.verdict
        : 'INSUFFICIENT_EVIDENCE',
      claim: String(parsed.claim || 'Claim extracted from visual input'),
      evidence: Array.isArray(parsed.evidence) && parsed.evidence.length > 0 
        ? parsed.evidence.map(String) 
        : ['Evidence extracted from visual documentation'],
      comparison: String(parsed.comparison || 'Comparison of claim against visual evidence.'),
      explanation: String(parsed.explanation || 'Detailed explanation of evidence analysis.'),
      key_findings: Array.isArray(parsed.key_findings) ? parsed.key_findings.map(String) : [],
      missing_information: Array.isArray(parsed.missing_information) ? parsed.missing_information.map(String) : [],
      confidence: ['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : 'medium',
      numerical_breakdown: parsed.numerical_breakdown || null
    };

    return {
      result: normalized,
      modelUsed: modelName
    };
  }

  return {
    result: validation.data,
    modelUsed: modelName
  };
}

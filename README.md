# VisualProof AI

> **"Does the evidence actually support the claim?"**
>
> An autonomous multimodal evidence-checking application powered by **Gemma 4** through the Google Gemini API. Built for the official **MLH Hacktoberfest Hack Day Hyderabad** challenge: *"Best Use of Gemma 4"*.

---

## What It Does

VisualProof AI is a multimodal evidence-verification application designed to answer a single question: **"Does the evidence actually support the claim?"** Users provide two visual artifacts—an image containing a claim (an infographic, ad banner, social media post, or executive deck) and an image containing supporting evidence (an audited report, balance sheet, lab benchmark, or data table). VisualProof AI submits both visual inputs to **Gemma 4**, extracts the factual assertions, cross-verifies numbers and constraints, and produces a structured verdict with an evidence-grounded explanation.

---

## Problem

Modern digital communication is flooded with bold claims:
- Pitch decks claiming *"Sales grew by 300% YoY"*.
- Consumer advertisements asserting *"Our product lasts twice as long as the competitor"*.
- Social infographics citing selective statistics out of context.

Reviewers, auditors, journalists, and consumers rarely have the time to manually cross-reference claims against dense audit tables or fine-print benchmark results. Misleading percentage calculations, distorted axes, and selective cherry-picking frequently slip through. Existing text chatbots are ill-suited for this task because the claim and evidence live in visual graphics, complex table layouts, and scanned documents.

---

## Solution

VisualProof AI replaces manual cross-examination with a focused, vision-native verification pipeline. Instead of a free-form chatbot, the system implements a strict dual-image evaluation model:

1. **Ingest Claim Graphic**: Reads the headline, quoted metric, or marketing statement.
2. **Ingest Evidence Document**: Inspects data tables, baseline values, and audited figures.
3. **Multimodal Reasoning**: Leverages Gemma 4's spatial vision and reasoning capabilities to calculate exact mathematical deltas and check logical consistency.
4. **Structured Output**: Emits an objective verdict with key findings, side-by-side comparison, and confidence assessment.

---

## How Gemma 4 is Used

Gemma 4 is the core reasoning and perception engine powering VisualProof AI:

```
┌───────────────────────────┐      ┌───────────────────────────┐
│     IMAGE 1: CLAIM        │      │    IMAGE 2: EVIDENCE      │
│  (Marketing Slide, Ad,    │      │ (Audited Report, Table,   │
│   Social Media Post)      │      │   Benchmark Graphic)      │
└─────────────┬─────────────┘      └─────────────┬─────────────┘
              │                                  │
              └────────────────┬─────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │        Google Gemini API: Gemma 4            │
        │          (Model: GEMINI_MODEL)               │
        │                                              │
        │  • Multimodal Visual Reading                 │
        │  • Spatial Table & Text OCR                  │
        │  • Numerical Delta Calculation               │
        │  • Strict Factual Boundary Check             │
        └──────────────────────┬───────────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │         Structured Verification Schema       │
        │                                              │
        │  • Verdict:                                  │
        │    - SUPPORTED                               │
        │    - PARTIALLY_SUPPORTED                     │
        │    - NOT_SUPPORTED                           │
        │    - INSUFFICIENT_EVIDENCE                   │
        │  • Claim Extracted                           │
        │  • Evidence Points Found                     │
        │  • Detailed Comparison                       │
        │  • "Why?" Plain Language Explanation         │
        │  • Numerical Breakdown & Discrepancies       │
        │  • Key Findings                              │
        │  • Missing Information                       │
        │  • Model Confidence Assessment               │
        └──────────────────────────────────────────────┘
```

### Strict Non-Sensational Guidelines
The system instruction explicitly directs Gemma 4 to:
- Ground all findings strictly in visible pixels—no ungrounded hallucinations or outside assumptions.
- Calculate exact percentage differences for numerical claims (e.g. distinguishing a 50% increase from a claimed 300% increase).
- Use neutral, objective language (never using sensational words like "fake", "fraud", or "lie").

---

## Tech Stack

- **Frontend**:
  - React 19 (TypeScript)
  - Vite
  - Tailwind CSS v4
  - Lucide React (Clean, accessible iconography)
- **Backend**:
  - Node.js & Express (TypeScript)
  - Multer (In-memory multi-part image ingestion with size/type validation)
  - Zod (Runtime validation of structured model output)
- **AI & Multimodal**:
  - Google GenAI SDK (`@google/genai`)
  - **Gemma 4** (`gemma-4-31b-it` / `gemma-4-26b-a4b-it`) accessed through the Gemini API
  - Configurable model switching via `GEMINI_MODEL`

---

## Architecture

```
[ User Browser / Client ]
  │
  ├─► Upload Claim Image (Drag & drop or file picker)
  ├─► Upload Evidence Image (Drag & drop or file picker)
  │   - Or Select 1 of 3 Pre-Seeded Interactive Demos
  │
  ├─► POST /api/analyze (multipart/form-data)
  │
[ Express Backend (server/) ]
  │
  ├─► File Validation (MIME check, 10MB limits)
  ├─► Buffer-to-Base64 Image Encoding
  ├─► Dispatch to Google GenAI SDK
  │     └─► Model: process.env.GEMINI_MODEL || "gemma-4-31b-it"
  │     └─► Structured System Prompt & JSON Enforcement
  │
[ Gemma 4 (Gemini API) ]
  │
  ├─► Multimodal token cross-attention
  ├─► Emits structured JSON matching AnalysisResultSchema
  │
[ Express Backend ]
  │
  ├─► Zod Validation & Normalization
  ├─► Return 200 OK with Verified Analysis
  │
[ Frontend Result Dashboard ]
  │
  ├─► Top Verdict Badge (SUPPORTED / PARTIALLY / NOT / INSUFFICIENT)
  ├─► Numerical Breakdown & Visual Flow (Claimed vs Actual vs Delta)
  ├─► Extracted Claim & Evidence Cards
  ├─► Deep Comparison & "Why?" Explanation
  └─► Model Confidence Assessment
```

---

## Environment Variables

VisualProof AI keeps all sensitive credentials strictly on the backend. The frontend never receives or bundles API keys.

Create a `.env` file in the `server/` directory (or use `.env.example`):

```env
# Gemini API Key (Required for live Gemma 4 multimodal inference)
# Obtain from Google AI Studio: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# Gemma 4 Model Identifier
# Configurable to any Gemma or Gemini model supported by the hackathon organizers
# Default: gemma-4-31b-it
# Options: gemma-4-31b-it, gemma-4-26b-a4b-it, gemini-3.8-flash
GEMINI_MODEL=gemma-4-31b-it

# Server Port
PORT=5000
```

> **Note on Security**: `.env` is listed in `.gitignore` and is never committed to source control.

---

## Run Locally

### Prerequisites
- Node.js >= 18 (Tested on Node v22)
- npm >= 9

### Step 1: Clone and Install Dependencies

```bash
# In the project root (visualproof-ai):
npm run install:all
```
*(Or install manually in each folder: `cd server && npm install` then `cd ../client && npm install`)*

### Step 2: Configure Environment Variables

```bash
cp server/.env.example server/.env
# Edit server/.env and insert your GEMINI_API_KEY
```

### Step 3: Start the Backend and Frontend

Open two terminal windows:

**Terminal 1 (Backend Server):**
```bash
npm run dev:server
# Server starts on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run dev:client
# Vite client starts on http://localhost:5173 (or http://localhost:5174)
```

Visit **`http://localhost:5173`** (or the port shown by Vite) in your browser.

---

## Deploy to Render (1-Click Blueprint)

VisualProof AI is production-ready for deployment on **Render** as a single unified full-stack service:

1. Push your code or connect repo: `https://github.com/padigalaisaac-web/visualize-ai`
2. In Render, select **New +** > **Blueprint** (uses [`render.yaml`](./render.yaml)).
3. Supply your `GEMINI_API_KEY` when prompted.
4. Render automatically runs `npm run render-build` and `npm start` to serve both frontend and backend on your live domain!

See the full guide in [**`RENDER_DEPLOYMENT.md`**](./RENDER_DEPLOYMENT.md).

---

## Interactive Demo Examples

VisualProof AI includes **3 pre-seeded real-world demonstration scenarios** with generated visual artifacts:

### Example 1: The Sales Growth Exaggeration
- **Claim Graphic**: Executive Deck slide stating: *“Sales increased by 300%.”*
- **Evidence Graphic**: Audited Financial Table: *2025 Sales = ₹10 Lakh | 2026 Sales = ₹15 Lakh.*
- **Verdict**: `NOT_SUPPORTED`
- **Explanation**: The evidence documents growth from ₹10L to ₹15L, which is an increase of ₹5L (50.0%), not 300%. The claim exaggerates the actual growth by 6x.

### Example 2: The Exact Revenue Milestone
- **Claim Graphic**: Press Release banner stating: *“Revenue increased by 50%.”*
- **Evidence Graphic**: Statutory Revenue Audit: *2025: ₹10 Lakh → 2026: ₹15 Lakh (+₹5L).*
- **Verdict**: `SUPPORTED`
- **Explanation**: The audited figures show an exact increase of 50.0% over the baseline year, directly substantiating the claim.

### Example 3: The Dual Product Comparison
- **Claim Graphic**: Product ad stating: *“Our product is cheaper and lasts twice as long.”*
- **Evidence Graphic**: Consumer Lab Benchmark: *Price: Competitor $100 vs Product $80 (Cheaper) | Battery Duration: Competitor 10h vs Product 12h (+20% only).*
- **Verdict**: `PARTIALLY_SUPPORTED`
- **Explanation**: The pricing claim is confirmed ($80 < $100), but the battery duration assertion (*"lasts twice as long"*) is contradicted: the product lasts 12 hours (+20%), not the 20 hours required for 2x endurance.

---

## Fallback Demo Mode

If `GEMINI_API_KEY` is not provided or if network/quota constraints arise during a live hackathon presentation, VisualProof AI features a **transparent Demo Mode fallback**:
- Selecting any of the 3 pre-seeded examples automatically loads the visual graphics into the analyzer.
- If the live API is unreachable, the system displays the pre-verified ground truth analysis.
- Every fallback result is clearly and prominently labeled as a **`Demo result`**—we never pretend a simulated result originated from live model inference.
- When `GEMINI_API_KEY` is active, the app automatically executes live Gemma 4 multimodal inference.

---

## Hackathon Submission Details

- **Event**: Official MLH Hacktoberfest Hack Day Hyderabad
- **Challenge Category**: Best Use of Gemma 4
- **Project**: VisualProof AI
- **Tagline**: *"Does the evidence actually support the claim?"*
- **License**: Apache-2.0

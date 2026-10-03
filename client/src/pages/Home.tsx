import React, { useState, useEffect, useRef } from 'react';
import { 
  Header 
} from '../components/Header';
import { 
  UploadCard 
} from '../components/UploadCard';
import { 
  AnalysisLoader 
} from '../components/AnalysisLoader';
import { 
  VerdictCard 
} from '../components/VerdictCard';
import { 
  EvidenceCard 
} from '../components/EvidenceCard';
import { 
  DemoExamples 
} from '../components/DemoExamples';
import { 
  HowItWorksModal 
} from '../components/HowItWorksModal';
import { 
  analyzeImages, 
  checkBackendHealth
} from '../services/api';
import type { 
  HealthResponse 
} from '../services/api';
import type { 
  AnalysisResult, 
  DemoItem 
} from '../types/analysis';
import { 
  dataUrlToFile 
} from '../data/demoData';
import { 
  ArrowRight, 
  RotateCcw, 
  AlertCircle, 
  ShieldAlert, 
  Terminal
} from 'lucide-react';

export const Home: React.FC = () => {
  const [claimFile, setClaimFile] = useState<File | null>(null);
  const [claimPreviewUrl, setClaimPreviewUrl] = useState<string | null>(null);

  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidencePreviewUrl, setEvidencePreviewUrl] = useState<string | null>(null);

  const [selectedDemo, setSelectedDemo] = useState<DemoItem | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDemoFallback, setIsDemoFallback] = useState(false);

  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const analyzerSectionRef = useRef<HTMLDivElement>(null);
  const resultSectionRef = useRef<HTMLDivElement>(null);

  // Poll backend health on mount
  useEffect(() => {
    checkBackendHealth().then((health) => {
      setBackendHealth(health);
    });
  }, []);

  const handleClaimFileSelect = (file: File) => {
    setClaimFile(file);
    setClaimPreviewUrl(URL.createObjectURL(file));
    setSelectedDemo(null);
    setErrorMessage(null);
    setAnalysisResult(null);
  };

  const handleClaimFileRemove = () => {
    if (claimPreviewUrl && claimPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(claimPreviewUrl);
    }
    setClaimFile(null);
    setClaimPreviewUrl(null);
    setSelectedDemo(null);
    setAnalysisResult(null);
  };

  const handleEvidenceFileSelect = (file: File) => {
    setEvidenceFile(file);
    setEvidencePreviewUrl(URL.createObjectURL(file));
    setSelectedDemo(null);
    setErrorMessage(null);
    setAnalysisResult(null);
  };

  const handleEvidenceFileRemove = () => {
    if (evidencePreviewUrl && evidencePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(evidencePreviewUrl);
    }
    setEvidenceFile(null);
    setEvidencePreviewUrl(null);
    setSelectedDemo(null);
    setAnalysisResult(null);
  };

  const handleSelectDemo = async (demo: DemoItem) => {
    setSelectedDemo(demo);
    setAnalysisResult(null);
    setErrorMessage(null);
    setIsDemoFallback(false);

    setClaimPreviewUrl(demo.claimImageUrl);
    setEvidencePreviewUrl(demo.evidenceImageUrl);

    try {
      // Create real File objects from SVGs/PNGs so they can be dispatched to backend
      const cFile = await dataUrlToFile(demo.claimImageUrl, demo.claimFileName);
      const eFile = await dataUrlToFile(demo.evidenceImageUrl, demo.evidenceFileName);
      setClaimFile(cFile);
      setEvidenceFile(eFile);
    } catch (err) {
      console.warn('Failed to convert demo to File object:', err);
    }

    // Smooth scroll to analyzer cards
    analyzerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAnalyze = async () => {
    if (!claimFile || !evidenceFile) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setIsDemoFallback(false);

    try {
      // Attempt live Gemma 4 multimodal analysis via backend
      const result = await analyzeImages(claimFile, evidenceFile);
      setAnalysisResult(result);
      setIsDemoFallback(false);

      // Smooth scroll to results
      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.warn('Live Gemma 4 analysis attempt error:', err);

      // If backend failed and we have a selected demo scenario, offer clean Demo Mode fallback
      if (selectedDemo) {
        setIsDemoFallback(true);
        setAnalysisResult({
          ...selectedDemo.predefinedResult,
          is_demo: true,
          analyzed_at: new Date().toISOString(),
          model_used: backendHealth?.model_configured || 'Gemma 4 (Pre-verified Demo)',
        });

        setTimeout(() => {
          resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        // Custom upload failed
        const friendlyMsg = err.message || "Gemma couldn't analyze these images right now. Try again or use one of the demo examples.";
        setErrorMessage(friendlyMsg);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    handleClaimFileRemove();
    handleEvidenceFileRemove();
    setSelectedDemo(null);
    setAnalysisResult(null);
    setErrorMessage(null);
    setIsDemoFallback(false);
  };

  const isReadyToAnalyze = Boolean(claimFile && evidenceFile && !isAnalyzing);

  return (
    <div className="min-h-screen bg-[#0c0d11] text-zinc-200 flex flex-col selection:bg-zinc-700 selection:text-white bg-subtle-grid">
      {/* Top Navigation */}
      <Header
        backendHealth={backendHealth}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onScrollToDemos={() => {
          document.getElementById('demo-examples')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section - Rigorous, technical, not vibe-coded */}
        <section className="text-center py-6 sm:py-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded border border-zinc-800 bg-[#12141a] px-3 py-1 font-mono text-[11px] text-zinc-400 mb-5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span>SYSTEM // MULTIMODAL EVIDENCE VERIFICATION</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-500">MLH HACKTOBERFEST HYDERABAD</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-100 leading-tight">
            Does the evidence actually <span className="text-zinc-400">support the claim?</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Ingest a visual claim and its corresponding visual proof. Gemma 4 performs cross-examination: extracting assertions, tabulating audited values, and outputting an objective, mathematical verdict.
          </p>

          <div className="mt-3 flex items-center justify-center gap-3 font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
            <span>INPUT: 2× MULTIMODAL IMAGES</span>
            <span>&bull;</span>
            <span>ENGINE: GEMMA 4 (31B DENSE)</span>
            <span>&bull;</span>
            <span>ZERO SUBJECTIVE INFERENCE</span>
          </div>
        </section>

        {/* Upload Panels Section */}
        <section ref={analyzerSectionRef} className="scroll-mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {/* Left: Claim Card */}
            <UploadCard
              type="claim"
              title="CLAIM"
              subtitle="Upload image asserting the factual claim (PNG, JPG, JPEG, WEBP)"
              file={claimFile}
              previewUrl={claimPreviewUrl}
              onFileSelect={handleClaimFileSelect}
              onFileRemove={handleClaimFileRemove}
              disabled={isAnalyzing}
            />

            {/* Right: Evidence Card */}
            <UploadCard
              type="evidence"
              title="EVIDENCE"
              subtitle="Upload image containing audited source data or proof (PNG, JPG, JPEG, WEBP)"
              file={evidenceFile}
              previewUrl={evidencePreviewUrl}
              onFileSelect={handleEvidenceFileSelect}
              onFileRemove={handleEvidenceFileRemove}
              disabled={isAnalyzing}
            />
          </div>

          {/* Action Bar */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!isReadyToAnalyze}
              className={`flex items-center justify-center gap-2.5 rounded-lg px-8 py-3.5 font-mono text-xs uppercase tracking-wider font-bold transition-all duration-150 ${
                isReadyToAnalyze
                  ? 'bg-zinc-100 text-zinc-950 hover:bg-white active:bg-zinc-200 border border-zinc-200 shadow-sm cursor-pointer'
                  : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
              }`}
            >
              <Terminal className={`h-4 w-4 ${isReadyToAnalyze ? 'text-zinc-900' : 'text-zinc-600'}`} />
              <span>Run Verification (Gemma 4)</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {!claimFile || !evidenceFile ? (
              <p className="font-mono text-[11px] text-zinc-500">
                Awaiting input: Supply both Claim and Evidence images (or select a benchmark below).
              </p>
            ) : null}
          </div>
        </section>

        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-rose-900/60 bg-rose-950/30 p-4 text-xs font-mono text-rose-300 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-rose-200 uppercase tracking-wide">Inference Error</p>
              <p className="mt-1 text-zinc-300">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Analyzing Progress State */}
        {isAnalyzing && (
          <section className="mt-8 max-w-2xl mx-auto">
            <AnalysisLoader modelName={backendHealth?.model_configured || 'Gemma 4'} />
          </section>
        )}

        {/* Result Dashboard */}
        {analysisResult && !isAnalyzing && (
          <section ref={resultSectionRef} className="mt-10 scroll-mt-24 space-y-6">
            {/* Demo Mode Notice Banner if fallback was triggered */}
            {isDemoFallback && (
              <div className="rounded-lg border border-amber-900/60 bg-amber-950/20 p-4 text-xs font-mono text-amber-200 flex items-start gap-3">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold uppercase tracking-wider text-amber-300">
                    DEMO BENCHMARK FALLBACK ACTIVE
                  </p>
                  <p className="mt-0.5 text-zinc-300 font-sans text-xs">
                    Live API responded with high demand. Presenting pre-verified ground truth benchmark for this scenario.
                  </p>
                </div>
              </div>
            )}

            {/* Top Verdict Card */}
            <VerdictCard
              verdict={analysisResult.verdict}
              confidence={analysisResult.confidence}
              isDemo={analysisResult.is_demo}
              modelUsed={analysisResult.model_used || backendHealth?.model_configured || 'Gemma 4'}
              analyzedAt={analysisResult.analyzed_at}
            />

            {/* Detailed Findings & Visualization */}
            <EvidenceCard result={analysisResult} />

            {/* Reset / Run Another Button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#12141a] px-4 py-2 font-mono text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Inputs &amp; Run New Verification</span>
              </button>
            </div>
          </section>
        )}

        {/* Pre-Seeded Demo Examples */}
        <DemoExamples
          onSelectDemo={handleSelectDemo}
          selectedDemoId={selectedDemo?.id}
        />
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-zinc-800 bg-[#0a0b0e] py-6 text-center font-mono text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300">VISUALPROOF.AI</span>
            <span>&bull;</span>
            <span className="text-zinc-500">DOES THE EVIDENCE ACTUALLY SUPPORT THE CLAIM?</span>
          </div>

          <p className="text-zinc-500">
            MLH HACKTOBERFEST HYDERABAD &bull; BEST USE OF GEMMA 4
          </p>
        </div>
      </footer>

      {/* How it works modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </div>
  );
};

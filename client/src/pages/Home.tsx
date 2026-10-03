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
  Sparkles, 
  RotateCcw, 
  AlertCircle, 
  ShieldAlert, 
  Cpu
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
      // Create real File objects from SVGs so they can be dispatched to the backend
      const cFile = await dataUrlToFile(demo.claimImageUrl, demo.claimFileName);
      const eFile = await dataUrlToFile(demo.evidenceImageUrl, demo.evidenceFileName);
      setClaimFile(cFile);
      setEvidenceFile(eFile);
    } catch (err) {
      console.warn('Failed to convert demo SVG to File object:', err);
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
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Header
        backendHealth={backendHealth}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onScrollToDemos={() => {
          document.getElementById('demo-examples')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center py-8 sm:py-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-6 shadow-sm shadow-indigo-500/10">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>MLH Hacktoberfest Hack Day Hyderabad &bull; Best Use of Gemma 4</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight sm:leading-none">
            Does the evidence actually{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              support the claim?
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Upload a claim and its visual evidence. Gemma 4 analyzes both images, extracts facts, compares numbers, and explains what the evidence really shows.
          </p>

          <p className="mt-2 text-xs uppercase tracking-widest text-slate-500 font-mono">
            Multimodal Evidence Analysis &bull; Zero Guesswork
          </p>
        </section>

        {/* Upload Panels Section */}
        <section ref={analyzerSectionRef} className="scroll-mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Left: Claim Card */}
            <UploadCard
              type="claim"
              title="CLAIM"
              subtitle="Upload the image containing the claim (PNG, JPG, JPEG, WEBP)"
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
              subtitle="Upload the image containing supporting evidence (PNG, JPG, JPEG, WEBP)"
              file={evidenceFile}
              previewUrl={evidencePreviewUrl}
              onFileSelect={handleEvidenceFileSelect}
              onFileRemove={handleEvidenceFileRemove}
              disabled={isAnalyzing}
            />
          </div>

          {/* Action Bar */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            <button
              onClick={handleAnalyze}
              disabled={!isReadyToAnalyze}
              className={`group relative flex items-center justify-center gap-3 rounded-2xl px-10 py-4 text-base font-bold tracking-tight shadow-xl transition-all duration-200 ${
                isReadyToAnalyze
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:opacity-95 hover:shadow-indigo-500/25 hover:scale-[1.02] cursor-pointer'
                  : 'bg-slate-800/80 text-slate-500 border border-white/5 cursor-not-allowed'
              }`}
            >
              <Cpu className={`h-5 w-5 ${isReadyToAnalyze ? 'text-indigo-200' : 'text-slate-600'}`} />
              <span>Check with Gemma 4</span>
              <ArrowRight className={`h-5 w-5 transition-transform ${isReadyToAnalyze ? 'group-hover:translate-x-1' : ''}`} />
            </button>

            {!claimFile || !evidenceFile ? (
              <p className="text-xs text-slate-500">
                Please upload both a Claim image and an Evidence image (or pick an example below) to run verification.
              </p>
            ) : null}
          </div>
        </section>

        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-rose-500/30 bg-rose-950/40 p-4 text-sm text-rose-300 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-rose-200">Analysis Error</p>
              <p className="mt-0.5 text-xs text-rose-300">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Analyzing Progress State */}
        {isAnalyzing && (
          <section className="mt-10 max-w-3xl mx-auto">
            <AnalysisLoader modelName={backendHealth?.model_configured || 'Gemma 4'} />
          </section>
        )}

        {/* Result Dashboard */}
        {analysisResult && !isAnalyzing && (
          <section ref={resultSectionRef} className="mt-12 scroll-mt-24 space-y-8">
            {/* Demo Mode Notice Banner if fallback was triggered */}
            {isDemoFallback && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-4 text-xs text-amber-200 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold uppercase tracking-wider text-amber-300">
                    Demo Mode Fallback Active
                  </p>
                  <p className="mt-0.5">
                    Live Gemini API was unavailable or GEMINI_API_KEY was not configured. This result is clearly labeled as a <span className="font-bold underline">Demo result</span> based on pre-verified ground truth for this scenario.
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
            <div className="flex justify-center pt-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Verify Another Claim</span>
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
      <footer className="mt-20 border-t border-white/10 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">VisualProof AI</span>
            <span>&bull;</span>
            <span>Does the evidence actually support the claim?</span>
          </div>

          <p className="text-slate-500">
            Built for MLH Hacktoberfest Hack Day Hyderabad &bull; Powered by Gemma 4 via Gemini API
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

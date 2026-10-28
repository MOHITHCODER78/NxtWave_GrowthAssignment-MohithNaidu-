import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Target, 
  Cpu, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { 
  ProjectEvolutionResult, 
  EvolutionTrack, 
  EvolutionPath 
} from '@/types';
import { 
  generateProjectEvolution, 
  ProjectAnalysisInput 
} from '@/engine/domainMatrix';

interface EvolutionEngineProps {
  onSelectProjectForWorkshop: (projectTitle: string, trackTitle: string) => void;
  onOpenWorkshopModal: () => void;
  onGenerateCommitCard?: (originalProject: string, path: EvolutionPath, domain: string) => void;
}

const BEGINNER_INTERESTS = [
  'Web Apps with AI & Semantic Search',
  'Campus & Student Operations Portals',
  'Data Analytics & Prediction Pipelines',
  'Environmental & Weather Intelligence',
  'Mobile & Offline-First Apps',
  'IoT & Sensor Telemetry',
  'Fintech & Group Split Calculations',
];

export const EvolutionEngine: React.FC<EvolutionEngineProps> = ({
  onSelectProjectForWorkshop,
  onOpenWorkshopModal,
  onGenerateCommitCard,
}) => {
  const [mode, setMode] = useState<'existing' | 'beginner'>('existing');

  // Form State (Existing project)
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [techStack, setTechStack] = useState('');

  // Form State (Beginner)
  const [beginnerInterest, setBeginnerInterest] = useState(BEGINNER_INTERESTS[0]);
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate'>('Beginner');

  // UI Flow States
  const [validationError, setValidationError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<ProjectEvolutionResult | null>(null);
  const [activeTrack, setActiveTrack] = useState<EvolutionTrack>('upgrade');
  const [selectedTrack, setSelectedTrack] = useState<EvolutionTrack>('upgrade');

  const loadingSteps = [
    'Analyzing domain keywords and technical scope...',
    'Synthesizing Upgrade, Transform, and Differentiate tracks...',
    'Building realistic four-phase, 60-minute starter milestones...',
  ];

  // Quick Presets
  const applyPreset = (title: string, desc: string, stack: string) => {
    setMode('existing');
    setProjectTitle(title);
    setProjectDescription(desc);
    setTechStack(stack);
    setValidationError('');
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (mode === 'existing') {
      if (!projectTitle.trim()) {
        setValidationError('Please enter a project name.');
        return;
      }
      if (projectTitle.trim().length < 3) {
        setValidationError('Project name should be at least 3 characters.');
        return;
      }
    }

    setIsAnalyzing(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    setTimeout(() => {
      clearInterval(stepInterval);
      const input: ProjectAnalysisInput =
        mode === 'existing'
          ? {
              mode: 'existing',
              projectTitle: projectTitle.trim(),
              projectDescription: projectDescription.trim(),
              techStack: techStack.trim(),
            }
          : {
              mode: 'beginner',
              beginnerInterest,
              skillLevel,
            };

      const evolutionResult = generateProjectEvolution(input);
      setResult(evolutionResult);
      setActiveTrack('upgrade');
      setSelectedTrack('upgrade');
      setIsAnalyzing(false);
    }, 1400);
  };

  const handleReset = () => {
    setResult(null);
    setValidationError('');
    setActiveTrack('upgrade');
    setSelectedTrack('upgrade');
  };

  const currentPath: EvolutionPath | null = result
    ? result.paths[activeTrack]
    : null;

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header & Vision */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Project Evolution Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Give your project an AI direction worth building.
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Input your existing college project or pick an area you want to explore. 
          We'll generate three distinct paths—each with a realistic 60-minute starter scope.
        </p>
      </div>

      {/* 1. INPUT FORM (If no result yet) */}
      {!result && !isAnalyzing && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#121215] p-6 sm:p-8 space-y-6 shadow-card-glow animate-in fade-in duration-200">
          {/* Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-zinc-800 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Choose Entry Path:
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setMode('existing');
                  setValidationError('');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-center ${
                  mode === 'existing'
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                I have an existing project
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('beginner');
                  setValidationError('');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-center ${
                  mode === 'beginner'
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                I'm starting from scratch
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs text-zinc-400">Try popular student presets:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  applyPreset(
                    'Weather App',
                    'A frontend weather dashboard showing city temperature and humidity.',
                    'React + OpenWeather API'
                  )
                }
                className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:border-emerald-500/40 hover:text-white transition-colors cursor-pointer"
              >
                Weather App
              </button>
              <button
                type="button"
                onClick={() =>
                  applyPreset(
                    'College Attendance Tracker',
                    'Tracks student attendance records across semester courses.',
                    'React + Node.js + SQL'
                  )
                }
                className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:border-emerald-500/40 hover:text-white transition-colors cursor-pointer"
              >
                College Attendance Tracker
              </button>
              <button
                type="button"
                onClick={() =>
                  applyPreset(
                    'Developer Portfolio & Blog',
                    'Personal portfolio displaying projects, skills, and resume.',
                    'Next.js + Tailwind CSS'
                  )
                }
                className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:border-emerald-500/40 hover:text-white transition-colors cursor-pointer"
              >
                Developer Portfolio
              </button>
              <button
                type="button"
                onClick={() =>
                  applyPreset(
                    'Hostel Food Ordering App',
                    'Campus cafeteria menu and ordering cart for hostel rooms.',
                    'MERN Stack'
                  )
                }
                className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:border-emerald-500/40 hover:text-white transition-colors cursor-pointer"
              >
                Hostel Food Ordering
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAnalyze} className="space-y-5">
            {validationError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400 animate-in fade-in-50 duration-150">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {mode === 'existing' ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Project Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Weather App, Campus Attendance Tracker, E-Commerce Store"
                    value={projectTitle}
                    onChange={(e) => {
                      setProjectTitle(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    What does it currently do? (Brief summary)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Fetches temperature from an API and displays daily forecasts on a card..."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80 leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Technology Stack (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Python, Node.js, SQL, Arduino"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    What area do you want to build in?
                  </label>
                  <select
                    value={beginnerInterest}
                    onChange={(e) => setBeginnerInterest(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80"
                  >
                    {BEGINNER_INTERESTS.map((item, idx) => (
                      <option key={idx} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Your Current Experience Level
                  </label>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setSkillLevel('Beginner')}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        skillLevel === 'Beginner'
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-xs font-semibold block">Beginner</span>
                      <span className="text-[11px] text-zinc-500 block mt-0.5">
                        Know basic HTML, CSS or Python. First time building with AI.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSkillLevel('Intermediate')}
                      className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                        skillLevel === 'Intermediate'
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-xs font-semibold block">Intermediate</span>
                      <span className="text-[11px] text-zinc-500 block mt-0.5">
                        Built full-stack or frontend apps. Ready for vector search & APIs.
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="glow"
                size="lg"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Generate Project Evolution Paths
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 2. LOADING STATE */}
      {isAnalyzing && (
        <div className="p-12 rounded-2xl border border-white/[0.08] bg-[#121215] text-center space-y-6 max-w-xl mx-auto shadow-card-glow animate-in fade-in duration-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
            <Compass className="w-8 h-8 animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">
              Synthesizing Evolution Paths
            </h3>
            <p className="text-xs text-emerald-400 font-mono">
              {loadingSteps[loadingStep]}
            </p>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* 3. RESULTS DISPLAY */}
      {result && currentPath && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          {/* Top Bar: Analyzed Project & Reset */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">
                  Base Project:
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {result.domain}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {result.originalProject}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Try another project
              </Button>
            </div>
          </div>

          {/* 3 Track Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Upgrade Card */}
            <div
              onClick={() => setActiveTrack('upgrade')}
              className={`p-5 rounded-xl border transition-all cursor-pointer space-y-2 text-left relative ${
                activeTrack === 'upgrade'
                  ? 'bg-zinc-900 border-emerald-500/60 shadow-subtle-emerald'
                  : 'bg-[#121215] border-white/[0.08] hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge variant="emerald" size="sm" dot>
                  1. Upgrade Track
                </Badge>
                {selectedTrack === 'upgrade' && (
                  <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    Selected
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white line-clamp-1">
                {result.paths.upgrade.title}
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2">
                {result.paths.upgrade.tagline}
              </p>
            </div>

            {/* Transform Card */}
            <div
              onClick={() => setActiveTrack('transform')}
              className={`p-5 rounded-xl border transition-all cursor-pointer space-y-2 text-left relative ${
                activeTrack === 'transform'
                  ? 'bg-zinc-900 border-cyan-500/60 shadow-subtle-cyan'
                  : 'bg-[#121215] border-white/[0.08] hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge variant="cyan" size="sm" dot>
                  2. Transform Track
                </Badge>
                {selectedTrack === 'transform' && (
                  <span className="text-[10px] font-mono font-semibold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                    Selected
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white line-clamp-1">
                {result.paths.transform.title}
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2">
                {result.paths.transform.tagline}
              </p>
            </div>

            {/* Differentiate Card */}
            <div
              onClick={() => setActiveTrack('differentiate')}
              className={`p-5 rounded-xl border transition-all cursor-pointer space-y-2 text-left relative ${
                activeTrack === 'differentiate'
                  ? 'bg-zinc-900 border-purple-500/60 shadow-md shadow-purple-500/10'
                  : 'bg-[#121215] border-white/[0.08] hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge variant="purple" size="sm" dot>
                  3. Differentiate Track
                </Badge>
                {selectedTrack === 'differentiate' && (
                  <span className="text-[10px] font-mono font-semibold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                    Selected
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white line-clamp-1">
                {result.paths.differentiate.title}
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2">
                {result.paths.differentiate.tagline}
              </p>
            </div>
          </div>

          {/* Detailed Direction View */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#121215] p-6 sm:p-8 space-y-8 shadow-card-glow">
            {/* Direction Title Bar */}
            <div className="space-y-2 pb-6 border-b border-zinc-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge
                  variant={
                    currentPath.track === 'upgrade'
                      ? 'emerald'
                      : currentPath.track === 'transform'
                      ? 'cyan'
                      : 'purple'
                  }
                  size="md"
                  dot
                >
                  {currentPath.badgeLabel}
                </Badge>
                <span className="text-xs text-zinc-400 font-mono">
                  Level: {currentPath.difficulty}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {currentPath.title}
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
                {currentPath.overview}
              </p>
            </div>

            {/* Four Concrete Requirements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                <span className="text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  Problem Solved
                </span>
                <p className="text-zinc-300 leading-relaxed">
                  {currentPath.problemSolved}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                <span className="text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Target User & Use Case
                </span>
                <p className="text-zinc-300 leading-relaxed">
                  {currentPath.targetUser}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                <span className="text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  Specific AI Capability
                </span>
                <p className="text-zinc-300 leading-relaxed font-mono">
                  {currentPath.specificAiCapability}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                <span className="text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  Why This Direction Matters
                </span>
                <p className="text-zinc-300 leading-relaxed">
                  {currentPath.whyUseful}
                </p>
              </div>
            </div>

            {/* Recommended Stack */}
            <div className="space-y-2">
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">
                Recommended Technology Stack
              </span>
              <div className="flex flex-wrap gap-2">
                {currentPath.recommendedStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Four 15-Minute Sprints (60-Minute Starter Scope) */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>60-Minute Starter Plan (Four 15-Minute Sprints)</span>
                  </h4>
                  <p className="text-xs text-zinc-500">
                    A realistic starter scope to unblock your project and launch in the free workshop.
                  </p>
                </div>
                <Badge variant="emerald" size="sm">
                  4x Sprints
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPath.sixtyMinuteStarterPlan.map((sprint, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2.5 relative hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {sprint.minuteRange}
                      </span>
                      <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">
                        {sprint.focusArea}
                      </span>
                    </div>

                    <h5 className="text-sm font-semibold text-zinc-100">
                      {sprint.milestoneTitle}
                    </h5>

                    <ul className="space-y-1 text-xs text-zinc-400 pl-4 list-disc">
                      {sprint.actionableSteps.map((step, sIdx) => (
                        <li key={sIdx} className="leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-start gap-1.5">
                      <span className="font-semibold text-zinc-300 shrink-0">Deliverable:</span>
                      <span className="text-zinc-400 font-mono text-[11px]">
                        {sprint.deliverable}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selection & Next Action Bar */}
            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant={selectedTrack === activeTrack ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => setSelectedTrack(activeTrack)}
                  leftIcon={
                    selectedTrack === activeTrack ? (
                      <CheckCircle2 className="w-4 h-4 text-zinc-950" />
                    ) : undefined
                  }
                >
                  {selectedTrack === activeTrack
                    ? 'Direction Selected'
                    : 'Select this direction'}
                </Button>
                <span className="text-xs text-zinc-500 hidden sm:inline">
                  {currentPath.nextAction}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    onGenerateCommitCard?.(
                      result.originalProject,
                      currentPath,
                      result.domain
                    );
                  }}
                  leftIcon={<Sparkles className="w-4 h-4 text-emerald-400" />}
                >
                  Generate Commit Card
                </Button>
                <Button
                  variant="glow"
                  size="md"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    onSelectProjectForWorkshop(
                      result.originalProject,
                      currentPath.title
                    );
                    onOpenWorkshopModal();
                  }}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Register for workshop
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

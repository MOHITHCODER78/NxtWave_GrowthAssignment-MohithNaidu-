import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { 
  ArrowRight, 
  GitFork, 
  Award, 
  ArrowUpRight,
  Check,
  CheckCircle2
} from 'lucide-react';
import { ActiveTab } from '@/types';

interface LandingPageProps {
  onOpenWorkshopModal: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

interface ProjectPreset {
  id: string;
  name: string;
  category: string;
  originalTech: string;
  upgrade: {
    title: string;
    description: string;
    stack: string[];
    starterAction: string;
  };
  transform: {
    title: string;
    description: string;
    stack: string[];
    starterAction: string;
  };
  differentiate: {
    title: string;
    description: string;
    stack: string[];
    starterAction: string;
  };
}

const PRESET_PROJECTS: ProjectPreset[] = [
  {
    id: 'attendance',
    name: 'Campus Attendance Tracker',
    category: 'Full-Stack Web',
    originalTech: 'React + Node.js + SQL',
    upgrade: {
      title: 'Smart Anomaly & Leave Pattern Detector',
      description: 'Add automated pattern detection that flags uncharacteristic attendance drops before exams.',
      stack: ['Python Microservice', 'Pandas', 'Z-Score Analytics'],
      starterAction: 'Write an endpoint computing rolling absence standard deviations on existing records.',
    },
    transform: {
      title: 'Voice-Logged Lecture Digest Assistant',
      description: 'Use the same student authentication layer to record and transcribe lecture audio into searchable notes.',
      stack: ['Whisper API / Open Whisper', 'Vector Search', 'FastAPI'],
      starterAction: 'Connect a free transcription endpoint and store speaker-tagged note snippets.',
    },
    differentiate: {
      title: 'On-Device Private Face Verification',
      description: 'Run face recognition completely inside the browser using WebAssembly and client-side weights without storing student photos on servers.',
      stack: ['TensorFlow.js', 'WebAssembly', 'IndexedDB'],
      starterAction: 'Scaffold TF.js Blazeface model inside the React client component.',
    },
  },
  {
    id: 'ecommerce',
    name: 'College Marketplace / Food App',
    category: 'MERN / Mobile',
    originalTech: 'Next.js + MongoDB + Stripe',
    upgrade: {
      title: 'Semantic Natural Language Search',
      description: 'Replace rigid SQL LIKE or keyword filters with meaning-based search so students can search "something warm under ₹100".',
      stack: ['Embedding Model', 'Supabase pgvector', 'Next.js API'],
      starterAction: 'Generate 384-dim vector embeddings for catalog items and query with cosine distance.',
    },
    transform: {
      title: 'Group Order Expense & Negotiation Co-pilot',
      description: 'Turn individual shopping into a group coordination tool that splits dishes automatically and summarizes order changes in real time.',
      stack: ['WebSocket / Supabase Realtime', 'Rule Synthesizer'],
      starterAction: 'Wire a collaborative order room with instant bill-splitting arithmetic.',
    },
    differentiate: {
      title: 'Demand Prediction & Zero-Waste Inventory Estimator',
      description: 'Analyze order timestamps across campus hostels to forecast ingredient requirements for college cafeteria stalls.',
      stack: ['Prophet / Scikit-Learn', 'FastAPI', 'Chart.js'],
      starterAction: 'Train a lightweight regression model on historical order hourly volume.',
    },
  },
  {
    id: 'portfolio',
    name: 'Personal Developer Portfolio & Blog',
    category: 'Frontend Web',
    originalTech: 'React + Tailwind + Markdown',
    upgrade: {
      title: 'Semantic Project Search & Interactive AI Q&A',
      description: 'Allow recruiters to ask natural questions about your projects and receive answers cited from your actual code repositories.',
      stack: ['LangChain / Simple Embeddings', 'GitHub API', 'React'],
      starterAction: 'Scaffold a project retrieval endpoint that reads your GitHub repo README files.',
    },
    transform: {
      title: 'Automated Code Review & Case Study Generator',
      description: 'Repurpose your portfolio UI to let peers paste snippet URLs and generate structured architecture breakdowns.',
      stack: ['Free Gemini API / Local Ollama', 'Markdown Parser'],
      starterAction: 'Build a single-input playground that parses GitHub diffs into structured explanations.',
    },
    differentiate: {
      title: 'Edge-Rendered Interactive Architecture Sandbox',
      description: 'Embed client-side web containers that allow visitors to execute and benchmark your algorithms live in the browser without backend hosting.',
      stack: ['WebContainers API', 'Web Workers', 'Tailwind'],
      starterAction: 'Configure WebWorker execution sandbox for client-side JavaScript benchmarking.',
    },
  },
  {
    id: 'weather',
    name: 'Weather & Air Quality Dashboard',
    category: 'API Integration',
    originalTech: 'JavaScript + OpenWeather API',
    upgrade: {
      title: 'Intelligent Health Recommendation Engine',
      description: 'Translate raw AQI and humidity figures into actionable outdoor exercise and health guidance tailored to student schedules.',
      stack: ['OpenWeather API', 'Heuristic Decision Tree', 'React'],
      starterAction: 'Create rule-based health matrices mapped against WHO AQI benchmark bands.',
    },
    transform: {
      title: 'Campus Microclimate Crowdsourcing Tool',
      description: 'Transform a single-city dashboard into a student-contributed map of temperature and study space comfort across campus blocks.',
      stack: ['Leaflet.js', 'Supabase Realtime', 'Tailwind'],
      starterAction: 'Implement geolocated pin-dropping for student temperature comfort ratings.',
    },
    differentiate: {
      title: 'Edge Anomaly Forecast for Local Sensor Clusters',
      description: 'Process raw serial data from Arduino/ESP32 air sensors using edge ML inference directly in the browser dashboard.',
      stack: ['Web Serial API', 'TinyML / TF.js', 'React'],
      starterAction: 'Read serial input via Web Serial API and run real-time threshold scoring.',
    },
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenWorkshopModal,
  onNavigateTab,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('attendance');
  const [activeDirectionTab, setActiveDirectionTab] = useState<'upgrade' | 'transform' | 'differentiate'>('upgrade');

  const selectedPreset = PRESET_PROJECTS.find((p) => p.id === selectedPresetId) || PRESET_PROJECTS[0];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-24 md:space-y-32">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 pb-4 text-center max-w-4xl mx-auto space-y-6">
        {/* Subtle background glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono tracking-widest uppercase text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          FOR ENGINEERING STUDENTS WHO WANT TO BUILD
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Your project works.{' '}
          <span className="gradient-text-emerald block sm:inline">
            Now make it worth talking about.
          </span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Built another weather app, chatbot or college project? Find a practical way to make it more interesting with AI—and figure out what you can actually build next.
        </p>

        {/* CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => onNavigateTab('evolution')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Find my project upgrade
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => scrollToSection('workshop-section')}
          >
            See how the workshop works
          </Button>
        </div>

        {/* Supporting Line */}
        <p className="text-xs text-zinc-500 tracking-wide">
          No coding test. No perfect idea needed. Start with what you know.
        </p>
      </section>

      {/* 2. INTERACTIVE PROJECT PREVIEW SECTION */}
      <section id="explore-section" className="space-y-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Let's start with something familiar.
          </h2>
          <p className="text-sm text-zinc-400">
            Pick a project you've already built. We'll show you a few directions you could take it.
          </p>
        </div>

        {/* Project Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          {PRESET_PROJECTS.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-800 text-white border border-emerald-500/40 shadow-sm'
                    : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800/80 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <span>{preset.name}</span>
                <span className="text-[10px] text-zinc-500 ml-1.5 hidden sm:inline">
                  ({preset.category})
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive 3-Direction Display */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-white/[0.08] bg-[#121215] p-5 sm:p-8 space-y-6 shadow-card-glow">
          {/* Current Project Context Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800/80 gap-2">
            <div>
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-mono">
                Base Project
              </span>
              <h3 className="text-base sm:text-lg font-semibold text-zinc-100">
                {selectedPreset.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Baseline Tech:</span>
              <span className="font-mono text-xs px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                {selectedPreset.originalTech}
              </span>
            </div>
          </div>

          {/* Direction Switcher Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setActiveDirectionTab('upgrade')}
              className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors text-center cursor-pointer ${
                activeDirectionTab === 'upgrade'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              1. Upgrade
            </button>
            <button
              onClick={() => setActiveDirectionTab('transform')}
              className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors text-center cursor-pointer ${
                activeDirectionTab === 'transform'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              2. Transform
            </button>
            <button
              onClick={() => setActiveDirectionTab('differentiate')}
              className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors text-center cursor-pointer ${
                activeDirectionTab === 'differentiate'
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              3. Differentiate
            </button>
          </div>

          {/* Direction Content Card */}
          {activeDirectionTab === 'upgrade' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="emerald" dot>
                  Upgrade Direction
                </Badge>
                <span className="text-xs text-zinc-400 italic">
                  “Add a useful AI feature without rebuilding everything.”
                </span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  {selectedPreset.upgrade.title}
                </h4>
                <p className="text-sm text-zinc-300 mt-1 leading-relaxed">
                  {selectedPreset.upgrade.description}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  Starter Scope (First Step)
                </span>
                <p className="text-xs text-zinc-300 font-mono">
                  {selectedPreset.upgrade.starterAction}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-zinc-500">Recommended Stack:</span>
                {selectedPreset.upgrade.stack.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700/60"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeDirectionTab === 'transform' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="cyan" dot>
                  Transform Direction
                </Badge>
                <span className="text-xs text-zinc-400 italic">
                  “Take the same skills and solve a different problem.”
                </span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  {selectedPreset.transform.title}
                </h4>
                <p className="text-sm text-zinc-300 mt-1 leading-relaxed">
                  {selectedPreset.transform.description}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  Starter Scope (First Step)
                </span>
                <p className="text-xs text-zinc-300 font-mono">
                  {selectedPreset.transform.starterAction}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-zinc-500">Recommended Stack:</span>
                {selectedPreset.transform.stack.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700/60"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeDirectionTab === 'differentiate' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="purple" dot>
                  Differentiate Direction
                </Badge>
                <span className="text-xs text-zinc-400 italic">
                  “Explore a more technically ambitious direction that makes the project stand out.”
                </span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  {selectedPreset.differentiate.title}
                </h4>
                <p className="text-sm text-zinc-300 mt-1 leading-relaxed">
                  {selectedPreset.differentiate.description}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  Starter Scope (First Step)
                </span>
                <p className="text-xs text-zinc-300 font-mono">
                  {selectedPreset.differentiate.starterAction}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-zinc-500">Recommended Stack:</span>
                {selectedPreset.differentiate.stack.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700/60"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-zinc-400 text-center sm:text-left">
              Have a custom project in mind? Try your own project idea in the full engine.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab('evolution')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open Evolution Engine
            </Button>
          </div>
        </div>
      </section>

      {/* 3. WORKSHOP SECTION */}
      <section id="workshop-section" className="space-y-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="emerald" dot>
            Hands-on Masterclass
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            An hour to get started. A project you can keep building.
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            You don't need another list of project ideas. You need a place to start, a working example and enough guidance to make the first version yourself.
          </p>
        </div>

        {/* Four Workshop Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          <div className="p-5 rounded-xl border border-white/[0.08] bg-[#121215] space-y-3 relative hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-zinc-800 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-zinc-700">
                01
              </span>
              <span className="text-[11px] font-mono text-zinc-500">Sprint 1</span>
            </div>
            <h4 className="text-base font-semibold text-white">
              Get the basics running.
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Scaffold your project directory, set up your local development environment, and verify the baseline application runs locally.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/[0.08] bg-[#121215] space-y-3 relative hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-zinc-800 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center border border-zinc-700">
                02
              </span>
              <span className="text-[11px] font-mono text-zinc-500">Sprint 2</span>
            </div>
            <h4 className="text-base font-semibold text-white">
              Connect the model or AI service.
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Plug into a zero-cost model endpoint, configure request headers, and test your first raw API input and structured output.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/[0.08] bg-[#121215] space-y-3 relative hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-zinc-800 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-zinc-700">
                03
              </span>
              <span className="text-[11px] font-mono text-zinc-500">Sprint 3</span>
            </div>
            <h4 className="text-base font-semibold text-white">
              Build the main interaction.
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Wire the model outputs into your application UI so users can trigger AI actions directly from a button, form, or keyboard shortcut.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-white/[0.08] bg-[#121215] space-y-3 relative hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-zinc-800 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center border border-zinc-700">
                04
              </span>
              <span className="text-[11px] font-mono text-zinc-500">Sprint 4</span>
            </div>
            <h4 className="text-base font-semibold text-white">
              Test it and decide what to improve next.
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Stress-test edge cases, refine your prompts, commit your code to GitHub, and choose your next architecture milestone.
            </p>
          </div>
        </div>

        {/* Realistic Workshop CTA Box */}
        <div className="max-w-2xl mx-auto rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 via-zinc-900 to-zinc-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-semibold text-white">
              Ready to build along?
            </h4>
            <p className="text-xs text-zinc-400">
              Free interactive masterclass with live code walkthroughs and downloadable starter files.
            </p>
          </div>
          <Button
            variant="glow"
            size="md"
            className="shrink-0"
            onClick={onOpenWorkshopModal}
            rightIcon={<ArrowUpRight className="w-4 h-4" />}
          >
            Register for the free workshop
          </Button>
        </div>
      </section>

      {/* 4. FRIEND SHARING & FORKING SECTION */}
      <section id="how-it-works-section" className="space-y-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="cyan" dot>
            Collaboration & Forks
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Your idea doesn't have to stop with you.
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Share the direction you're exploring. Your friend can fork the idea, take it somewhere different, and compare what you both come up with.
          </p>
        </div>

        {/* Visual Forking Demonstration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Card 1: Author's Idea */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-[#121215] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs">
                  ME
                </div>
                <div>
                  <span className="text-xs font-medium text-white block">Your Original Direction</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Commit Card #7842</span>
                </div>
              </div>
              <Badge variant="emerald" size="sm">Upgrade Track</Badge>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-semibold text-zinc-100">
                Smart Lecture Digest Assistant
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Adding Whisper transcription and semantic note indexing on top of the campus portal.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span>projectpulse.live/p/alex-lecture-ai</span>
              <span className="text-emerald-400 text-xs font-semibold">Live Share Link</span>
            </div>
          </div>

          {/* Card 2: Friend's Forked Idea */}
          <div className="p-6 rounded-2xl border border-cyan-500/30 bg-[#121215] space-y-4 relative">
            <div className="absolute -top-3 right-6">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-medium flex items-center gap-1">
                <GitFork className="w-3 h-3" /> Forked by Friend
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xs">
                  RD
                </div>
                <div>
                  <span className="text-xs font-medium text-white block">Rohan's Variation</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Forked from #7842</span>
                </div>
              </div>
              <Badge variant="cyan" size="sm">Transform Track</Badge>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-semibold text-zinc-100">
                Audio Flashcard Exam Simulator
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Rohan took the same transcription pipeline, but pivoted it into active recall audio quizzes for commute studying.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Forked & compared side-by-side</span>
              <span className="text-cyan-400 font-medium">Attribution preserved</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. REFERRAL & REWARDS SECTION */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="amber" dot>
            Community Milestone Rewards
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Build together. Earn more ways to explore.
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Invite friends who want to build too. Qualifying registrations can unlock additional project blueprints through Project Credits.
          </p>
        </div>

        {/* Milestone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          <Card hover>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="zinc" size="sm">Tier 1 · 1 Referral</Badge>
                <Award className="w-4 h-4 text-zinc-400" />
              </div>
              <CardTitle className="text-base pt-2">Vector Search Blueprint</CardTitle>
              <CardDescription>
                Starter template with Supabase pgvector configuration and cosine similarity queries.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unlocks at 50 Project Credits</span>
              </div>
            </CardContent>
          </Card>

          <Card hover glow="cyan">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="cyan" size="sm">Tier 2 · 3 Referrals</Badge>
                <Award className="w-4 h-4 text-cyan-400" />
              </div>
              <CardTitle className="text-base pt-2">Local LLM & Ollama Guide</CardTitle>
              <CardDescription>
                Step-by-step setup to run free open-source models completely on your laptop without API bills.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span>Unlocks at 150 Project Credits</span>
              </div>
            </CardContent>
          </Card>

          <Card hover glow="emerald">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="emerald" size="sm">Tier 3 · 5 Referrals</Badge>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <CardTitle className="text-base pt-2">Architecture Review Checklist</CardTitle>
              <CardDescription>
                Engineering rubric to evaluate code modularity, API error resilience, and resume presentation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unlocks at 250 Project Credits</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/90 to-[#121215] p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6 shadow-card-glow">
        <div className="max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Got a project in mind? Start there.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Explore an idea, find your next step, and join the free workshop when you're ready to build.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => onNavigateTab('evolution')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Get started
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={onOpenWorkshopModal}
          >
            Register for the free workshop
          </Button>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            100% Free Masterclass
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Zero Paid API Dependencies
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Designed for Engineering Students
          </span>
        </div>
      </section>
    </div>
  );
};

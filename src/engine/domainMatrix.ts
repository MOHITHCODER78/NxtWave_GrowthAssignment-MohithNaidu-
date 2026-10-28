import { EvolutionPath, ProjectEvolutionResult } from '@/types';

export interface ProjectAnalysisInput {
  mode: 'existing' | 'beginner';
  projectTitle?: string;
  projectDescription?: string;
  techStack?: string;
  beginnerInterest?: string;
  skillLevel?: 'Beginner' | 'Intermediate';
}

type DomainKey =
  | 'weather'
  | 'attendance'
  | 'ecommerce'
  | 'portfolio'
  | 'chat'
  | 'health'
  | 'finance'
  | 'iot'
  | 'data'
  | 'mobile'
  | 'cloud'
  | 'general';

interface DomainTemplate {
  domainName: string;
  upgrade: Omit<EvolutionPath, 'id' | 'track' | 'badgeLabel'>;
  transform: Omit<EvolutionPath, 'id' | 'track' | 'badgeLabel'>;
  differentiate: Omit<EvolutionPath, 'id' | 'track' | 'badgeLabel'>;
}

const DOMAIN_TEMPLATES: Record<DomainKey, DomainTemplate> = {
  weather: {
    domainName: 'Weather & Environmental Intelligence',
    upgrade: {
      title: 'Actionable Health & Commute Advisory System',
      tagline: 'Translate raw temperature, AQI, and rain probability into contextual student activity advice.',
      overview: 'Augment the standard weather dashboard with rule-based heuristics that evaluate whether students should walk to campus, carry rain gear, or avoid outdoor sports during elevated AQI hours.',
      problemSolved: 'Raw numbers like "68% humidity, 142 AQI" are abstract. Students need actionable guidance on commuting, air quality precautions, and study routines.',
      targetUser: 'College students, daily commuters, and campus sports athletes.',
      specificAiCapability: 'Multi-variable threshold scoring + structured prompt synthesis mapped against WHO environmental safety bands.',
      whyUseful: 'Demonstrates to recruiters that you think about user utility rather than simply rendering third-party API JSON.',
      architecturalShift: 'Add an advisory processing module between the OpenWeather API response and the React frontend state.',
      recommendedStack: ['React', 'OpenWeather API', 'TypeScript', 'Tailwind CSS'],
      difficulty: 'Beginner Friendly',
      nextAction: 'Build the threshold scoring matrix in Sprint 2 of the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold API fetch & baseline card',
          focusArea: 'Environment & Setup',
          actionableSteps: [
            'Create project directory with Vite + React + TypeScript template.',
            'Add free OpenWeatherMap API key into .env file.',
            'Fetch and display city temperature, humidity, and weather condition on a simple card.',
          ],
          deliverable: 'Running client app displaying live temperature and humidity.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Build health & commute advisory matrix',
          focusArea: 'Core Logic & Intelligence',
          actionableSteps: [
            'Define a typed condition-to-action scoring matrix (e.g., AQI > 120 triggers mask warning, rain > 40% triggers commute alert).',
            'Create a utility function calculateDailyAdvisory(weatherData) returning structured recommendations.',
            'Test the advisory engine with mock edge cases (freezing, severe downpour, extreme heat).',
          ],
          deliverable: 'Pure TypeScript heuristic function producing contextual student advice.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Render interactive advice badges',
          focusArea: 'UI Integration',
          actionableSteps: [
            'Design advisory pill components with status colors (Emerald for clear, Amber for warning, Red for severe).',
            'Connect advisory state to React UI with toggleable commute and workout tabs.',
            'Add one-click refresh button to re-fetch live location weather.',
          ],
          deliverable: 'Dynamic weather dashboard featuring actionable commute guidance.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Test edge cases & outline time-series extension',
          focusArea: 'Evaluation & Next Steps',
          actionableSteps: [
            'Verify error state when an invalid city or offline network occurs.',
            'Document 3 future extension milestones (e.g. 5-day forecast trend analysis).',
            'Commit code to GitHub with clear README explaining the project upgrade.',
          ],
          deliverable: 'Tested, documented GitHub repository ready for mentor feedback.',
        },
      ],
    },
    transform: {
      title: 'Campus Agricultural & Greenhouse Microclimate Monitor',
      tagline: 'Repurpose the weather pipeline to protect campus gardens and botany department plots.',
      overview: 'Pivot your API and UI skills from generic global cities to hyper-local campus botanical needs, tracking soil moisture risk and frost alerts for college green spaces.',
      problemSolved: 'Campus gardening clubs and biology labs lose delicate plant specimens during sudden unseasonal overnight temperature drops.',
      targetUser: 'Botany students, campus gardening volunteers, and agricultural researchers.',
      specificAiCapability: 'Microclimate threshold evaluation + simulated diurnal temperature fluctuation modeling.',
      whyUseful: 'Proves versatility by solving a tangible domain problem using the same foundational frontend and API architecture.',
      architecturalShift: 'Shift data schema from city-level queries to station-specific micro-zones with historical minimum/maximum temperature tracking.',
      recommendedStack: ['Next.js / Vite', 'Open-Meteo API', 'Leaflet Maps', 'Chart.js'],
      difficulty: 'Intermediate',
      nextAction: 'Map botanical temperature threshold profiles in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Set up station data schema',
          focusArea: 'Scaffold & Schema',
          actionableSteps: [
            'Define campus microclimate zone model (Hostel quad, Botanical greenhouse, Rooftop garden).',
            'Configure Open-Meteo free solar radiation and hourly ground-level temperature endpoint.',
            'Render initial multi-zone overview layout.',
          ],
          deliverable: 'Running dashboard displaying three distinct campus monitoring points.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Integrate plant vulnerability profiles',
          focusArea: 'Domain Logic',
          actionableSteps: [
            'Create static library of 4 common campus plant species with temperature tolerances.',
            'Write comparison function that flags frost or dehydration risk when forecasts breach thresholds.',
            'Generate simulated morning dew point calculations.',
          ],
          deliverable: 'Vulnerability alert pipeline triggering automated status updates.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build zone map & alert timeline',
          focusArea: 'UI & Visualization',
          actionableSteps: [
            'Display microclimate zones as color-coded cards with risk severity pills.',
            'Add 24-hour hourly trend mini-chart for ground-level humidity.',
            'Include an "Intervention Required" badge for critical threshold violations.',
          ],
          deliverable: 'Interactive microclimate dashboard with active zone health indicators.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Validate alert accuracy & prepare hardware readiness',
          focusArea: 'Polish & Roadmap',
          actionableSteps: [
            'Test sensor failure fallback by simulating null API inputs.',
            'Outline hardware integration guide for connecting ESP32 sensors in future.',
            'Push release to GitHub with installation steps.',
          ],
          deliverable: 'Clean GitHub repo with microclimate decision documentation.',
        },
      ],
    },
    differentiate: {
      title: 'Client-Side Offline Weather Anomaly Forecaster',
      tagline: 'Run statistical anomaly detection directly inside browser memory without backend servers.',
      overview: 'Implement an in-browser statistical rolling Z-score engine that detects anomalous pressure drops or sudden temperature spikes completely on the client side using Web Workers.',
      problemSolved: 'Traditional dashboards depend entirely on cloud servers for analytics, breaking during network drops or in remote field camp conditions.',
      targetUser: 'Field researchers, outdoor trekkers, and offline-first mobile web users.',
      specificAiCapability: 'Client-side statistical anomaly detection (rolling standard deviation + Z-score deviation alerts).',
      whyUseful: 'Differentiates you by demonstrating proficiency in offline-first web architecture, client performance, and Web Workers.',
      architecturalShift: 'Offload analytical computations from the main thread into a dedicated Web Worker that operates on IndexedDB cached observations.',
      recommendedStack: ['TypeScript', 'Web Workers API', 'IndexedDB / Dexie.js', 'Canvas API'],
      difficulty: 'Advanced',
      nextAction: 'Scaffold the background worker thread during the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold Web Worker & worker bridge',
          focusArea: 'Architecture Setup',
          actionableSteps: [
            'Set up Vite project with strict TypeScript and worker thread support.',
            'Initialize offline cache using browser localStorage / IndexedDB.',
            'Send sample 100-hour historical weather telemetry dataset into worker.',
          ],
          deliverable: 'Main thread successfully passing time-series arrays to Web Worker.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement rolling Z-score detection in worker',
          focusArea: 'Analytical Engine',
          actionableSteps: [
            'Write moving average and rolling standard deviation calculator in pure TypeScript.',
            'Calculate Z-score for barometric pressure: (current - mean) / stdDev.',
            'Flag sudden barometric drops (> 2.0 std dev) indicating severe storm front arrival.',
          ],
          deliverable: 'Worker returning structured anomaly events with timestamp and confidence.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build anomaly timeline & offline status badge',
          focusArea: 'UI & Visualization',
          actionableSteps: [
            'Render anomaly events on an interactive high-contrast timeline.',
            'Add an "Offline Capable • Client Compute Active" indicator.',
            'Test offline behavior by disabling network in DevTools.',
          ],
          deliverable: 'Fully functional client UI rendering worker-detected weather anomalies.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Benchmark worker execution & document architecture',
          focusArea: 'Performance & Verification',
          actionableSteps: [
            'Measure execution latency across 10,000 synthetic data points using console.time().',
            'Verify zero UI freeze during intensive statistical calculation.',
            'Write clean GitHub README highlighting the client-side architecture.',
          ],
          deliverable: 'Production-ready GitHub project with verified sub-10ms compute benchmarks.',
        },
      ],
    },
  },

  attendance: {
    domainName: 'Academic Operations & Campus Systems',
    upgrade: {
      title: 'Smart Anomaly & Leave Pattern Detector',
      tagline: 'Automatically flag chronic absence streaks and predict attendance eligibility drops before exam cutoffs.',
      overview: 'Upgrade the standard student attendance register with statistical risk analysis that categorizes attendance health into Safe, Watchlist, and Critical cutoffs based on upcoming timetable demands.',
      problemSolved: 'Students frequently realize they have fallen below the mandatory 75% attendance threshold only a week before final exams when it is too late to rectify.',
      targetUser: 'Undergraduate students, faculty mentors, and academic department coordinators.',
      specificAiCapability: 'Deterministic trajectory projection + rolling streak anomaly calculation.',
      whyUseful: 'Solves an acute, urgent problem every college student experiences each semester.',
      architecturalShift: 'Introduce an eligibility forecasting layer that projects required attendance days needed to cross 75% or 80%.',
      recommendedStack: ['React', 'Node.js / Express', 'PostgreSQL / Supabase', 'Tailwind CSS'],
      difficulty: 'Beginner Friendly',
      nextAction: 'Code the 75% cutoff trajectory equation in Sprint 2 of the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Set up attendance data models & seed dataset',
          focusArea: 'Scaffold & Data Modeling',
          actionableSteps: [
            'Create TypeScript interface for Student, Course, and AttendanceRecord.',
            'Set up mock dataset of 5 students across 4 subjects with varying attendance percentages.',
            'Render baseline summary table showing subject attendance rates.',
          ],
          deliverable: 'Working table displaying student attendance numbers and percentage badges.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement threshold & minimum-recovery calculator',
          focusArea: 'Core Logic & Intelligence',
          actionableSteps: [
            'Write formula: calculateClassesNeededToReachTarget(present, total, targetPct = 75).',
            'Compute maximum allowable future cuts without breaching eligibility.',
            'Flag sudden 3+ day consecutive absence streaks as alert triggers.',
          ],
          deliverable: 'Tested calculation engine outputting exact recovery targets for every subject.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Render "Safe Cut" and "Danger Zone" badges',
          focusArea: 'UI Integration',
          actionableSteps: [
            'Build visual indicator showing: "You can skip 2 more classes" or "Must attend next 5 classes".',
            'Add alert banner highlighting the subject with the most urgent risk.',
            'Provide interactive slider allowing students to simulate attending future sessions.',
          ],
          deliverable: 'Interactive attendance dashboard with instant scenario simulator.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Stress-test edge cases & document student workflow',
          focusArea: 'Validation & Polish',
          actionableSteps: [
            'Test edge cases (e.g. 100% attendance, 0 classes conducted, already mathematically disqualified).',
            'Verify responsive mobile card layout so students can view status on phones.',
            'Commit to GitHub with concise problem statement and setup instructions.',
          ],
          deliverable: 'Complete, validated attendance intelligence tool on GitHub.',
        },
      ],
    },
    transform: {
      title: 'Voice-Logged Lecture Digest & Audio Flashcard Assistant',
      tagline: 'Repurpose the student portal authentication into a searchable lecture audio note repository.',
      overview: 'Transform the attendance application from simply recording "who was in the room" into capturing "what happened in the room", transcribing short teacher summaries into searchable notes.',
      problemSolved: 'Being physically present in class does not guarantee retention. Students need quick, searchable summaries of lecture topics without manual note transcription.',
      targetUser: 'College students preparing for semester midterms and campus exams.',
      specificAiCapability: 'Free Whisper API / Web Speech audio transcription + key takeaways synthesis.',
      whyUseful: 'Shifts an administrative chore into a high-value active learning tool that students will use daily.',
      architecturalShift: 'Add audio upload and Web Speech recognition pipeline connected to note-taking cards.',
      recommendedStack: ['React', 'Web Speech API / Free Whisper Endpoint', 'Tailwind CSS', 'IndexedDB'],
      difficulty: 'Intermediate',
      nextAction: 'Wire the browser Web Speech recognition hook in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold microphone capture & audio interface',
          focusArea: 'Audio Capture Scaffold',
          actionableSteps: [
            'Create voice recording button with active recording pulse animation.',
            'Initialize browser Web Speech API / MediaRecorder interface.',
            'Test microphone permission requesting and real-time audio chunk capture.',
          ],
          deliverable: 'Browser-based voice recorder capturing and storing audio blobs.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Connect transcription & note structuring',
          focusArea: 'AI Transcription Pipeline',
          actionableSteps: [
            'Pipe spoken audio directly to speech recognition stream or free transcription endpoint.',
            'Parse transcribed text into structured sections: Key Concept, Exam Hint, Homework.',
            'Handle audio errors gracefully when ambient classroom noise is high.',
          ],
          deliverable: 'Live speech converted into clean, categorized text cards.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build searchable lecture notes dashboard',
          focusArea: 'UI & Search Integration',
          actionableSteps: [
            'Render lecture cards filtered by subject (e.g. Data Structures, Operating Systems).',
            'Add search bar that highlights matching words across transcribed lecture notes.',
            'Add "Generate 3 Quick Flashcards" button with instant flip card preview.',
          ],
          deliverable: 'Subject-wise lecture review dashboard with keyword search.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Test classroom acoustics & export to markdown',
          focusArea: 'Evaluation & Export',
          actionableSteps: [
            'Add "Copy Markdown" button for pasting summaries directly into Notion or Obsidian.',
            'Validate storage persistence across browser page refreshes.',
            'Commit to GitHub with clear walkthrough video or screenshots.',
          ],
          deliverable: 'Production-ready lecture digest companion on GitHub.',
        },
      ],
    },
    differentiate: {
      title: 'Privacy-First On-Device Face Attendance Validator',
      tagline: 'Execute face detection and verification 100% inside the browser with WebAssembly without uploading photos.',
      overview: 'Differentiate your engineering portfolio by building an edge biometric verification system that runs local lightweight TensorFlow.js models right inside the client browser, guaranteeing zero photo storage on cloud servers.',
      problemSolved: 'Cloud-based facial recognition systems create severe student privacy concerns, GDPR/data liability risks, and fail when campus Wi-Fi drops.',
      targetUser: 'Universities prioritizing student data privacy, lab managers, and exam proctors.',
      specificAiCapability: 'Client-side edge face bounding-box detection & landmark inference via TensorFlow.js.',
      whyUseful: 'Massively stands out in tech interviews because it tackles real-world privacy architecture and on-device machine learning.',
      architecturalShift: 'Replace cloud verification endpoints with a client-side WebAssembly inference loop rendered on an HTML5 canvas overlay.',
      recommendedStack: ['TensorFlow.js', 'Blazeface / Face-Mesh', 'React', 'HTML5 Canvas'],
      difficulty: 'Advanced',
      nextAction: 'Mount the client webcam canvas and load the edge model in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Mount camera stream & HTML5 canvas overlay',
          focusArea: 'Video Pipeline Scaffold',
          actionableSteps: [
            'Set up React component with navigator.mediaDevices.getUserMedia video element.',
            'Position high-contrast transparent canvas directly over video feed.',
            'Install @tensorflow/tfjs and @tensorflow-models/blazeface packages.',
          ],
          deliverable: 'Live webcam stream rendering smoothly inside the dark-themed UI.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Load edge model & execute inference loop',
          focusArea: 'Client-Side Edge Inference',
          actionableSteps: [
            'Load lightweight 500KB Blazeface model asynchronously on component mount.',
            'Write requestAnimationFrame loop running model.estimateFaces(video).',
            'Extract bounding box coordinates and landmark eye/nose positions.',
          ],
          deliverable: 'Browser performing real-time face detection at 30+ FPS locally.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Draw HUD targeting box & verification state',
          focusArea: 'Visual Feedback UI',
          actionableSteps: [
            'Draw emerald targeting bounding box with smooth corner brackets on canvas.',
            'Add "Face Centered • Verified in Browser" badge when confidence exceeds 90%.',
            'Simulate instantaneous local attendance logging to IndexedDB.',
          ],
          deliverable: 'Interactive camera HUD with instant biometric confirmation.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Benchmark FPS performance & document privacy guarantee',
          focusArea: 'Verification & Portability',
          actionableSteps: [
            'Add live FPS counter and memory usage monitor in corner of viewport.',
            'Verify that zero network requests leave the browser during face detection (Network tab proof).',
            'Write README highlighting GDPR-compliance and edge computing advantages.',
          ],
          deliverable: 'Stunning, interview-ready edge AI demo on GitHub.',
        },
      ],
    },
  },

  ecommerce: {
    domainName: 'Commerce, Marketplace & Delivery Systems',
    upgrade: {
      title: 'Natural Language Semantic Catalog Search',
      tagline: 'Replace rigid keyword matching with meaning-based vector search for everyday student queries.',
      overview: 'Upgrade the standard product list so students can type natural queries like "something light for late night study" or "notebook for coding notes" and receive relevant recommendations even without exact keyword matches.',
      problemSolved: 'Traditional SQL LIKE "%query%" queries fail if users make typos, use synonyms, or describe needs rather than brand names.',
      targetUser: 'Campus marketplace buyers, late-night cafeteria ordering students.',
      specificAiCapability: 'Client-side cosine similarity on precomputed lightweight text embeddings.',
      whyUseful: 'Teaches the exact core concept behind vector databases and modern AI search engines.',
      architecturalShift: 'Add a semantic scoring layer that ranks products by vector similarity rather than lexical string equality.',
      recommendedStack: ['React', 'TypeScript', 'MiniSearch / Local Cosine Scoring', 'Tailwind CSS'],
      difficulty: 'Beginner Friendly',
      nextAction: 'Compute cosine similarity between query vectors and product vectors in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Set up catalog schema & search UI',
          focusArea: 'Scaffold & UI',
          actionableSteps: [
            'Create product schema with id, name, category, price, and descriptive tags.',
            'Seed 12 diverse campus store products (snacks, stationery, chargers, hostel essentials).',
            'Render responsive product grid with search input field.',
          ],
          deliverable: 'Functional product catalog displaying items with price and category badges.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement vector / semantic similarity scoring',
          focusArea: 'Semantic Engine',
          actionableSteps: [
            'Generate lightweight normalized concept vectors or multi-tag scoring weights for all items.',
            'Write cosineSimilarity(vecA, vecB) function in pure TypeScript.',
            'Map natural student intent keywords ("hunger", "caffeine", "exam", "budget") to concept dimensions.',
          ],
          deliverable: 'Mathematical similarity engine returning ranked relevance scores.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Connect dynamic ranking & relevance badges',
          focusArea: 'UI & Filtering',
          actionableSteps: [
            'Sort product list dynamically as the user types in real time.',
            'Display relevance match percentage badge (e.g. "94% Match") on each card.',
            'Add fallback message suggesting alternative searches when no item crosses 40% match.',
          ],
          deliverable: 'Live semantic search experience ranking products by intent.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Validate search accuracy & benchmark speed',
          focusArea: 'Testing & Polish',
          actionableSteps: [
            'Test ambiguous queries like "cheap energy boost" and verify healthy ranking.',
            'Confirm sub-5ms query response time in browser console.',
            'Commit to GitHub with concise architecture notes.',
          ],
          deliverable: 'Clean semantic search project on GitHub.',
        },
      ],
    },
    transform: {
      title: 'Hostel Group Order & Cart Coordination Co-Pilot',
      tagline: 'Turn individual shopping into a synchronized group order tool that automates split payments.',
      overview: 'Repurpose the shopping cart into a collaborative group ordering session where roommates pool food orders from the same cafeteria to eliminate individual delivery delivery charges.',
      problemSolved: 'Hostel roommates waste money paying multiple separate delivery fees and spend tedious minutes manually calculating who owes what via UPI.',
      targetUser: 'Hostel residents, college study groups, and roommates ordering group meals.',
      specificAiCapability: 'Automated order reconciliation arithmetic + real-time session aggregation.',
      whyUseful: 'High viral growth potential on college campuses because every user invites their roommates to join the cart.',
      architecturalShift: 'Shift from single-user local cart state to a multi-member session state aggregated by room code.',
      recommendedStack: ['React', 'Supabase Realtime / WebSockets', 'Tailwind CSS', 'TypeScript'],
      difficulty: 'Intermediate',
      nextAction: 'Scaffold the shared room code state and split calculator in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Create shared room code & session model',
          focusArea: 'State Architecture',
          actionableSteps: [
            'Create data models for GroupSession, Member, and CartItem.',
            'Add "Create Group Cart" button generating a shareable 4-digit room PIN.',
            'Display list of active members in the current group order.',
          ],
          deliverable: 'Multi-member room session scaffolding with dynamic join capability.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement automatic bill & discount split logic',
          focusArea: 'Reconciliation Engine',
          actionableSteps: [
            'Write function calculating proportional delivery and tax distribution per person.',
            'Support custom UPI split breakdown showing exact owed amounts per roommate.',
            'Handle edge cases like shared collective items (e.g. 1 pizza split between 3 people).',
          ],
          deliverable: 'Accurate reconciliation math calculating individual payment shares.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build collaborative cart summary UI',
          focusArea: 'UI & Realtime Feedback',
          actionableSteps: [
            'Render live order board showing who added which dish.',
            'Add "Copy UPI Payment Breakdown" button formatting a neat WhatsApp summary message.',
            'Include "Lock Cart" trigger once all roommates confirm their choices.',
          ],
          deliverable: 'Interactive group cart dashboard with one-click payment summaries.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Test multi-tab simulation & verify calculations',
          focusArea: 'Validation & Polish',
          actionableSteps: [
            'Open two browser tabs side-by-side to simulate roommates ordering together.',
            'Confirm arithmetic accuracy down to the exact rupee.',
            'Push to GitHub with step-by-step setup documentation.',
          ],
          deliverable: 'Production-ready group ordering repository on GitHub.',
        },
      ],
    },
    differentiate: {
      title: 'Predictive Demand & Zero-Waste Inventory Estimator',
      tagline: 'Forecast cafeteria ingredient needs using historical order timestamps to prevent food waste.',
      overview: 'Build an analytical forecasting model that inspects hourly order patterns and predicts how many portions of meal items will be purchased during upcoming meal slots.',
      problemSolved: 'Campus canteens either run out of food early causing long queues or over-prepare perishable food resulting in costly waste.',
      targetUser: 'College cafeteria contractors, mess managers, and student mess committees.',
      specificAiCapability: 'Time-series moving average forecasting + peak demand hour regression.',
      whyUseful: 'Demonstrates data engineering and business acumen, making your resume attractive for growth and operations roles.',
      architecturalShift: 'Add a time-series aggregation service that analyzes historical orders by day-of-week and meal hour.',
      recommendedStack: ['TypeScript', 'Chart.js', 'React', 'Statistical Heuristics'],
      difficulty: 'Advanced',
      nextAction: 'Write the hourly moving average predictor in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold time-series order dataset',
          focusArea: 'Dataset Generation',
          actionableSteps: [
            'Generate 30 days of realistic mock campus order timestamps across breakfast, lunch, and dinner.',
            'Create data structure linking meal items with preparation ingredients.',
            'Set up Chart.js canvas for visualizing hourly demand volume.',
          ],
          deliverable: 'Running dashboard plotting 30-day historical cafeteria demand curves.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Code moving average & day-of-week weighting',
          focusArea: 'Forecasting Algorithm',
          actionableSteps: [
            'Write algorithm computing 7-day weighted moving average for each dish.',
            'Apply day-of-week multipliers (e.g., Friday dinners exhibit +25% volume).',
            'Calculate recommended preparation safety buffer (e.g. +10% to prevent stockouts).',
          ],
          deliverable: 'Prediction function outputting expected portion counts for upcoming days.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build inventory recommendation panel',
          focusArea: 'UI Integration',
          actionableSteps: [
            'Render "Tomorrow\'s Prep Plan" card with predicted servings per meal item.',
            'Add estimated food waste reduction metric (e.g. "Saved ~18 kg wasted rice").',
            'Include toggle to simulate exam week vs regular week demand spikes.',
          ],
          deliverable: 'Visual operational planning console with actionable ingredient targets.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Validate variance & document business impact',
          focusArea: 'Review & Documentation',
          actionableSteps: [
            'Compute Mean Absolute Percentage Error (MAPE) on test dataset.',
            'Write README highlighting operational cost savings for college mess vendors.',
            'Commit cleanly to GitHub.',
          ],
          deliverable: 'Complete predictive inventory repo on GitHub.',
        },
      ],
    },
  },

  portfolio: {
    domainName: 'Developer Portfolios & Technical Showcase',
    upgrade: {
      title: 'Semantic Project Search & Code Repository Q&A',
      tagline: 'Let tech recruiters ask conversational questions and get answers cited from your actual code.',
      overview: 'Upgrade your static portfolio so hiring managers can type questions like "Show me where you handled authentication errors" and see exact highlighted code snippets and explanations.',
      problemSolved: 'Recruiters spend under 30 seconds scanning student portfolios and miss key technical depth buried in repository subfolders.',
      targetUser: 'Engineering recruiters, technical hiring managers, and prospective employers.',
      specificAiCapability: 'Contextual keyword indexing + structured code snippet citation.',
      whyUseful: 'Immediately demonstrates engineering initiative during job interviews because the recruiter experiences the feature on your portfolio.',
      architecturalShift: 'Add a searchable JSON repository index containing code highlights and architecture notes mapped to interactive modal cards.',
      recommendedStack: ['React', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'],
      difficulty: 'Beginner Friendly',
      nextAction: 'Build the code snippet citation component in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Structure project metadata & code highlights',
          focusArea: 'Metadata Schema',
          actionableSteps: [
            'Create portfolio projects schema with title, tech stack, key problems solved, and code snippet array.',
            'Index 3 of your existing GitHub projects with concrete file paths and 5-line code highlights.',
            'Render baseline portfolio hero and project cards.',
          ],
          deliverable: 'Running portfolio page displaying project cards with rich metadata.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Build recruiter query parser & scoring',
          focusArea: 'Semantic Retrieval Engine',
          actionableSteps: [
            'Map common recruiter terms ("backend", "SQL", "auth", "API error", "performance") to project snippets.',
            'Write query matcher that ranks snippets by relevance to the recruiter query.',
            'Generate brief explanation explaining why the highlighted snippet fits the question.',
          ],
          deliverable: 'Function returning exact code snippets matching recruiter inquiries.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build interactive recruiter Q&A drawer',
          focusArea: 'UI Component',
          actionableSteps: [
            'Add search bar with quick suggested prompt pills ("Where is auth handled?", "Show me database schema").',
            'Render code block with syntax styling and file path badge (e.g. `src/utils/auth.ts:L42`).',
            'Include "View on GitHub" direct permalink.',
          ],
          deliverable: 'Interactive Q&A component providing instant proof of code competency.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Test mobile responsiveness & deploy checklist',
          focusArea: 'Polish & Deployment',
          actionableSteps: [
            'Verify code snippets wrap cleanly on mobile screens without horizontal overflow.',
            'Add subtle keyboard shortcut (`Cmd+K` / `Ctrl+K`) to toggle recruiter search.',
            'Commit to GitHub with instructions for fellow students to plug in their own repos.',
          ],
          deliverable: 'Polished, interview-ready portfolio upgrade repository on GitHub.',
        },
      ],
    },
    transform: {
      title: 'Peer Code Review & Technical Case Study Generator',
      tagline: 'Transform your portfolio UI into a structured feedback tool for student study groups.',
      overview: 'Turn your portfolio website into a peer review playground where classmates submit GitHub repo links and receive structured architecture breakdowns evaluating readability, naming conventions, and modularity.',
      problemSolved: 'Students write code in isolation and rarely receive constructive peer review before final semester submission.',
      targetUser: 'Engineering students, competitive programming peers, and hackathon teammates.',
      specificAiCapability: 'Deterministic AST / pattern rubric scoring for code modularity and documentation completeness.',
      whyUseful: 'Demonstrates mentorship and code quality standards, which senior engineers value highly in junior hires.',
      architecturalShift: 'Shift from static self-showcase into an interactive multi-input evaluation tool.',
      recommendedStack: ['React', 'TypeScript', 'Prism.js', 'Tailwind CSS'],
      difficulty: 'Intermediate',
      nextAction: 'Build the code quality rubric checklist in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Build code paste playground & syntax viewer',
          focusArea: 'Playground UI',
          actionableSteps: [
            'Create dual-pane layout: code input textarea on left, review report on right.',
            'Configure code syntax highlighting with line numbering.',
            'Add sample buggy student code snippet for quick testing.',
          ],
          deliverable: 'Clean web editor allowing students to paste code snippets for review.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement 5-point code quality rubric engine',
          focusArea: 'Rubric Evaluator',
          actionableSteps: [
            'Write rule engine checking: function length (> 40 lines), hardcoded secrets/API keys, naming clarity, error handling blocks.',
            'Calculate overall maintainability score from 1 to 100.',
            'Generate bulleted recommendations for each identified issue.',
          ],
          deliverable: 'Deterministic code evaluation engine returning structured feedback.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Render scorecard & actionable advice cards',
          focusArea: 'UI Integration',
          actionableSteps: [
            'Display score ring (e.g. 78/100) with color-coded feedback categories.',
            'Highlight problematic lines directly in the code viewer.',
            'Add "Copy Peer Review Summary" button for posting in Discord or WhatsApp study groups.',
          ],
          deliverable: 'Interactive code review scorecard with line-level recommendations.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Test edge cases & prepare live showcase',
          focusArea: 'Testing & Documentation',
          actionableSteps: [
            'Test empty code blocks, Python snippets, and TypeScript snippets.',
            'Verify zero lag when parsing 300+ lines of code.',
            'Push clean repo to GitHub.',
          ],
          deliverable: 'Fully functional peer code review tool on GitHub.',
        },
      ],
    },
    differentiate: {
      title: 'In-Browser Algorithm Benchmark & WebContainer Sandbox',
      tagline: 'Allow visitors to execute, benchmark, and visualize your algorithms live in the browser.',
      overview: 'Differentiate your portfolio by embedding a live client-side sandbox where recruiters can click "Run Benchmark" and watch your algorithms execute in real time without backend server dependencies.',
      problemSolved: 'Recruiters almost never clone student repositories to verify whether the claimed performance numbers are authentic.',
      targetUser: 'Senior software engineers, algorithm interviewers, and technical recruiters.',
      specificAiCapability: 'Client-side performance measurement via Performance API + real-time canvas visualization.',
      whyUseful: 'Delivers undeniable empirical proof of your coding ability directly within the browser tab.',
      architecturalShift: 'Implement isolated Web Workers executing parameterized benchmark runs while graphing memory and execution times.',
      recommendedStack: ['React', 'Web Workers', 'Performance API', 'HTML5 Canvas'],
      difficulty: 'Advanced',
      nextAction: 'Mount the performance benchmark worker in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Set up algorithm worker harness',
          focusArea: 'Worker Scaffold',
          actionableSteps: [
            'Create dedicated Web Worker file benchmarkWorker.ts.',
            'Implement two sorting/search algorithms (e.g., QuickSort vs BubbleSort).',
            'Establish message protocol passing array sizes (1k, 10k, 50k elements).',
          ],
          deliverable: 'Web Worker successfully executing sorting tasks in background thread.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Accurate time measurement with Performance API',
          focusArea: 'Telemetry Engine',
          actionableSteps: [
            'Capture high-resolution timestamps using performance.now().',
            'Run multiple iterations to calculate median execution time and eliminate outlier jitter.',
            'Return structured metrics: durationMs, comparisonsCount, memoryAllocatedEstimate.',
          ],
          deliverable: 'Accurate sub-millisecond benchmarking pipeline.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build interactive benchmark runner UI',
          focusArea: 'Interactive UI',
          actionableSteps: [
            'Add array size slider (1,000 to 100,000 elements) and "Run Live Benchmark" button.',
            'Render live bar comparison showing execution speed differences.',
            'Add visual explanation of Big-O time complexity based on empirical results.',
          ],
          deliverable: 'Visual benchmark dashboard comparing algorithm runtimes live.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Verify smooth UI execution & publish',
          focusArea: 'Optimization & Push',
          actionableSteps: [
            'Confirm main UI thread remains completely responsive (60 FPS) during 100k element execution.',
            'Add badge: "100% In-Browser Execution • Zero Server Cost".',
            'Push to GitHub with comprehensive benchmarking documentation.',
          ],
          deliverable: 'Standout portfolio feature published to GitHub.',
        },
      ],
    },
  },

  general: {
    domainName: 'Full-Stack Software & Student Projects',
    upgrade: {
      title: 'Contextual AI Query & Natural Language Assistant',
      tagline: 'Enable users to query and filter application data using natural conversational prompts.',
      overview: 'Enhance your existing project by adding a natural language query interface that translates everyday user requests into structured data filters and summary cards.',
      problemSolved: 'Users find complex filter dropdowns and multi-step forms tedious when seeking specific information.',
      targetUser: 'End users looking for fast, intuitive data lookup.',
      specificAiCapability: 'Deterministic intent classification + parameter extraction for UI state filtering.',
      whyUseful: 'Teaches prompt and intent mapping, which is the foundational pattern behind modern AI copilots.',
      architecturalShift: 'Place an intent parsing adapter in front of the application data query handler.',
      recommendedStack: ['React', 'TypeScript', 'Tailwind CSS', 'Heuristic Intent Parser'],
      difficulty: 'Beginner Friendly',
      nextAction: 'Create the intent mapping dictionary in Sprint 2 of the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold conversational input drawer',
          focusArea: 'Scaffold & Input',
          actionableSteps: [
            'Build sleek floating assistant button and expandible chat drawer.',
            'Define sample queries users typically ask in your application.',
            'Set up chat message history state in React.',
          ],
          deliverable: 'Responsive slide-over assistant drawer ready for intent processing.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement intent classification & filter mapping',
          focusArea: 'NLP Heuristics',
          actionableSteps: [
            'Create typed intent patterns (e.g., search, summarize, alert, sort).',
            'Write parameter extractor extracting dates, numbers, and categories from user text.',
            'Generate structured action payload dispatched to application state.',
          ],
          deliverable: 'Intent engine converting freeform text into structured app filter actions.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Render dynamic response cards & action badges',
          focusArea: 'UI & Action Feedback',
          actionableSteps: [
            'Display assistant replies as styled cards with action buttons.',
            'Include "Applied Filter: [Category]" pill inside the main view.',
            'Add quick suggested prompt chips above the text input.',
          ],
          deliverable: 'Interactive copilot drawer driving real application state changes.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Test edge cases & outline API upgrade path',
          focusArea: 'Testing & Roadmap',
          actionableSteps: [
            'Test gibberish and unsupported inputs with helpful fallback messages.',
            'Document step-by-step instructions for wiring a free LLM endpoint (Gemini API) in future.',
            'Commit to GitHub with clear setup guide.',
          ],
          deliverable: 'Clean copilot starter project on GitHub.',
        },
      ],
    },
    transform: {
      title: 'Collaborative Multi-User Workflow Hub',
      tagline: 'Pivot single-user tool into an invite-based collaborative workspace with activity audit logs.',
      overview: 'Transform your standalone project into a shared collaborative hub where team members can invite peers, assign tasks, and view live activity updates.',
      problemSolved: 'Most college projects are isolated single-user toys that fail to reflect realistic multi-user software engineering challenges.',
      targetUser: 'Student project teams, student clubs, and small workgroups.',
      specificAiCapability: 'Deterministic activity summarization + automated daily progress digests.',
      whyUseful: 'Proves to interviewers that you understand authorization, shared state, and multi-tenant architectures.',
      architecturalShift: 'Upgrade data models from user-scoped to workspace-scoped with role permissions (Admin, Editor, Viewer).',
      recommendedStack: ['React', 'Supabase / Firebase', 'TypeScript', 'Tailwind CSS'],
      difficulty: 'Intermediate',
      nextAction: 'Configure workspace role-based permissions in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Set up workspace schema & invite link generator',
          focusArea: 'Workspace Architecture',
          actionableSteps: [
            'Define Workspace, Membership, and ActivityEvent interfaces.',
            'Build "Invite Teammate" modal generating unique shareable join URLs.',
            'Render workspace selector dropdown in navigation header.',
          ],
          deliverable: 'Workspace shell supporting team creation and member invitations.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement activity event stream & summarizer',
          focusArea: 'Event Architecture',
          actionableSteps: [
            'Log key user actions (created item, edited status, resolved item) to activity array.',
            'Write function summarizing recent team events into a 3-bullet daily digest.',
            'Support role permissions preventing unauthorized edits.',
          ],
          deliverable: 'Live activity stream with automated team progress summaries.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build team activity timeline & presence badge',
          focusArea: 'UI & Visualization',
          actionableSteps: [
            'Render chronologically sorted activity feed with user avatars and timestamp badges.',
            'Add "Active Members Online" avatar stack in top right corner.',
            'Include quick filter by team member.',
          ],
          deliverable: 'Collaborative team feed with real-time style presentation.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Verify multi-session flow & push to GitHub',
          focusArea: 'Testing & Polish',
          actionableSteps: [
            'Verify member join flow using multiple browser profiles.',
            'Ensure permission checks prevent unauthorized state mutations.',
            'Commit to GitHub with clear architecture diagram.',
          ],
          deliverable: 'Complete collaborative workspace repository on GitHub.',
        },
      ],
    },
    differentiate: {
      title: 'Local-First Synthetic Data Generator & Stress Tester',
      tagline: 'Generate hundreds of realistic student records and benchmark system limits in browser.',
      overview: 'Build a client-side synthetic data studio that generates mathematically realistic test datasets (with edge cases, nulls, and outliers) to stress-test full-stack applications.',
      problemSolved: 'Students test their apps with only 3 hardcoded dummy records, leading to catastrophic failure during college viva presentations or real user spikes.',
      targetUser: 'Student software engineers, QA testers, and viva examiners.',
      specificAiCapability: 'Probabilistic synthetic data generation with controllable distribution parameters.',
      whyUseful: 'Signals exceptional engineering maturity by focusing on verification, scale testing, and robustness.',
      architecturalShift: 'Implement generator functions yielding randomized yet statistically distributed record sets with CSV/JSON export.',
      recommendedStack: ['TypeScript', 'React', 'Faker / Custom Generators', 'Tailwind CSS'],
      difficulty: 'Advanced',
      nextAction: 'Write the probabilistic distribution generator in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Define schema builder & generator canvas',
          focusArea: 'Generator Scaffold',
          actionableSteps: [
            'Build schema configurator letting users specify field types (names, emails, dates, scores, status).',
            'Add volume slider (10 to 5,000 synthetic records).',
            'Render live preview table showing generated row samples.',
          ],
          deliverable: 'Visual schema builder producing real-time mock data previews.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement edge case & anomaly injector',
          focusArea: 'Synthesis Engine',
          actionableSteps: [
            'Code probabilistic anomaly injection (e.g. 5% missing fields, 2% duplicate emails, 3% boundary values).',
            'Support realistic domain distributions (e.g. bell curves for test scores).',
            'Ensure seedable reproducibility using simple linear congruential generator.',
          ],
          deliverable: 'Data generator outputting statistically realistic datasets with edge cases.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Add JSON/CSV export & benchmark viewer',
          focusArea: 'Export & Analysis UI',
          actionableSteps: [
            'Add one-click "Download as CSV" and "Download as JSON" export buttons.',
            'Display data health stats: total rows, missing values count, anomaly distribution.',
            'Include "Copy as SQL INSERT" script generator.',
          ],
          deliverable: 'Comprehensive test data studio with multi-format export capabilities.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Benchmark 50,000 row generation & publish',
          focusArea: 'Performance & Git',
          actionableSteps: [
            'Verify browser memory does not exceed 100MB during 50,000 record generation.',
            'Write documentation showing fellow students how to use the tool for their final year viva demos.',
            'Push to GitHub.',
          ],
          deliverable: 'Published synthetic data testing tool on GitHub.',
        },
      ],
    },
  },

  // Map remaining keys to specialized templates
  chat: {
    domainName: 'Messaging & Social Platforms',
    upgrade: {
      title: 'Semantic Message Retrieval & Thread Summarizer',
      tagline: 'Find past conversations by meaning and generate 3-bullet meeting recaps.',
      overview: 'Upgrade the chat interface with semantic message indexing and quick bullet summaries of active project threads.',
      problemSolved: 'Students waste time scrolling through hundreds of chaotic group chat messages to find shared assignment links.',
      targetUser: 'College project teams, club coordinators, and student study groups.',
      specificAiCapability: 'Contextual keyword indexing + structured thread extractive summarization.',
      whyUseful: 'Provides high utility during semester exams when students need quick access to shared study resources.',
      architecturalShift: 'Add a thread-level message aggregation layer that summarizes discussions into key action items.',
      recommendedStack: ['React', 'TypeScript', 'Tailwind CSS', 'IndexedDB'],
      difficulty: 'Beginner Friendly',
      nextAction: 'Write the thread summarization parser in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold message stream UI',
          focusArea: 'Scaffold',
          actionableSteps: ['Create chat thread layout with sender avatars.', 'Seed 20 realistic project discussion messages.', 'Render basic search input.'],
          deliverable: 'Working message thread with high-contrast readable bubbles.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement semantic thread summarizer',
          focusArea: 'Logic',
          actionableSteps: ['Extract action items, deadlines, and links from message history.', 'Generate 3-bullet recap card.', 'Handle noisy non-informative messages.'],
          deliverable: 'Thread summarizer returning concise action item digests.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build recap drawer & pin board',
          focusArea: 'UI Integration',
          actionableSteps: ['Display "Thread Summary" modal with one-click pin capability.', 'Add filter by shared links and files.', 'Test search keyword highlighting.'],
          deliverable: 'Interactive summary drawer with direct message jump links.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Validate edge cases & push',
          focusArea: 'Polish',
          actionableSteps: ['Test empty chat threads and 1000+ message threads.', 'Write README on student communication workflows.', 'Commit to GitHub.'],
          deliverable: 'Clean chat summarizer project on GitHub.',
        },
      ],
    },
    transform: {
      title: 'Collaborative Question Answering & Exam Help Room',
      tagline: 'Transform private 1-on-1 messaging into a shared peer Q&A platform with verified answers.',
      overview: 'Convert the messaging architecture into a StackOverflow-style peer Q&A room where students post difficult engineering doubts and upvote verified answers.',
      problemSolved: 'Repeated duplicate doubts flood WhatsApp groups every exam season without structured searchability.',
      targetUser: 'Engineering classmates studying for semester finals.',
      specificAiCapability: 'Duplicate question detection + answer verification heuristics.',
      whyUseful: 'Demonstrates community platform architecture and moderation workflows.',
      architecturalShift: 'Shift from linear time-based messaging to question-and-answer nested hierarchy.',
      recommendedStack: ['React', 'Supabase', 'TypeScript', 'Tailwind CSS'],
      difficulty: 'Intermediate',
      nextAction: 'Implement duplicate question similarity check in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Set up Q&A data hierarchy',
          focusArea: 'Data Models',
          actionableSteps: ['Create Question, Answer, and Vote models.', 'Build question feed with subject tags.', 'Add "Ask Doubt" modal.'],
          deliverable: 'Interactive doubt submission and viewing feed.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement duplicate question detector',
          focusArea: 'Search Algorithm',
          actionableSteps: ['Compare user question title against existing questions using token overlap.', 'Show "Possible duplicates already answered" preview.', 'Prevent spam.'],
          deliverable: 'Real-time duplicate detection warning as user types.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build upvoting & verified badge UI',
          focusArea: 'UI & Gamification',
          actionableSteps: ['Add upvote buttons with optimistic UI updates.', 'Add "Verified by TA / Mentor" badge for top answers.', 'Filter by unanswered questions.'],
          deliverable: 'Complete peer learning board with reputation badges.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Test mobile responsiveness & review',
          focusArea: 'Validation',
          actionableSteps: ['Verify voting works seamlessly on mobile devices.', 'Document database schema in README.', 'Commit to GitHub.'],
          deliverable: 'High-impact campus Q&A project on GitHub.',
        },
      ],
    },
    differentiate: {
      title: 'End-to-End Ephemeral Encrypted Messenger with Web Crypto',
      tagline: 'Client-side message encryption using browser Web Crypto API without readable server logs.',
      overview: 'Differentiate your portfolio by implementing true client-side cryptographic message encryption where keys never touch the backend server.',
      problemSolved: 'Students frequently distrust centralized platforms for sensitive project secrets and exam coordination.',
      targetUser: 'Security-conscious developers and campus project teams.',
      specificAiCapability: 'SubtleCrypto AES-GCM 256-bit client-side encryption and key derivation.',
      whyUseful: 'Proves high-level cybersecurity and cryptographic architecture understanding.',
      architecturalShift: 'Encrypt payloads in client memory before dispatching over WebSockets.',
      recommendedStack: ['Web Crypto API', 'React', 'TypeScript', 'Tailwind CSS'],
      difficulty: 'Advanced',
      nextAction: 'Derive AES-GCM encryption keys using SubtleCrypto in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold Web Crypto key generation',
          focusArea: 'Security Setup',
          actionableSteps: ['Initialize window.crypto.subtle in TypeScript.', 'Generate ephemeral 256-bit AES-GCM key from password.', 'Render encryption status badge.'],
          deliverable: 'Client crypto helper successfully deriving secure keys in browser.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement encrypt/decrypt pipeline',
          focusArea: 'Cryptographic Engine',
          actionableSteps: ['Encrypt message strings into ArrayBuffer ciphertext with random IV.', 'Decrypt incoming ciphertext into plaintext in client state.', 'Verify cipher strings look scrambled in console.'],
          deliverable: 'Functional encryption and decryption verified in client logs.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build encrypted chat UI & ciphertext inspector',
          focusArea: 'UI & Security Proof',
          actionableSteps: ['Render chat bubbles with lock icon indicating verified encryption.', 'Add toggle to inspect raw encrypted network payload.', 'Add self-destruct timer pill.'],
          deliverable: 'Interactive secure chat with undeniable cryptographic proof in UI.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Security audit & GitHub documentation',
          focusArea: 'Security Verification',
          actionableSteps: ['Verify zero plaintext leakage in browser storage.', 'Write README explaining AES-GCM key exchange.', 'Commit to GitHub.'],
          deliverable: 'Showstopper cybersecurity portfolio project on GitHub.',
        },
      ],
    },
  },

  health: {
    domainName: 'Health, Fitness & Well-being',
    upgrade: {
      title: 'Intelligent Workout Progression & Fatigue Advisor',
      tagline: 'Calculate optimal weight progression and rest days based on logged volume and perceived exertion.',
      overview: 'Upgrade the fitness log with algorithmic progressive overload recommendations that prevent overtraining.',
      problemSolved: 'Gym beginners either plateau from lifting the same weights or injure themselves by adding weight too quickly.',
      targetUser: 'Student gym-goers and fitness enthusiasts.',
      specificAiCapability: 'Rolling volume calculations + rate of perceived exertion (RPE) adaptation.',
      whyUseful: 'Directly solves student fitness plateaus using transparent statistical calculations.',
      architecturalShift: 'Add an adaptation module computing recommended reps and weights for upcoming sessions.',
      recommendedStack: ['React', 'TypeScript', 'Tailwind CSS', 'Chart.js'],
      difficulty: 'Beginner Friendly',
      nextAction: 'Code the RPE progressive overload function in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold workout logger & exercise catalog',
          focusArea: 'Scaffold',
          actionableSteps: ['Create models for Exercise, Set, and WorkoutSession.', 'Seed 6 standard compound movements.', 'Render clean mobile logging card.'],
          deliverable: 'Functional workout logging UI with set/rep inputs.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement progressive overload engine',
          focusArea: 'Algorithmic Advisor',
          actionableSteps: ['Write formula calculating estimated 1RM (Brzycki formula).', 'Suggest +2.5kg increment when RPE <= 7.', 'Recommend deload week when volume drops 3 consecutive sessions.'],
          deliverable: 'Tested progression engine outputting specific weight suggestions.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build next-workout recommendation card',
          focusArea: 'UI Feedback',
          actionableSteps: ['Render "Today\'s Recommended Targets" highlight banner.', 'Add 4-week volume trend sparkline.', 'Include fatigue recovery indicator.'],
          deliverable: 'Visual training advisor with clear next-set targets.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Test edge cases & mobile polish',
          focusArea: 'Mobile Testing',
          actionableSteps: ['Test on simulated mobile viewport with touch-friendly buttons.', 'Verify offline persistence in localStorage.', 'Commit to GitHub.'],
          deliverable: 'Polished fitness companion project on GitHub.',
        },
      ],
    },
    transform: {
      title: 'Campus Canteen Nutrition & Macro Balance Tracker',
      tagline: 'Transform exercise logging into a hostel diet assistant tailored to college mess menus.',
      overview: 'Pivot your logging skills to track realistic college mess meals and provide healthy macro recommendations.',
      problemSolved: 'Hostel students struggle to meet basic protein targets because general calorie apps lack Indian college mess dishes.',
      targetUser: 'Hostel students trying to eat balanced meals within a student budget.',
      specificAiCapability: 'Macro breakdown estimation + mess menu meal optimization heuristics.',
      whyUseful: 'High cultural relevance that resonates instantly with students and mentors.',
      architecturalShift: 'Shift from exercise sets to hostel meal database with realistic portion estimations.',
      recommendedStack: ['React', 'TypeScript', 'Tailwind CSS', 'IndexedDB'],
      difficulty: 'Intermediate',
      nextAction: 'Build the Indian mess nutritional lookup matrix in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Set up campus mess menu database',
          focusArea: 'Menu Dataset',
          actionableSteps: ['Create database of 20 typical hostel dishes (dal, roti, paneer, eggs, rice).', 'Assign realistic calorie and protein values per katori.', 'Build daily meal selection layout.'],
          deliverable: 'Hostel meal logging card with instant calorie calculation.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement daily protein target calculator',
          focusArea: 'Nutrition Logic',
          actionableSteps: ['Calculate daily target: weightKg * 1.5g protein.', 'Compute remaining gap for the day.', 'Suggest practical budget additions (e.g. 2 boiled eggs or roasted chana).'],
          deliverable: 'Target calculator delivering actionable dietary recommendations.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build macro progress rings & budget advice',
          focusArea: 'UI & Badges',
          actionableSteps: ['Render circular progress rings for Protein, Carbs, and Fats.', 'Add "Mess Hack of the Day" card.', 'Display warning when daily protein is below 40g.'],
          deliverable: 'Interactive hostel nutrition dashboard with visual progress indicators.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Verify calculations & write README',
          focusArea: 'Review & Documentation',
          actionableSteps: ['Test edge cases (vegetarian vs eggetarian filters).', 'Write README on student health engineering.', 'Commit to GitHub.'],
          deliverable: 'Completed campus nutrition assistant on GitHub.',
        },
      ],
    },
    differentiate: {
      title: 'In-Browser Real-Time Posture & Rep Counter with PoseNet',
      tagline: 'Count squat and pushup reps accurately using client-side webcam computer vision in real time.',
      overview: 'Differentiate your technical skills by building an in-browser computer vision trainer that tracks body joints and counts exercise repetitions without uploading video to cloud servers.',
      problemSolved: 'Beginners frequently perform exercises with poor form leading to lower back strain and injury.',
      targetUser: 'At-home exercisers, physical therapy students, and athletes.',
      specificAiCapability: 'Client-side skeleton joint angle calculation (knee/hip degrees) via PoseNet/MoveNet.',
      whyUseful: 'Extremely impressive visual demonstration in any portfolio or hackathon.',
      architecturalShift: 'Feed webcam stream into client-side MoveNet model and track joint angle states.',
      recommendedStack: ['TensorFlow.js', 'Pose Detection API', 'React', 'HTML5 Canvas'],
      difficulty: 'Advanced',
      nextAction: 'Mount PoseNet and calculate joint angles in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold webcam stream & canvas overlay',
          focusArea: 'Webcam Canvas',
          actionableSteps: ['Set up video element capturing webcam feed.', 'Overlay transparent HTML5 canvas matching video resolution.', 'Install @tensorflow-models/pose-detection.'],
          deliverable: 'Live webcam stream with canvas overlay rendering smoothly.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Load MoveNet & calculate knee/hip angle',
          focusArea: 'Pose Tracking',
          actionableSteps: ['Load lightweight MoveNet Lightning model.', 'Extract hip, knee, and ankle keypoint coordinates.', 'Calculate joint angle using vector dot product: cos(theta) = (A dot B) / (|A||B|).'],
          deliverable: 'Real-time calculation of knee flexion angle printed to canvas.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Implement finite state rep counter',
          focusArea: 'State Machine & UI',
          actionableSteps: ['Define state machine: STANDING (angle > 160 deg) -> SQUATTING (angle < 90 deg) -> COMPLETED.', 'Increment rep count on successful return to standing position.', 'Draw colorful skeleton lines on canvas with emerald confirmation box.'],
          deliverable: 'Automated rep counter functioning live on webcam feed.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Benchmark FPS & test lighting edge cases',
          focusArea: 'Optimization & Push',
          actionableSteps: ['Verify consistent 25+ FPS on laptop camera.', 'Add audio beep on successful rep completion.', 'Push to GitHub with animated demo GIF.'],
          deliverable: 'Cutting-edge computer vision project published on GitHub.',
        },
      ],
    },
  },

  finance: {
    domainName: 'Personal Finance, Budgeting & Student Expenses',
    upgrade: {
      title: 'Smart Spending Velocity & Burn-Rate Forecaster',
      tagline: 'Predict the exact date your monthly pocket money will run dry based on daily spending velocity.',
      overview: 'Upgrade the standard expense tracker with predictive cashflow runway analysis that warns students when current spending pace will lead to zero balance before month-end.',
      problemSolved: 'Students track expenses passively after spending, but lack forward-looking runway alerts that curb overspending early in the month.',
      targetUser: 'College students managing monthly allowances and pocket money.',
      specificAiCapability: 'Rolling expenditure velocity + linear burn-rate projection.',
      whyUseful: 'Transforms passive tracking into proactive financial discipline.',
      architecturalShift: 'Add a runway calculator computing daysRemaining = currentBalance / averageDailySpend.',
      recommendedStack: ['React', 'TypeScript', 'Tailwind CSS', 'Chart.js'],
      difficulty: 'Beginner Friendly',
      nextAction: 'Write the burn-rate trajectory function in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Set up expense schema & entry form',
          focusArea: 'Scaffold',
          actionableSteps: ['Create Transaction model with amount, category, and date.', 'Seed 15 typical student expenses (food, transport, subscriptions).', 'Render clean transaction list.'],
          deliverable: 'Running expense tracker displaying current balance and transaction log.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement daily burn rate & runway formula',
          focusArea: 'Financial Logic',
          actionableSteps: ['Calculate average daily spend over last 7 days.', 'Project date of zero balance: currentDate + (balance / dailyRate).', 'Determine safe daily spending limit to survive until 30th of month.'],
          deliverable: 'Mathematical runway engine outputting exact projected depletion dates.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build runway alert meter & category breakdown',
          focusArea: 'UI & Visualization',
          actionableSteps: ['Render visual gauge (Green = Safe, Red = Exhausted by 18th).', 'Display "Recommended daily spending ceiling: ₹140/day".', 'Add category doughnut chart showing top spend leaks.'],
          deliverable: 'Interactive financial cockpit with proactive runway warnings.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Test edge cases & mobile responsiveness',
          focusArea: 'Testing & Polish',
          actionableSteps: ['Test zero balance and large irregular one-time purchase anomalies.', 'Ensure touch inputs are seamless on mobile screens.', 'Commit to GitHub.'],
          deliverable: 'High-utility student financial manager on GitHub.',
        },
      ],
    },
    transform: {
      title: 'Hostel Group Expense & Fair UPI Settlement Matrix',
      tagline: 'Transform personal budgets into a multi-person debt settlement tool with minimal transactions.',
      overview: 'Pivot your expense calculations into an optimal debt settlement engine that minimizes the total number of bank transactions required to settle group hostel trips.',
      problemSolved: 'After college trips or hostel events, calculating complex who-owes-whom webs creates friction and awkward debts.',
      targetUser: 'Hostel roommates, student trip organizers, and event committees.',
      specificAiCapability: 'Greedy debt simplification algorithm minimizing total transaction count.',
      whyUseful: 'Teaches algorithmic graph/greedy logic frequently tested in software engineering interviews.',
      architecturalShift: 'Shift from single-user balance sheet to multi-entity net balance graph settlement.',
      recommendedStack: ['React', 'TypeScript', 'Tailwind CSS', 'Graph Algorithms'],
      difficulty: 'Intermediate',
      nextAction: 'Implement the greedy debt minimization algorithm in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Set up group trip expense data model',
          focusArea: 'Data Models',
          actionableSteps: ['Define Participant, Expense, and NetBalance models.', 'Build input form to add trip expenses paid by one for multiple people.', 'Render summary of who paid for what.'],
          deliverable: 'Group expense logger capturing shared expenditures.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Code greedy debt minimization algorithm',
          focusArea: 'Algorithm Engine',
          actionableSteps: ['Calculate net balance for each person (total paid - fair share).', 'Separate into Creditors (positive) and Debtors (negative).', 'Repeatedly settle maximum debtor with maximum creditor to minimize total transactions.'],
          deliverable: 'Algorithm reducing 12 confusing debts into 3 clean settlements.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build settlement card & UPI link generator',
          focusArea: 'UI & Sharing',
          actionableSteps: ['Render clean settlement cards: "Rohan pays Alex ₹320".', 'Add "Copy WhatsApp Summary" button.', 'Generate clickable UPI deep link with prefilled amount.'],
          deliverable: 'Visual debt settlement console with instant payment shortcuts.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Verify mathematical zero-sum balance & publish',
          focusArea: 'Testing & Push',
          actionableSteps: ['Verify sum of all settlements equals zero without rounding errors.', 'Write README explaining the greedy graph algorithm.', 'Commit to GitHub.'],
          deliverable: 'Interview-ready debt simplification project on GitHub.',
        },
      ],
    },
    differentiate: {
      title: 'Client-Side Financial Receipt OCR & Anomaly Flagging',
      tagline: 'Extract amounts, dates, and merchant names directly from photos using client-side Tesseract.js.',
      overview: 'Differentiate your portfolio by building an in-browser receipt scanner using WebAssembly OCR that processes uploaded bill photos completely offline without sending receipts to external servers.',
      problemSolved: 'Students find manually typing receipts tedious and dislike uploading financial documents to third-party cloud servers.',
      targetUser: 'Students and professionals managing expense reimbursements.',
      specificAiCapability: 'Client-side OCR via Tesseract.js WebAssembly + regex amount extraction.',
      whyUseful: 'Combines computer vision with privacy-preserving edge architecture.',
      architecturalShift: 'Run Tesseract.js worker in browser memory and parse bounding boxes into typed fields.',
      recommendedStack: ['Tesseract.js', 'React', 'TypeScript', 'Canvas API'],
      difficulty: 'Advanced',
      nextAction: 'Initialize the in-browser Tesseract worker in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold photo dropzone & image preview',
          focusArea: 'Scaffold',
          actionableSteps: ['Build clean drag-and-drop receipt image uploader.', 'Render uploaded receipt preview on HTML5 canvas.', 'Install tesseract.js client package.'],
          deliverable: 'Receipt upload canvas ready for optical character recognition.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Initialize Tesseract worker & parse text',
          focusArea: 'OCR Engine',
          actionableSteps: ['Spawn Tesseract worker using client WebAssembly bundle.', 'Run recognize(canvas) with progress callback (0% to 100%).', 'Extract raw text stream from receipt image.'],
          deliverable: 'Browser extracting raw text strings from receipt photos locally.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Extract total amount & merchant with regex',
          focusArea: 'Information Extraction',
          actionableSteps: ['Write regex pattern matching currency symbols and amounts (e.g. Total: ₹450.00).', 'Detect date formats (DD/MM/YYYY).', 'Populate transaction form automatically from extracted values.'],
          deliverable: 'Auto-filling transaction card populated directly from scanned photo.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Verify accuracy on noisy receipts & document',
          focusArea: 'Validation & Push',
          actionableSteps: ['Test crumpled, low-contrast, and handwritten receipt images.', 'Add privacy notice: "No photos leave your device".', 'Commit to GitHub with sample test images.'],
          deliverable: 'Impressive client-side receipt scanner repository on GitHub.',
        },
      ],
    },
  },

  iot: {
    domainName: 'IoT, Hardware & Sensor Telemetry',
    upgrade: {
      title: 'Real-Time Sensor Telemetry Anomaly & Spike Detector',
      tagline: 'Detect electrical surges or abnormal sensor spikes in real time using statistical thresholds.',
      overview: 'Upgrade the hardware dashboard with real-time anomaly scoring that triggers alerts when temperature, vibration, or voltage exceeds normal operating ranges.',
      problemSolved: 'Hardware students often display raw sensor numbers on LCDs or web dashboards but lack automated alert tripwires.',
      targetUser: 'Engineering students in EEE, ECE, Robotics, and IoT disciplines.',
      specificAiCapability: 'Moving standard deviation thresholding + spike classification.',
      whyUseful: 'Bridges physical hardware sensors with modern web software intelligence.',
      architecturalShift: 'Add a streaming calculation buffer evaluating the last 30 incoming telemetry readings.',
      recommendedStack: ['React', 'WebSockets / MQTT', 'Chart.js', 'TypeScript'],
      difficulty: 'Beginner Friendly',
      nextAction: 'Build the moving telemetry standard deviation buffer in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold telemetry data stream & line chart',
          focusArea: 'Telemetry Scaffold',
          actionableSteps: ['Create mock WebSocket / timer emitting sensor readings every 500ms.', 'Configure real-time streaming line chart using Chart.js.', 'Display current sensor readout badge.'],
          deliverable: 'Live streaming sensor graph updating smoothly at 2 Hz.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement rolling buffer & threshold scoring',
          focusArea: 'Anomaly Algorithm',
          actionableSteps: ['Maintain rolling window of last 20 sensor values.', 'Calculate mean and standard deviation dynamically.', 'Flag readings deviating by > 2.5 sigma as critical spikes.'],
          deliverable: 'Real-time statistical anomaly detector evaluating incoming packets.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build alert notification drawer & incident log',
          focusArea: 'UI & Alerting',
          actionableSteps: ['Trigger high-contrast alert toast when an anomaly is identified.', 'Log anomaly timestamp and peak magnitude to an incident table.', 'Add "Mute Alerts" toggle.'],
          deliverable: 'Operational telemetry dashboard with incident history.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Test noise tolerance & write hardware setup guide',
          focusArea: 'Documentation & Git',
          actionableSteps: ['Test simulated sensor disconnection and noisy signal inputs.', 'Write README with Arduino/ESP32 code snippet for sending data.', 'Commit to GitHub.'],
          deliverable: 'Complete IoT anomaly detection project on GitHub.',
        },
      ],
    },
    transform: {
      title: 'Smart Campus Power Usage & Idle Vampire Draw Analyzer',
      tagline: 'Repurpose sensor telemetry to identify wasteful electricity consumption across college computer labs.',
      overview: 'Transform generic sensor monitoring into an energy conservation auditor that identifies computer labs drawing electricity when unoccupied.',
      problemSolved: 'Colleges waste tens of thousands of rupees annually because air conditioners and lab workstations remain powered during weekends and holidays.',
      targetUser: 'Campus facility managers, sustainability clubs, and electrical engineering departments.',
      specificAiCapability: 'Baseline energy signature comparison + idle state classification.',
      whyUseful: 'Quantifiable environmental and financial cost savings provide high storytelling value in interviews.',
      architecturalShift: 'Shift from generic telemetry to kWh energy consumption modeling with scheduled occupancy matching.',
      recommendedStack: ['React', 'TypeScript', 'Chart.js', 'Tailwind CSS'],
      difficulty: 'Intermediate',
      nextAction: 'Code the baseline energy signature comparison algorithm in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Set up lab energy dataset & timetable model',
          focusArea: 'Domain Models',
          actionableSteps: ['Create models for LabZone, PowerSensor, and ClassSchedule.', 'Seed 7-day power draw readings for 3 college labs.', 'Render overview dashboard with active power draw.'],
          deliverable: 'Energy monitoring dashboard showing live kilowatt draw per lab.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement idle vampire draw detector',
          focusArea: 'Auditing Engine',
          actionableSteps: ['Cross-reference current power draw with room class schedule.', 'Flag power usage > 500W during unscheduled hours as "Vampire Waste".', 'Calculate estimated rupees lost per hour of wasted electricity.'],
          deliverable: 'Auditing logic computing financial and energy waste in real time.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build energy audit report & recommendation cards',
          focusArea: 'UI Integration',
          actionableSteps: ['Display "Estimated Monthly Savings: ₹8,400" highlight banner.', 'Add time-of-day heatmap showing when waste peaks.', 'Add "Notify Lab Assistant" action button.'],
          deliverable: 'Executive energy audit report with concrete cost-saving actions.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Validate calculations & publish to GitHub',
          focusArea: 'Validation & Push',
          actionableSteps: ['Verify mathematical calculations against Indian commercial power tariff rates.', 'Write README on campus sustainability engineering.', 'Commit to GitHub.'],
          deliverable: 'Published energy intelligence project on GitHub.',
        },
      ],
    },
    differentiate: {
      title: 'In-Browser Web Serial Controller & Micro-ML Diagnostic Tool',
      tagline: 'Connect directly to microcontrollers over USB via Web Serial API without installing desktop software.',
      overview: 'Differentiate your project by communicating directly with Arduino and ESP32 boards using the browser Web Serial API, streaming raw serial data directly into client-side visualizers.',
      problemSolved: 'Demonstrating hardware projects traditionally requires cumbersome desktop drivers, Arduino IDE serial monitors, and native platform code.',
      targetUser: 'Robotics developers, lab instructors, and hardware hobbyists.',
      specificAiCapability: 'Direct Web Serial API hardware packet parsing + client-side digital signal filtering.',
      whyUseful: 'Cutting-edge web platform capability that bridges web browsers directly with physical silicon.',
      architecturalShift: 'Replace cloud intermediaries with direct browser-to-USB serial port streaming.',
      recommendedStack: ['Web Serial API', 'React', 'Canvas API', 'TypeScript'],
      difficulty: 'Advanced',
      nextAction: 'Request USB serial port permissions in the browser during the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Initialize Web Serial API connection',
          focusArea: 'Serial Scaffold',
          actionableSteps: ['Add "Connect Hardware Device" button calling navigator.serial.requestPort().', 'Configure baud rate to 115200.', 'Read incoming serial byte stream using TextDecoderStream.'],
          deliverable: 'Browser successfully connecting to connected USB microcontroller.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Parse packet protocol & digital low-pass filter',
          focusArea: 'Signal Processing',
          actionableSteps: ['Split serial incoming lines and parse CSV sensor telemetry.', 'Implement digital moving-average low-pass filter to clean noisy sensor jitter.', 'Handle hardware disconnect and reconnection gracefully.'],
          deliverable: 'Cleaned, noise-filtered sensor values updating live in browser memory.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build oscilloscope & calibration HUD',
          focusArea: 'Visual Interface',
          actionableSteps: ['Render 60 FPS real-time oscilloscope waveform on HTML5 canvas.', 'Add interactive calibration sliders to send config commands back over serial.', 'Display connection health telemetry.'],
          deliverable: 'In-browser hardware oscilloscope running directly in Chrome/Edge.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Test hardware simulation & publish documentation',
          focusArea: 'Documentation & Git',
          actionableSteps: ['Include software loopback mode so users without hardware can test the UI.', 'Write setup instructions with sample Arduino sketch.', 'Commit to GitHub.'],
          deliverable: 'Exceptional hardware-web bridge project published on GitHub.',
        },
      ],
    },
  },

  data: {
    domainName: 'Data Analytics, Pipelines & Machine Learning',
    upgrade: {
      title: 'Automated Exploratory Data Analysis & Anomaly Profiler',
      tagline: 'Upload any CSV file and automatically generate statistical distributions, correlations, and missing value alerts.',
      overview: 'Upgrade the data project with an instant dataset profiler that identifies column types, computes skewness, and highlights correlations without writing manual Python scripts.',
      problemSolved: 'Data science students spend tedious hours writing repetitive pandas `.describe()` and `.isnull()` code for every new dataset.',
      targetUser: 'Data science students, machine learning beginners, and research assistants.',
      specificAiCapability: 'Client-side statistical profiling (mean, median, variance, Pearson correlation).',
      whyUseful: 'Provides immediate utility for any student working on semester machine learning lab assignments.',
      architecturalShift: 'Add a client-side CSV parsing and statistical evaluation engine that operates in browser memory.',
      recommendedStack: ['PapaParse', 'React', 'TypeScript', 'Chart.js', 'Tailwind CSS'],
      difficulty: 'Beginner Friendly',
      nextAction: 'Build the Pearson correlation matrix calculation in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold CSV uploader & table preview',
          focusArea: 'Scaffold',
          actionableSteps: ['Integrate PapaParse library for fast client-side CSV parsing.', 'Add drag-and-drop file upload zone.', 'Render responsive data table showing first 10 rows with column types.'],
          deliverable: 'Working web CSV viewer displaying uploaded tabular data.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Compute column summary stats & correlations',
          focusArea: 'Statistics Engine',
          actionableSteps: ['Write utility computing min, max, mean, stdDev, and null count for numeric columns.', 'Compute Pearson correlation coefficient between numeric column pairs.', 'Detect categorical columns and compute value frequency distributions.'],
          deliverable: 'Fast statistical engine computing full summary profiles in browser.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Render interactive distribution charts & correlation matrix',
          focusArea: 'UI & Visualization',
          actionableSteps: ['Display histogram bar chart for selected numeric columns.', 'Render color-coded correlation heatmap matrix.', 'Add "Data Quality Warnings" banner flagging columns with > 20% missing values.'],
          deliverable: 'Interactive EDA dashboard with dynamic chart visualizers.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Test with 50,000 row CSV & push to GitHub',
          focusArea: 'Performance & Git',
          actionableSteps: ['Test with standard Kaggle Titanic and Iris datasets.', 'Verify sub-second parsing time for 50k row files.', 'Commit to GitHub with sample datasets.'],
          deliverable: 'High-utility data profiling project on GitHub.',
        },
      ],
    },
    transform: {
      title: 'Student Placement & Salary Trend Exploration Tool',
      tagline: 'Transform generic data scripts into an interactive career insights dashboard for engineering batches.',
      overview: 'Repurpose data analytics scripts into a campus placement insights tool that correlates GPA, project counts, and internship months with final offer bands.',
      problemSolved: 'Students lack transparent, objective data on what technical skills and profile factors actually correlate with high campus placement offers.',
      targetUser: 'Pre-final and final year engineering students preparing for campus hiring.',
      specificAiCapability: 'Multi-variable correlation analysis + placement readiness scoring.',
      whyUseful: 'Extremely high relevance to every student and placement cell coordinator.',
      architecturalShift: 'Shift from generic table statistics to domain-specific student profile readiness evaluation.',
      recommendedStack: ['React', 'Chart.js', 'TypeScript', 'Tailwind CSS'],
      difficulty: 'Intermediate',
      nextAction: 'Build the placement readiness scoring algorithm in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold student placement dataset',
          focusArea: 'Dataset Design',
          actionableSteps: ['Create synthetic dataset of 200 student placement outcomes with GPA, DSA scores, internship count, and package offer.', 'Render overview KPIs (Average CTC, Highest CTC, Placement Percentage).'],
          deliverable: 'Placement analytics overview dashboard with clean KPI cards.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement placement readiness scoring logic',
          focusArea: 'Scoring Engine',
          actionableSteps: ['Build multi-factor readiness score: weighted sum of CGPA (30%), DSA mastery (35%), and verified projects (35%).', 'Calculate tier probability (Tier 1 vs Tier 2 company offer likelihood).', 'Identify top skill gaps based on selected target company role.'],
          deliverable: 'Algorithmic readiness evaluator outputting personalized feedback.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build interactive student profile simulator',
          focusArea: 'Interactive UI',
          actionableSteps: ['Allow students to enter their own CGPA and project count using sliders.', 'Display live estimate: "Projected Offer Range: 8–12 LPA".', 'Show recommended next steps: "Building 1 full-stack AI project increases Tier-1 odds by 28%".'],
          deliverable: 'Dynamic placement readiness simulator with instant scenario projections.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Verify statistical accuracy & write README',
          focusArea: 'Review & Documentation',
          actionableSteps: ['Ensure clear disclaimers that estimates are heuristic models.', 'Test on mobile browsers.', 'Commit to GitHub.'],
          deliverable: 'Published student placement insights project on GitHub.',
        },
      ],
    },
    differentiate: {
      title: 'In-Browser K-Means Clustering & Dimensionality Projection',
      tagline: 'Visualize high-dimensional data clustering running live in the browser using WebAssembly.',
      overview: 'Differentiate your portfolio by implementing in-browser K-Means clustering and PCA projection that groups data points visually on an interactive canvas in real time.',
      problemSolved: 'Students learn machine learning algorithms purely through black-box libraries like Scikit-Learn without understanding the underlying vector mathematics.',
      targetUser: 'Machine learning students, educators, and technical recruiters.',
      specificAiCapability: 'From-scratch K-Means clustering algorithm + PCA 2D projection rendered on HTML5 canvas.',
      whyUseful: 'Writing fundamental algorithms from scratch demonstrates deep mathematical and algorithmic foundations.',
      architecturalShift: 'Implement K-Means clustering iterations in pure TypeScript with step-by-step canvas animation.',
      recommendedStack: ['React', 'HTML5 Canvas', 'TypeScript', 'Mathematical Algorithms'],
      difficulty: 'Advanced',
      nextAction: 'Write the K-Means centroid update loop in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold 2D canvas & data point generator',
          focusArea: 'Canvas Scaffold',
          actionableSteps: ['Build interactive canvas where users can click to add points or generate 3 clustered blobs.', 'Add controls for K number of clusters (2 to 6).', 'Render initial unclustered points.'],
          deliverable: 'Interactive 2D data canvas ready for clustering execution.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement K-Means from scratch in TypeScript',
          focusArea: 'Algorithm Implementation',
          actionableSteps: ['Initialize K random centroids inside data bounding box.', 'Write assignment step: assign each point to closest centroid by Euclidean distance.', 'Write update step: recalculate centroid positions as mean of assigned points.', 'Loop until centroids stabilize (< 0.001 delta).'],
          deliverable: 'Pure TypeScript K-Means algorithm operating step-by-step.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build step-by-step visualizer with controls',
          focusArea: 'Interactive Visuals',
          actionableSteps: ['Add "Step Once", "Auto Run", and "Reset" buttons.', 'Animate centroid positions moving toward cluster centers.', 'Color-code points according to their assigned cluster ID with glowing borders.'],
          deliverable: 'Mesmerizing visual clustering educational tool.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Benchmark convergence speed & document algorithm',
          focusArea: 'Validation & Push',
          actionableSteps: ['Measure convergence time across 5,000 points.', 'Write README explaining the mathematical derivation of K-Means.', 'Commit to GitHub.'],
          deliverable: 'Standout computer science educational demo on GitHub.',
        },
      ],
    },
  },

  mobile: {
    domainName: 'Mobile Applications & Cross-Platform Systems',
    upgrade: {
      title: 'Offline-First Smart Sync & Conflict Resolver',
      tagline: 'Enable full offline usability with automated multi-device sync conflict resolution.',
      overview: 'Upgrade the mobile app with an offline-first local database that queues user mutations when offline and merges them with server state when connectivity returns.',
      problemSolved: 'Mobile apps crash or lose student data when campus Wi-Fi drops or users switch between hostel networks.',
      targetUser: 'Mobile app users with intermittent internet connectivity.',
      specificAiCapability: 'Deterministic last-write-wins + operational transformation conflict resolution.',
      whyUseful: 'Offline-first architecture is one of the most sought-after skills in production mobile engineering.',
      architecturalShift: 'Introduce an IndexedDB/SQLite offline write queue that syncs in the background.',
      recommendedStack: ['React / React Native', 'Dexie.js / IndexedDB', 'TypeScript', 'Tailwind CSS'],
      difficulty: 'Beginner Friendly',
      nextAction: 'Build the offline mutation queue in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold mobile shell & offline storage',
          focusArea: 'Scaffold',
          actionableSteps: ['Set up responsive mobile-viewport container.', 'Initialize IndexedDB storage table for offline items.', 'Render connection status banner (Online / Offline).'],
          deliverable: 'Mobile interface displaying live network connectivity status.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement background mutation queue',
          focusArea: 'Sync Logic',
          actionableSteps: ['Intercept user actions when navigator.onLine is false.', 'Save pending operations into an offline queue with timestamps.', 'Listen for window "online" event and replay queued operations in order.'],
          deliverable: 'Working offline queue that automatically retries upon reconnection.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build conflict resolution & sync indicator',
          focusArea: 'UI & Feedback',
          actionableSteps: ['Add spinning sync icon when processing queued items.', 'Handle version conflicts when server item has a newer timestamp.', 'Display "All Changes Synced" confirmation badge.'],
          deliverable: 'Interactive mobile app with visible sync state feedback.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Test with simulated network throttling & publish',
          focusArea: 'Testing & Push',
          actionableSteps: ['Test offline creation using Chrome DevTools Offline mode.', 'Verify zero data loss across page refreshes.', 'Commit to GitHub.'],
          deliverable: 'Production-ready offline-first mobile web repository on GitHub.',
        },
      ],
    },
    transform: {
      title: 'Campus Lost & Found Matchmaking Companion',
      tagline: 'Transform mobile inventory into a lost-item recovery network with automated matching.',
      overview: 'Repurpose mobile list and camera capabilities into a campus lost & found network that matches lost item descriptions with found reports.',
      problemSolved: 'Students lose keys, ID cards, and calculators on campus and rely on chaotic WhatsApp status updates to retrieve them.',
      targetUser: 'College students, campus security, and library staff.',
      specificAiCapability: 'Multi-attribute heuristic matching (category, location, time window, color).',
      whyUseful: 'High viral campus utility that brings immediate value to student life.',
      architecturalShift: 'Shift from generic items to dual-sided matching pipeline (Lost vs Found).',
      recommendedStack: ['React', 'Supabase', 'TypeScript', 'Tailwind CSS'],
      difficulty: 'Intermediate',
      nextAction: 'Build the lost-to-found matching similarity score in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Set up Lost and Found report schema',
          focusArea: 'Data Models',
          actionableSteps: ['Create ItemReport schema with type (lost/found), category, location, and date.', 'Seed 10 realistic campus items (library, canteen, hostel quad).', 'Build dual-tab view (Lost Items / Found Items).'],
          deliverable: 'Clean mobile feed showing reported lost and found items.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement automated similarity matching',
          focusArea: 'Matchmaking Engine',
          actionableSteps: ['Write matching function comparing new report against opposite list.', 'Score matches: same category (+40%), location match (+30%), time within 48h (+30%).', 'Flag matches scoring > 70% as high-confidence pairs.'],
          deliverable: 'Matching algorithm linking lost items to matching found reports.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build match notification drawer & claim UI',
          focusArea: 'UI & Notifications',
          actionableSteps: ['Display "Potential Match Found!" alert banner.', 'Render side-by-side comparison of lost vs found report details.', 'Add "Claim Item" button initiating private verification chat.'],
          deliverable: 'Interactive claim workflow connecting item owner with finder.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Test false positives & mobile polish',
          focusArea: 'Review & Push',
          actionableSteps: ['Verify matching works accurately without false matches on unrelated items.', 'Test on mobile device screen sizes.', 'Commit to GitHub.'],
          deliverable: 'Complete campus lost and found app on GitHub.',
        },
      ],
    },
    differentiate: {
      title: 'On-Device Audio Noise Level & Quiet Study Space Finder',
      tagline: 'Measure real-time decibel levels using Web Audio API to map quiet campus study corners.',
      overview: 'Differentiate your mobile application by utilizing the Web Audio API to sample ambient decibel volume in real time, mapping quiet zones across campus libraries.',
      problemSolved: 'Students walk across campus searching for quiet study spots only to find libraries crowded or noisy.',
      targetUser: 'College students seeking focused study environments.',
      specificAiCapability: 'Client-side audio RMS signal processing and decibel decodification.',
      whyUseful: 'Leverages browser hardware sensors directly without external third-party hardware.',
      architecturalShift: 'Feed microphone MediaStream into Web Audio AnalyserNode calculating RMS decibel levels.',
      recommendedStack: ['Web Audio API', 'React', 'TypeScript', 'Tailwind CSS'],
      difficulty: 'Advanced',
      nextAction: 'Initialize the AudioContext and AnalyserNode in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold Web Audio capture & AnalyserNode',
          focusArea: 'Audio Scaffold',
          actionableSteps: ['Request microphone permission with navigator.mediaDevices.getUserMedia.', 'Initialize window.AudioContext and createAnalyser().', 'Render audio level meter widget.'],
          deliverable: 'Browser capturing live audio waveforms from microphone input.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Compute root-mean-square (RMS) decibels',
          focusArea: 'Acoustic Processing',
          actionableSteps: ['Read time-domain audio data using analyser.getByteTimeDomainData().', 'Calculate Root Mean Square (RMS) energy.', 'Convert RMS to approximate decibel scale: 20 * log10(rms).'],
          deliverable: 'Accurate live ambient decibel reading updated at 10 Hz.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build quiet zone categorization & map',
          focusArea: 'UI & Zones',
          actionableSteps: ['Classify noise into zones: Quiet Study (< 45 dB), Moderate (45–65 dB), Loud (> 65 dB).', 'Display color-coded decibel needle meter.', 'Add list of campus spots ranked by current quietness.'],
          deliverable: 'Visual sound meter and campus quiet study space finder.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Test noise accuracy & write documentation',
          focusArea: 'Verification & Push',
          actionableSteps: ['Test with quiet whispers vs loud claps to verify sensor responsiveness.', 'Add privacy notice confirming zero audio is recorded or stored.', 'Commit to GitHub.'],
          deliverable: 'Innovative audio intelligence project on GitHub.',
        },
      ],
    },
  },

  cloud: {
    domainName: 'Cloud, DevOps & System Infrastructure',
    upgrade: {
      title: 'Automated Container Health & Log Error Classifier',
      tagline: 'Parse streaming server logs and group error spikes by root cause using pattern matching.',
      overview: 'Upgrade the server management dashboard with automatic log parsing that classifies raw stack traces into categorized error clusters.',
      problemSolved: 'Developers drown in thousands of raw Docker/server log lines during unexpected outages.',
      targetUser: 'DevOps engineers, backend developers, and site reliability teams.',
      specificAiCapability: 'Regex tokenization + error signature grouping.',
      whyUseful: 'Teaches system observability and log analysis, which are core requirements for cloud backend roles.',
      architecturalShift: 'Place a stream parser between raw log output and the management UI.',
      recommendedStack: ['React', 'TypeScript', 'Tailwind CSS', 'Log Analysis Heuristics'],
      difficulty: 'Beginner Friendly',
      nextAction: 'Write the log signature clustering regex in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold streaming log viewer',
          focusArea: 'Scaffold',
          actionableSteps: ['Build high-contrast terminal-style dark log viewer.', 'Seed 100 realistic server logs with timestamps, levels (INFO, WARN, ERROR), and stack traces.', 'Render live auto-scrolling feed.'],
          deliverable: 'Functional terminal log viewer with color-coded log levels.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement regex error signature grouping',
          focusArea: 'Log Classifier',
          actionableSteps: ['Extract error exceptions (e.g. ConnectionTimeout, NullPointer, 404NotFound).', 'Strip unique variables (IDs, timestamps) to generate canonical error signatures.', 'Calculate error occurrence frequency over time.'],
          deliverable: 'Log classifier grouping 500 individual logs into 4 distinct root causes.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build error clustering dashboard & alert card',
          focusArea: 'UI & Visualization',
          actionableSteps: ['Display top 3 critical error clusters in highlight cards.', 'Add filter to isolate logs by error cluster.', 'Include "Generate Incident Report" button.'],
          deliverable: 'Observability console highlighting root causes at a glance.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Test with 10,000 log lines & push to GitHub',
          focusArea: 'Performance & Git',
          actionableSteps: ['Verify zero UI lag when parsing 10,000 log lines using Web Workers.', 'Document integration with real Docker log streams in README.', 'Commit to GitHub.'],
          deliverable: 'Complete log intelligence repository on GitHub.',
        },
      ],
    },
    transform: {
      title: 'Cloud Cost Optimization & Idle Resource Auditor',
      tagline: 'Analyze cloud usage metrics and identify over-provisioned instances to reduce hosting bills.',
      overview: 'Transform infrastructure metrics into an automated cloud cost auditor that highlights over-provisioned VMs and unattached storage disks.',
      problemSolved: 'Startups and engineering labs waste up to 35% of their cloud budget on forgotten development instances.',
      targetUser: 'Engineering leads, DevOps engineers, and students managing AWS/GCP credits.',
      specificAiCapability: 'Utilization threshold evaluation + rightsizing recommendation algorithm.',
      whyUseful: 'Cost optimization is currently one of the top business priorities for cloud infrastructure teams.',
      architecturalShift: 'Shift from raw CPU graphs to financial burn-rate analysis with actionable rightsizing advice.',
      recommendedStack: ['React', 'TypeScript', 'Chart.js', 'Tailwind CSS'],
      difficulty: 'Intermediate',
      nextAction: 'Implement the instance rightsizing recommendation logic in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold cloud instance inventory',
          focusArea: 'Inventory Models',
          actionableSteps: ['Create models for CloudInstance (type, CPU utilization, memory, hourly cost).', 'Seed 10 virtual machines across AWS/GCP types.', 'Render cost overview dashboard showing monthly spend run-rate.'],
          deliverable: 'Cloud resource console displaying active instances and costs.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement rightsizing recommendation algorithm',
          focusArea: 'Cost Optimization Engine',
          actionableSteps: ['Check for idle instances (average CPU < 5% over 7 days).', 'Recommend downgrading instances running below 20% capacity.', 'Calculate projected monthly dollar and rupee savings.'],
          deliverable: 'Auditor generating specific recommendations (e.g. "Downgrade t3.xlarge to t3.medium").',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build cost savings scorecard & action checklist',
          focusArea: 'UI & Recommendations',
          actionableSteps: ['Display "Potential Monthly Savings: $420 (38%)" banner.', 'Add one-click "Apply Recommended Size" toggle simulation.', 'Include list of idle unattached volumes to delete.'],
          deliverable: 'Actionable cloud financial management dashboard.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Validate financial math & publish',
          focusArea: 'Validation & Push',
          actionableSteps: ['Verify calculations against actual AWS On-Demand pricing sheets.', 'Write README on FinOps engineering principles.', 'Commit to GitHub.'],
          deliverable: 'Published cloud cost optimization tool on GitHub.',
        },
      ],
    },
    differentiate: {
      title: 'Chaos Engineering & Latency Injection Simulator',
      tagline: 'Simulate packet drops, slow DB queries, and microservice outages to test system resilience.',
      overview: 'Differentiate your backend skills by building an in-browser chaos engineering playground that injects simulated network latency and node failures to verify how frontends handle downtime.',
      problemSolved: 'Developers only test software on ideal high-speed connections and fail to prepare for production network drops.',
      targetUser: 'Backend developers, microservice architects, and QA engineers.',
      specificAiCapability: 'Simulated fault injection state machine + graceful degradation evaluator.',
      whyUseful: 'Demonstrates deep understanding of distributed systems failure modes.',
      architecturalShift: 'Insert a configurable middleware proxy that selectively delays or fails API calls.',
      recommendedStack: ['React', 'TypeScript', 'Tailwind CSS', 'Chaos Simulation Logic'],
      difficulty: 'Advanced',
      nextAction: 'Build the chaos latency injection middleware in the workshop.',
      sixtyMinuteStarterPlan: [
        {
          minuteRange: '0–15m',
          milestoneTitle: 'Scaffold microservice topology graph',
          focusArea: 'Topology UI',
          actionableSteps: ['Render visual node graph showing 4 interconnected services (Auth, Payment, Catalog, Database).', 'Display live request throughput between nodes.', 'Build control panel with chaos injection sliders.'],
          deliverable: 'Interactive microservice architecture canvas.',
        },
        {
          minuteRange: '15–30m',
          milestoneTitle: 'Implement chaos fault injection engine',
          focusArea: 'Chaos Engine',
          actionableSteps: ['Support 3 chaos scenarios: 500ms latency spike, 20% packet loss, complete service kill.', 'Route mock API traffic through chaos proxy.', 'Observe client retry behavior and timeout handling.'],
          deliverable: 'Functional chaos engine simulating realistic network degradation.',
        },
        {
          minuteRange: '30–45m',
          milestoneTitle: 'Build system resilience scorecard',
          focusArea: 'Resilience Metrics',
          actionableSteps: ['Calculate Resilience Score (0–100%) based on graceful fallback handling.', 'Flag cascading failures where one downed node crashed other services.', 'Add visual warning flashes on failing nodes.'],
          deliverable: 'Visual chaos engineering dashboard with real-time health scoring.',
        },
        {
          minuteRange: '45–60m',
          milestoneTitle: 'Test edge scenarios & push to GitHub',
          focusArea: 'Review & Documentation',
          actionableSteps: ['Document Netflix Chaos Monkey principles in README.', 'Test all chaos failure modes.', 'Commit to GitHub.'],
          deliverable: 'Outstanding distributed systems portfolio project on GitHub.',
        },
      ],
    },
  },
};

/**
 * Heuristic Domain Classifier
 * Analyzes title, description, and keywords to identify the most relevant domain matrix.
 */
export function detectDomain(input: ProjectAnalysisInput): DomainKey {
  if (input.mode === 'beginner') {
    const interest = (input.beginnerInterest || '').toLowerCase();
    if (interest.includes('weather') || interest.includes('climate')) return 'weather';
    if (interest.includes('attendance') || interest.includes('campus') || interest.includes('student')) return 'attendance';
    if (interest.includes('commerce') || interest.includes('food') || interest.includes('shop')) return 'ecommerce';
    if (interest.includes('portfolio') || interest.includes('blog') || interest.includes('web')) return 'portfolio';
    if (interest.includes('data') || interest.includes('analytics') || interest.includes('ml')) return 'data';
    if (interest.includes('iot') || interest.includes('hardware') || interest.includes('sensor')) return 'iot';
    if (interest.includes('mobile') || interest.includes('app')) return 'mobile';
    if (interest.includes('cloud') || interest.includes('devops')) return 'cloud';
    if (interest.includes('health') || interest.includes('fitness')) return 'health';
    if (interest.includes('finance') || interest.includes('money') || interest.includes('budget')) return 'finance';
    return 'general';
  }

  const text = `${input.projectTitle || ''} ${input.projectDescription || ''} ${input.techStack || ''}`.toLowerCase();

  if (text.includes('weather') || text.includes('climate') || text.includes('rain') || text.includes('aqi') || text.includes('temperature') || text.includes('forecast')) {
    return 'weather';
  }
  if (text.includes('attendance') || text.includes('absent') || text.includes('college') || text.includes('class') || text.includes('student') || text.includes('roll') || text.includes('timetable') || text.includes('faculty')) {
    return 'attendance';
  }
  if (text.includes('e-commerce') || text.includes('ecommerce') || text.includes('cart') || text.includes('food') || text.includes('shop') || text.includes('store') || text.includes('delivery') || text.includes('order') || text.includes('canteen')) {
    return 'ecommerce';
  }
  if (text.includes('portfolio') || text.includes('resume') || text.includes('blog') || text.includes('developer website') || text.includes('showcase')) {
    return 'portfolio';
  }
  if (text.includes('chat') || text.includes('message') || text.includes('messaging') || text.includes('whatsapp') || text.includes('social') || text.includes('forum') || text.includes('discussion')) {
    return 'chat';
  }
  if (text.includes('health') || text.includes('fitness') || text.includes('workout') || text.includes('gym') || text.includes('exercise') || text.includes('diet') || text.includes('hospital') || text.includes('medical')) {
    return 'health';
  }
  if (text.includes('finance') || text.includes('money') || text.includes('expense') || text.includes('budget') || text.includes('wallet') || text.includes('upi') || text.includes('crypto') || text.includes('stock')) {
    return 'finance';
  }
  if (text.includes('iot') || text.includes('sensor') || text.includes('arduino') || text.includes('esp32') || text.includes('raspberry') || text.includes('hardware') || text.includes('smart home')) {
    return 'iot';
  }
  if (text.includes('data') || text.includes('dataset') || text.includes('pandas') || text.includes('numpy') || text.includes('analytics') || text.includes('visualization') || text.includes('eda') || text.includes('pipeline')) {
    return 'data';
  }
  if (text.includes('mobile') || text.includes('flutter') || text.includes('react native') || text.includes('android') || text.includes('ios') || text.includes('swift')) {
    return 'mobile';
  }
  if (text.includes('cloud') || text.includes('devops') || text.includes('docker') || text.includes('kubernetes') || text.includes('aws') || text.includes('server') || text.includes('backend') || text.includes('log') || text.includes('monitoring')) {
    return 'cloud';
  }

  return 'general';
}

/**
 * Project Evolution Engine Core Synthesizer
 * Deterministic generation adapting to project name, user tech stack, and detected domain.
 */
export function generateProjectEvolution(input: ProjectAnalysisInput): ProjectEvolutionResult {
  const domainKey = detectDomain(input);
  const template = DOMAIN_TEMPLATES[domainKey] || DOMAIN_TEMPLATES.general;

  const originalName =
    input.mode === 'beginner'
      ? input.beginnerInterest || 'New Student Project Idea'
      : (input.projectTitle || 'Existing Project').trim();

  // Create customized paths with specific title and context
  const upgradePath: EvolutionPath = {
    id: `upgrade_${Date.now()}`,
    track: 'upgrade',
    badgeLabel: 'Upgrade Direction',
    ...template.upgrade,
  };

  const transformPath: EvolutionPath = {
    id: `transform_${Date.now()}`,
    track: 'transform',
    badgeLabel: 'Transform Direction',
    ...template.transform,
  };

  const differentiatePath: EvolutionPath = {
    id: `differentiate_${Date.now()}`,
    track: 'differentiate',
    badgeLabel: 'Differentiate Direction',
    ...template.differentiate,
  };

  return {
    originalProject: originalName,
    domain: template.domainName,
    paths: {
      upgrade: upgradePath,
      transform: transformPath,
      differentiate: differentiatePath,
    },
  };
}

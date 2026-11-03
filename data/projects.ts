export type Category = "ML" | "Web" | "Mobile" | "Other";
export type Status = "completed" | "in-progress" | "upcoming";
export type Tier = "flagship" | "solid" | "foundation" | "upcoming";

export type Project = {
  title: string;
  slug: string; // used in the URL: /projects/<slug>
  tagline: string;
  category: Category;
  status: Status;
  tier: Tier;
  featured: boolean; // true = shows on the homepage
  date: string; // "YYYY-MM-DD", drives the timeline order
  dateLabel?: string; // optional display text like "Sept 2026" or "Ongoing"; date still sorts
  role: string;
  team: string;
  problem: string;
  approach: string;
  result: string;
  signatureStat: { value: string; label: string };
  accent: string; // this project's own color (hex)
  tech: string[];
  features: string[];
  challenges: string;
  learnings: string;
  links: {
    github: string | null; // null = "Repository coming soon" (unless extra has links)
    extra?: { label: string; url: string }[]; // optional extra repos, e.g. Foundations
  };
  diagram?: { type: "flow"; nodes: { label: string; sub?: string }[] };
  screenshots?: { src: string; caption: string }[]; // optional, hidden when empty
};

export const projects: Project[] = [
  {
    title: "Waste Classification Using CNN",
    slug: "waste-classification",
    tagline: "Sorting waste images into 9 classes with a fine-tuned MobileNetV2",
    category: "ML",
    status: "completed",
    tier: "flagship",
    featured: true,
    date: "2026-08-30",
    role: "Co-lead. Built the baseline CNN, ran the Label Smoothing vs Focal Loss experiment, and worked on the Streamlit app (model wiring, bug fixes).",
    team: "Team of 7, co-led with Mukta",
    problem:
      "Classify waste images into 9 classes using the RealWaste dataset (4,752 images), as a college deep learning project.",
    approach:
      "Started with a baseline CNN, then fine-tuned MobileNetV2 using transfer learning with two-phase training. The winning ideas from the team's experiments were combined into the final configuration, with 5-crop test-time augmentation on top.",
    result:
      "92.99% test accuracy and 0.9359 macro-F1, up from 69.7% for the baseline CNN and 84.3% for the early MobileNetV2. The weakest class is Miscellaneous Trash (F1 0.87). Presented and defended live.",
    signatureStat: { value: "92.99%", label: "test accuracy" },
    accent: "#a3e635",
    tech: ["Python", "PyTorch", "MobileNetV2", "Google Colab", "Streamlit", "OpenCV"],
    features: [
      "Upload an image and get a classification with confidence bars",
      "Live webcam detection",
      "Model Specs tab",
      "Light/dark toggle",
    ],
    challenges:
      "Streamlit bugs: CSS leaking out as text, camera Stop-button lag, and a theme toggle crash. Also, a glass tumbler was misclassified because of a domain gap in the dataset.",
    learnings: "",
    links: { github: "https://github.com/Katekar3/waste-classifier" },
    diagram: {
      type: "flow",
      nodes: [
        { label: "RealWaste dataset", sub: "9 classes, 4,752 images" },
        { label: "Baseline CNN", sub: "69.7%" },
        { label: "MobileNetV2", sub: "transfer learning, two-phase training" },
        { label: "Final config", sub: "+ 5-crop test-time augmentation" },
        { label: "Streamlit app" },
      ],
    },
  },
  {
    title: "Codinagent (Jarvis)",
    slug: "codinagent",
    tagline: "A personal task-automation agent with a safety policy, running 24/7",
    category: "Other",
    status: "completed",
    tier: "flagship",
    featured: true,
    date: "2026-10-11",
    role: "Solo developer, end to end",
    team: "Solo",
    problem:
      "A personal task-automation agent with a web UI, task queue, schedules and Telegram remote control, running 24/7 on my laptop as a background service.",
    approach:
      "Flask backend with SSE streaming and a React/Vite UI. A tool-using agent loop rotates across Groq, Gemini and OpenRouter models, with 5 selectable gears (presets). A safety policy classifies every tool call as LOW, MEDIUM, HIGH or DENY under SAFE, ASSISTED or AUTONOMOUS modes, with approval cards. A SQLite queue and scheduler handle tasks.",
    result:
      "v1 complete (finished around 11 Oct 2026). Repository is being cleaned up with fixes before it goes public.",
    signatureStat: { value: "3 · 5 · 3", label: "providers · gears · autonomy modes" },
    accent: "#f59e0b",
    tech: [
      "Python",
      "Flask",
      "React",
      "Vite",
      "SQLite",
      "SSE",
      "Groq",
      "Google Gemini",
      "OpenRouter",
      "Tavily",
      "Telegram Bot API",
    ],
    features: [
      "Web UI with a task queue and schedules",
      "Telegram remote control, restricted to my own chat ID",
      "5 selectable gears (presets) across 3 model providers",
      "Approval cards for risky tool calls",
      "Sub-agent delegation: coder, researcher, tester, reviewer",
      "/paste applies code blocks to files with no model call",
      "Secrets redacted from logs",
    ],
    challenges:
      "Free-tier rate limits, solved by auto-rotating to the next model. The agent also got stuck repeating failing tool calls, so I added a loop guard that nudges it first, then stops and asks.",
    learnings: "",
    links: { github: null },
    diagram: {
      type: "flow",
      nodes: [
        { label: "Web UI or Telegram", sub: "Telegram limited to my chat ID" },
        { label: "Flask backend", sub: "SSE streaming, SQLite queue + scheduler" },
        { label: "Agent loop", sub: "rotates Groq / Gemini / OpenRouter" },
        { label: "Safety policy", sub: "LOW / MEDIUM / HIGH / DENY" },
        { label: "Tool call" },
      ],
    },
  },
  {
    title: "AnnaDaan",
    slug: "annadaan",
    tagline: "A food donation app connecting donors and recipients, with an ML layer on the way",
    category: "Web",
    status: "in-progress",
    tier: "flagship",
    featured: true,
    date: "2026-11-04",
    dateLabel: "Ongoing",
    role: "Built the foundation and screens 1-5 (Splash, Login, Home, AddDonation, DonationDetail), Firebase auth, live Firestore donations, Cloudinary photo upload and native Google Sign-In. 50/50 split with Mukta.",
    team: "Team of 2, with Mukta",
    problem:
      "A food donation app that connects donors and recipients. The base app was judged too basic, so an ML layer is being added to make it smarter about food safety and demand.",
    approach:
      "Started in Flutter, then rebuilt as a responsive React web app, with Capacitor wrapping it for mobile. Donations follow a 4-phase claim flow: Post, Request, Pickup, Delivered. A recipient's request can be cancelled while it's still pending. Planned, not built yet: a cooked-meal freshness classifier and donation-volume forecasting. A rule-based FSSAI safety layer comes first, a 50-60 image pilot dataset acts as a go/no-go gate before any CNN training, and Grad-CAM is planned for explainability.",
    result:
      "In progress. The base app is built; the ML layer is still planned and not built yet.",
    signatureStat: { value: "4-phase", label: "claim flow" },
    accent: "#fb7185",
    tech: [
      "React",
      "Vite",
      "Tailwind",
      "shadcn/ui",
      "Capacitor",
      "Firebase Auth",
      "Firestore",
      "Cloudinary",
      "Leaflet + OpenStreetMap",
    ],
    features: [
      "Firebase auth with native Google Sign-In",
      "Live Firestore donations",
      "Cloudinary photo upload",
      "Screens: Splash, Login, Home, AddDonation, DonationDetail",
      "Responsive web app, wrapped for mobile with Capacitor",
    ],
    challenges:
      "signInWithPopup breaks inside the Capacitor WebView, fixed by switching to @capgo/capacitor-social-login. GitHub also flagged a leaked Google API key, so I rotated it and moved it to .env.local.",
    learnings: "",
    links: { github: "https://github.com/Muktacore/annadaan-web" },
    diagram: {
      type: "flow",
      nodes: [
        { label: "1. Post", sub: "donor posts food, donation: available" },
        { label: "2. Request", sub: "recipient requests it, claim: Pending" },
        { label: "3. Pickup", sub: "donor accepts, then marks picked up, claim: RequestAccepted" },
        { label: "4. Delivered", sub: "claim: Claimed, leaves the available lists" },
      ],
    },
  },
  {
    title: "PitGuard",
    slug: "pitguard",
    tagline: "An underground mine safety dashboard with ML hazard detection",
    category: "Web",
    status: "completed",
    tier: "solid",
    featured: false,
    date: "2026-07-20",
    role: "Designed the MySQL schema by hand, wrote the rule-based risk logic, chose Isolation Forest, and came up with the drilling-animation login page. CRUD routes and styling were AI-assisted.",
    team: "Solo",
    problem:
      "A mine safety dashboard that tracks gas, air quality, temperature and humidity across zones and raises alerts when readings look dangerous. It runs on simulated sensor data.",
    approach:
      "I hand-designed the MySQL schema (zones, workers, sensor readings, alerts, users) and wrote rule-based risk logic. For ML hazard detection I chose Isolation Forest, an unsupervised method, because any labels would only come from my own thresholds. Built with Flask, Flask-SQLAlchemy and MySQL, with an HTML, Tailwind and vanilla JS front end.",
    result:
      "No measured result: the sensor data is simulated. Deployed on Render + Aiven.",
    signatureStat: { value: "Isolation Forest", label: "anomaly detection" },
    accent: "#38bdf8",
    tech: [
      "Flask",
      "Flask-SQLAlchemy",
      "MySQL",
      "Isolation Forest",
      "HTML",
      "Tailwind",
      "JavaScript",
      "Render",
      "Aiven",
    ],
    features: [
      "Dashboard for gas, air quality, temperature and humidity readings",
      "Alerts when readings look dangerous",
      "Rule-based risk logic plus Isolation Forest hazard detection",
      "Cinematic drilling-animation login page",
      "Schema covering zones, workers, sensor readings, alerts and users",
    ],
    challenges: "",
    learnings: "",
    links: { github: "https://github.com/Katekar3/pitguard" },
    diagram: {
      type: "flow",
      nodes: [
        { label: "Simulated sensor data", sub: "gas, air quality, temperature, humidity" },
        { label: "Flask + MySQL", sub: "zones, workers, readings, alerts, users" },
        { label: "Risk detection", sub: "rule-based logic + Isolation Forest" },
        { label: "Alerts" },
        { label: "Dashboard" },
      ],
    },
  },
  {
    title: "SkillBridge (SIH26044)",
    slug: "skillbridge",
    tagline: "A skill-gap matching platform with an explainable Placement Readiness Score",
    category: "Web",
    status: "upcoming",
    tier: "upcoming",
    featured: false,
    date: "2026-09-01",
    dateLabel: "Sept 2026",
    role: "Team member. The Career Path Simulator is my signature feature.",
    team: "The Outliers, 6 people, Govt Polytechnic Mumbai",
    problem:
      "A Smart India Hackathon project: an academia-industry portal that matches students' skills against what industry needs.",
    approach:
      "Planned, not built: skill-gap matching, an explainable Placement Readiness Score, a Career Path Simulator, peer benchmarking and a separate academician role. Planned stack is React, Tailwind, Supabase, and FastAPI with sentence-transformers.",
    result:
      "Idea and solution submitted. No prototype and no repository yet.",
    signatureStat: { value: "Idea submitted", label: "Smart India Hackathon" },
    accent: "#c084fc",
    tech: ["React", "Tailwind", "Supabase", "FastAPI", "sentence-transformers"],
    features: [
      "Skill-gap matching (planned)",
      "Explainable Placement Readiness Score (planned)",
      "Career Path Simulator (planned)",
      "Peer benchmarking (planned)",
      "Separate academician role (planned)",
    ],
    challenges: "",
    learnings: "",
    links: { github: null },
  },
  {
    title: "Learning path",
    slug: "learning-path",
    tagline: "Three small ML projects that got me from first CNN to a fine-tuned transformer",
    category: "ML",
    status: "completed",
    tier: "foundation",
    featured: false,
    date: "2026-07-06",
    dateLabel: "6-7 Jul 2026",
    role: "Built all three classifiers and their Streamlit apps as learning projects.",
    team: "UNKNOWN",
    problem:
      "Learn the fundamentals of deep learning by building and deploying three small classifiers.",
    approach:
      "An MNIST digit classifier and a Fashion-MNIST classifier, then a DistilBERT sentiment model fine-tuned with HuggingFace. Each one has a Streamlit app.",
    result:
      "MNIST: 98.24% accuracy. Fashion-MNIST: 90+% accuracy (exact figure unknown). DistilBERT sentiment: 88.4% accuracy.",
    signatureStat: { value: "98.24% / 90+% / 88.4%", label: "MNIST / Fashion-MNIST / DistilBERT" },
    accent: "#2dd4bf",
    tech: ["Python", "CNNs", "HuggingFace", "DistilBERT", "Streamlit"],
    features: [
      "MNIST digit classifier (6 Jul)",
      "Fashion-MNIST classifier (6 Jul)",
      "DistilBERT sentiment analysis (7 Jul)",
      "Streamlit app for each one",
    ],
    challenges: "",
    learnings:
      "Together they cover CNNs, DataLoaders, training loops, tokenization, the Trainer API and deployment.",
    links: {
      github: null,
      extra: [
        { label: "MNIST", url: "https://github.com/Katekar3/digit-recognizer" },
        { label: "Fashion-MNIST", url: "https://github.com/Katekar3/fashion-recognizer" },
        { label: "DistilBERT sentiment", url: "https://github.com/Katekar3/transformer-sentiment-analysis" },
      ],
    },
  },
  // NEXT ENTRIES GO ABOVE THIS LINE
];

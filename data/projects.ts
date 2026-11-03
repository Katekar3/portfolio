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
  links: { github: string | null }; // null = "Repository coming soon"
  diagram?: { type: "flow"; nodes: { label: string; sub?: string }[] };
  screenshots?: { src: string; caption: string }[]; // optional, hidden when empty
};

export const projects: Project[] = [
  {
    title: "Dummy Flagship",
    slug: "dummy-flagship",
    tagline: "Placeholder, not a real project",
    category: "ML",
    status: "completed",
    tier: "flagship",
    featured: true,
    date: "2026-08-30",
    role: "DUMMY role",
    team: "DUMMY team",
    problem: "DUMMY problem text.",
    approach: "DUMMY approach text.",
    result: "DUMMY result text.",
    signatureStat: { value: "00.00%", label: "dummy stat" },
    accent: "#f59e0b",
    tech: ["Python", "PyTorch"],
    features: ["Dummy feature one", "Dummy feature two"],
    challenges: "DUMMY challenges.",
    learnings: "DUMMY learnings.",
    links: { github: "https://github.com/Katekar3" },
    diagram: {
      type: "flow",
      nodes: [{ label: "Input" }, { label: "Model", sub: "dummy step" }, { label: "Output" }],
    },
  },
  {
    title: "Dummy Solid",
    slug: "dummy-solid",
    tagline: "Placeholder, not a real project",
    category: "Web",
    status: "in-progress",
    tier: "solid",
    featured: false,
    date: "2026-07-20",
    role: "DUMMY role",
    team: "Solo",
    problem: "DUMMY problem text.",
    approach: "DUMMY approach text.",
    result: "DUMMY result text.",
    signatureStat: { value: "Dummy", label: "dummy stat" },
    accent: "#38bdf8",
    tech: ["Flask", "MySQL"],
    features: ["Dummy feature"],
    challenges: "DUMMY challenges.",
    learnings: "DUMMY learnings.",
    links: { github: null },
  },
  {
    title: "Dummy Foundation",
    slug: "dummy-foundation",
    tagline: "Placeholder, not a real project",
    category: "ML",
    status: "completed",
    tier: "foundation",
    featured: false,
    date: "2026-07-06",
    role: "DUMMY role",
    team: "Solo",
    problem: "DUMMY problem text.",
    approach: "DUMMY approach text.",
    result: "DUMMY result text.",
    signatureStat: { value: "Dummy", label: "dummy stat" },
    accent: "#a3e635",
    tech: ["Python"],
    features: ["Dummy feature"],
    challenges: "DUMMY challenges.",
    learnings: "DUMMY learnings.",
    links: { github: null },
  },
];
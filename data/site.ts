export const site = {
  name: "Yashmit Katekar",
  // One-line intro under the name. Change freely.
  intro: "Final-year AI & ML student. I ship projects, then learn from what broke.",
  // Small mono line under the intro. Set to null to hide it.
  availability: null as string | null,

  // "Now building" chip in the hero. slug must match a project in data/projects.ts.
  // Set to null to hide the chip.
  nowBuilding: {
    text: "AnnaDaan, a food donation app",
    slug: "annadaan",
  } as { text: string; slug: string } | null,

  // One typed highlight next to the computed "shipped" count. null = hidden.
  // Keep in sync with the project's real result.
  highlight: {
    value: "92.99%",
    label: "test accuracy, Waste Classification",
  } as { value: string; label: string } | null,

  // Currently learning. Empty array = the whole section is hidden.
  learning: [
    { label: "Cybersecurity", note: "on TryHackMe" },
    { label: "LeetCode", note: "Just starting" },
    { label: "LLMs", note: "Stanford lectures on YouTube" },
  ] as { label: string; note?: string }[],

  links: {
    email: "katekaryashmit@gmail.com",
    github: "https://github.com/Katekar3",
    linkedin: "https://www.linkedin.com/in/yashmit-katekar/",
    // File must exist at public/resume.pdf. Set to null to hide the button.
    resume: "/resume.pdf" as string | null,
  },
};

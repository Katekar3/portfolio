export const site = {
  name: "Yashmit Katekar",
  // One-line intro under the name. Change freely.
  intro:
    "Final-year AI & ML diploma student. I build real ML projects and I'm always picking up something new.",
  // Small mono line under the intro. Set to null to hide it.
  availability: null as string | null,

  // Currently learning. Empty array = the whole section is hidden.
  // Example: { label: "Topic name", note: "optional short note" }
  learning: [] as { label: string; note?: string }[],

  links: {
    email: "katekaryashmit@gmail.com",
    github: "https://github.com/Katekar3",
    linkedin: "https://www.linkedin.com/in/yashmit-katekar/",
    // File must exist at public/resume.pdf. Set to null to hide the button.
    resume: "/resume.pdf" as string | null,
  },
};

// Short, true lines pulled from the projects. Typed by hand (like site.highlight), so keep them in sync.
export type BrokeItem = {
  slug: string; // project this belongs to
  project: string; // label shown on the card
  broke: string; // what went wrong
  fix: string; // what I did about it
};

export const broke: BrokeItem[] = [
  {
    slug: "annadaan",
    project: "AnnaDaan",
    broke: "A Google API key leaked and GitHub flagged it.",
    fix: "Rotated the key and moved it into .env.local.",
  },
  {
    slug: "annadaan",
    project: "AnnaDaan",
    broke: "Google sign-in popup broke inside the Capacitor mobile wrapper.",
    fix: "Switched to native sign-in with @capgo/capacitor-social-login.",
  },
  {
    slug: "codinagent",
    project: "Codinagent",
    broke: "The agent got stuck repeating the same failing tool call.",
    fix: "Added a loop guard that nudges it, then stops and asks me.",
  },
  {
    slug: "road-damage-detection",
    project: "Road Damage Detection",
    broke: "Early dashcam runs flagged brick walls, kerbs and road markings.",
    fix: "Added a road-area filter, since a higher cutoff didn't remove them.",
  },
];

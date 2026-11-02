import { projects, type Tier } from "@/data/projects";

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const getByTier = (tier: Tier) => projects.filter((p) => p.tier === tier);
export const getFeatured = () => projects.filter((p) => p.featured);
export const getTimeline = () =>
  [...projects].sort((a, b) => a.date.localeCompare(b.date)); // oldest to newest
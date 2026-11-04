<h1 align="center">Yashmit Katekar | Portfolio</h1>

<p align="center">
  My personal portfolio: real projects first, with the story of what I built and what I learned from each one.<br>
  Data-driven, so adding a project is one entry in one file.
</p>

<p align="center">
  <a href="https://portfolio-3109.vercel.app/"><b>portfolio-3109.vercel.app</b></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white" alt="Vercel">
</p>

<!-- Add a screenshot or GIF of the site here:
<p align="center"><img src="docs/demo.gif" width="720" alt="Site demo"></p>
-->

---

## Overview

A brand-new portfolio built from scratch with Next.js. The projects are the hero: every project is a single data entry, and one reusable detail template turns it into a full page (problem, approach, result, what I learned). No layouts are edited by hand.

The home page is a scroll-animated timeline of how I got here. The projects page ranks work into tiers (Flagship, Solid, Foundations, Upcoming) with filters.

## Pages

| Route | What it shows |
|---|---|
| `/` | Hero, "How I got here" timeline, currently learning, contact links |
| `/projects` | Ranked project cards with category and tech filters |
| `/projects/[slug]` | Detail page generated from one project entry |
| `/about` | Bio and grouped skills |
| `/contact` | Email, GitHub, LinkedIn and resume links |

There is also a custom 404, a favicon and a generated link-preview image.

## Features

- **One entry per project.** The card, the detail page, the timeline and the stats all read from `data/projects.ts`.
- **Optional sections hide themselves.** Flow diagram, growth strip, safety ladder and screenshots only appear when a project has that data.
- **Code-built visuals.** Cards use a signature stat, tech badges and a per-project accent color instead of screenshots.
- **Screenshots stay separate.** They live in an optional "Screens" section at the bottom of the detail page, with a swipeable carousel and a tap-to-enlarge viewer.
- **Subtle animation.** Motion handles the hero and timeline. anime.js handles the flow diagrams, growth bars, safety ladder and stat count-up. It is loaded only when needed, and everything switches off with "reduce motion".
- **Mobile friendly.** Wide content like the safety ladder scrolls inside its own box instead of stretching the page.

## Tech stack

| Part | Tool |
|---|---|
| Framework | Next.js (App Router) + React |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Motion (`motion/react`) and anime.js |
| Hosting | Vercel, deployed from GitHub |

## Project structure

```
app/            pages, layout, 404, favicon, link-preview image
components/     cards, timeline, filters, diagrams, carousels, lightbox
data/           projects.ts, site.ts, about.ts (all the content)
lib/            helpers to read and sort the project data
public/         resume.pdf and screenshots
```

## Getting started

```bash
git clone https://github.com/Katekar3/portfolio.git
cd portfolio
npm install
npm run dev
```

Open http://localhost:3000.

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (run this before pushing) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Adding a project

1. Open `data/projects.ts`.
2. Copy an existing entry and paste it **above** the line `// NEXT ENTRIES GO ABOVE THIS LINE`.
3. Fill in the fields:
   - `slug` becomes the URL: `/projects/<slug>`.
   - `status`: `completed`, `in-progress` or `upcoming`.
   - `tier`: `flagship`, `solid`, `foundation` or `upcoming`.
   - `date` is `YYYY-MM-DD` and is only used for sorting. `dateLabel` is the text shown (for example "Nov 2026").
   - `accent` is a 6-digit hex color for the card and charts.
   - `links.github` is `null` if the repo is private. Only link public repos.
4. Leave `challenges` or `learnings` as `""` to hide those sections.
5. Optional extras: `diagram`, `growth`, `ladder` and `screenshots`. Leave them out and they stay hidden.
6. Run `npm run build`, then push. Vercel redeploys automatically.

**Screenshots** go in `public/screens/<slug>/`, and each entry is `{ src: "/screens/<slug>/1.png", caption: "..." }`. File names are case-sensitive on Vercel. Check every image for keys, tokens, chat IDs and personal details first.

**Site-wide text** (name, intro, "now building", highlight stat, links) lives in `data/site.ts`. The "projects shipped" number is computed from the data, but the highlight stat is typed by hand, so keep it in sync.

## Design notes

- **Warm-dark base** with a warm accent. Monospace for labels, stats and tags, a friendly sans for body text.
- **Only true claims.** The projects have no live-demo links, and every result on the site is a number I measured. Projects that are not built yet are marked as planned or upcoming.

## Contact

- GitHub: [Katekar3](https://github.com/Katekar3)
- LinkedIn: [yashmit-katekar](https://www.linkedin.com/in/yashmit-katekar/)
- Email: katekaryashmit@gmail.com

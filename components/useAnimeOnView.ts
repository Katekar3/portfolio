"use client";

import { useEffect, useRef } from "react";

type Anime = typeof import("animejs");

// Runs `play` once, the first time the element is about to scroll into view.
// - anime.js is downloaded only at that moment (lazy), so it never slows the first load.
// - With "reduce motion" on, nothing runs and the final state just stays as rendered.
// - Anime instances are cleaned up when the component unmounts.
export function useAnimeOnView<T extends HTMLElement>(play: (root: T, anime: Anime) => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let scope: { revert: () => void } | null = null;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        import("animejs").then((anime) => {
          if (cancelled) return;
          scope = anime.createScope({ root: el }).add(() => play(el, anime));
        });
      },
      // Start a little before it is visible, so the "hidden" start state is never seen
      { rootMargin: "0px 0px 200px 0px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      scope?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

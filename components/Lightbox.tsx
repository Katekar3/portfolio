"use client";

import { useEffect, useState } from "react";

type Shot = { src: string; caption: string };

function Viewer({ shot, onClose }: { shot: Shot; onClose: () => void }) {
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={shot.caption}
      className="fixed inset-0 z-50 flex flex-col bg-black/90"
    >
      <div className="flex items-start justify-between gap-4 p-4">
        <p className="font-mono text-xs text-muted">{shot.caption}</p>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-full border border-border px-3 py-1 font-mono text-xs hover:border-muted"
        >
          Close ✕
        </button>
      </div>

      {/* Clicking the dark area closes. m-auto on the image centers it and still lets it scroll when zoomed. */}
      <div
        className="flex min-h-0 flex-1 overflow-auto px-3 pb-3"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot.src}
          alt={shot.caption}
          onClick={() => setZoom((z) => !z)}
          className={`m-auto rounded-lg ${
            zoom
              ? "max-h-none max-w-none cursor-zoom-out"
              : "max-h-[80vh] max-w-full cursor-zoom-in object-contain"
          }`}
        />
      </div>

      <p className="pb-3 text-center font-mono text-xs text-muted">
        {zoom ? "Tap the image to fit the screen" : "Tap the image to zoom in"}
      </p>
    </div>
  );
}

// key={shot.src} gives every opened image a fresh viewer, so zoom always starts reset.
export default function Lightbox({ shot, onClose }: { shot: Shot | null; onClose: () => void }) {
  if (!shot) return null;
  return <Viewer key={shot.src} shot={shot} onClose={onClose} />;
}

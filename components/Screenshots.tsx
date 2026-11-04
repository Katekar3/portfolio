"use client";

import { useState } from "react";

type Shot = { src: string; caption: string };

// Wide screenshots (desktop UIs) take a full row so they stay readable.
// Portrait screenshots (phone/narrow) sit side by side with a height cap.
// Shape is detected when each image loads, so you never set it by hand.
export default function Screenshots({ shots }: { shots: Shot[] }) {
  const [wide, setWide] = useState<Record<string, boolean>>({});

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {shots.map((s) => {
        const isWide = wide[s.src] ?? false;
        return (
          <figure
            key={s.src}
            className={`flex flex-col ${isWide ? "sm:col-span-2" : ""}`}
          >
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-border bg-card p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt={s.caption}
                loading="lazy"
                onLoad={(e) => {
                  const img = e.currentTarget;
                  const w = img.naturalWidth >= img.naturalHeight;
                  setWide((prev) => (prev[s.src] === w ? prev : { ...prev, [s.src]: w }));
                }}
                className={
                  isWide
                    ? "h-auto w-full rounded-lg"
                    : "max-h-[26rem] w-auto max-w-full rounded-lg object-contain"
                }
              />
            </div>
            <figcaption className="mt-2 px-1 font-mono text-xs text-muted">
              {s.caption}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

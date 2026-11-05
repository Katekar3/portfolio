"use client";

import { useState } from "react";

// Three ways to reach me, because a plain mailto: link does nothing on devices
// with no default mail app (very common on desktops that use Gmail in the browser).
// - Email: normal mailto (works on phones and with a mail app)
// - Gmail: opens Gmail's compose window in a new tab with my address filled in
// - Copy: copies the address, always works
export default function EmailActions({ email, className }: { email: string; className: string }) {
  const [copied, setCopied] = useState(false);
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (rare): show the address so it can be copied by hand
      window.prompt("Copy my email:", email);
    }
  }

  return (
    <>
      <a href={`mailto:${email}`} className={className}>
        Email
      </a>
      <a href={gmail} target="_blank" rel="noreferrer" className={className}>
        Gmail ↗
      </a>
      <button type="button" onClick={copy} className={className} aria-live="polite">
        {copied ? "Copied ✓" : "Copy email"}
      </button>
    </>
  );
}

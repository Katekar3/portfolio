import type { Metadata } from "next";
import Link from "next/link";
import EmailActions from "@/components/EmailActions";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Contact | Yashmit Katekar" };

const pill =
  "rounded-full border border-border px-4 py-2 font-mono text-sm hover:border-muted";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/" className="font-mono text-sm text-muted hover:text-foreground">
        ← Home
      </Link>

      <h1 className="mt-8 text-4xl font-bold">Say hi</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Drop me an email, or find me on GitHub and LinkedIn.
      </p>

      {/* The card is the normal mailto link (works on phones and with a mail app) */}
      <a
        href={`mailto:${site.links.email}`}
        className="mt-8 inline-block rounded-2xl border border-border bg-card px-6 py-4 font-mono text-lg transition hover:border-muted"
      >
        {site.links.email}
      </a>

      {/* No mail app set up? These two always work */}
      <div className="mt-3 flex flex-wrap gap-3">
        <EmailActions email={site.links.email} className={pill} showMailto={false} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={site.links.github} target="_blank" rel="noreferrer" className={pill}>
          GitHub ↗
        </a>
        <a href={site.links.linkedin} target="_blank" rel="noreferrer" className={pill}>
          LinkedIn ↗
        </a>
        {site.links.resume && (
          <a href={site.links.resume} target="_blank" rel="noreferrer" className={pill}>
            Resume ↗
          </a>
        )}
      </div>
    </main>
  );
}

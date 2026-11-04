import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Not found | Yashmit Katekar" };

const pill =
  "rounded-full border border-border px-4 py-2 font-mono text-sm hover:border-muted";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <div className="font-mono text-sm text-muted">404</div>
      <h1 className="mt-3 text-4xl font-bold">Nothing cooking here</h1>
      <p className="mt-3 max-w-xl text-lg text-muted">
        That page doesn&apos;t exist, or it moved. The projects are a safer bet.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className={pill}>
          ← Home
        </Link>
        <Link href="/projects" className={pill}>
          See projects →
        </Link>
      </div>
    </main>
  );
}

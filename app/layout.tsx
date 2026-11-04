import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-3109.vercel.app"),
  openGraph: {
    title: "Yashmit Katekar | AI & ML Portfolio",
    description:
      "Portfolio of Yashmit Katekar, a final-year AI & ML diploma student. Real ML and web projects, with the problem, approach and result for each.",
    type: "website",
  },
  title: "Yashmit Katekar | AI & ML Portfolio",
  description:
    "Portfolio of Yashmit Katekar, a final-year AI & ML diploma student. Real ML and web projects, with the problem, approach and result for each.",
};

// Edit this list to add or remove nav links (header and footer both use it)
const nav = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <header className="border-b border-border">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="font-semibold hover:text-muted">
              {site.name}
            </Link>
            <nav className="flex items-center gap-5 font-mono text-sm text-muted">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="hover:text-foreground">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {children}

        <footer className="mt-auto border-t border-border">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 font-mono text-xs text-muted">
            <span>{site.name}</span>
            <div className="flex flex-wrap gap-4">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="hover:text-foreground">
                  {n.label}
                </Link>
              ))}
              <a
                href={site.links.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                GitHub ↗
              </a>
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

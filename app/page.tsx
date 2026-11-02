import { getTimeline } from "@/lib/projects";

export default function Home() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Data test</h1>
      <ul>
        {getTimeline().map((p) => (
          <li key={p.slug}>
            {p.title}: {p.signatureStat.value} ({p.tier})
          </li>
        ))}
      </ul>
    </main>
  );
}
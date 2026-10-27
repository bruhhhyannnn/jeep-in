import type { StopPoint } from "./model";

/** Name, address and landmark are all searched. */
export function matchesStop(stop: StopPoint, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [stop.name, stop.address, stop.landmark ?? ""].some((v) => v.toLowerCase().includes(q));
}

/** Words that appear in stop names and landmarks on this route, most common first. */
export function suggestionWords(stops: StopPoint[], limit = 4) {
  const counts = new Map<string, { word: string; n: number }>();
  for (const stop of stops) {
    const words = `${stop.name} ${stop.landmark ?? ""}`.split(/[^\p{L}\p{N}]+/u);
    for (const word of words) {
      if (word.length < 4) continue;
      const key = word.toLowerCase();
      const entry = counts.get(key) ?? { word, n: 0 };
      entry.n += 1;
      counts.set(key, entry);
    }
  }
  return [...counts.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, limit)
    .map((e) => e.word);
}

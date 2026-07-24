import type { Friend } from "./friends";

export const WAYPOINTS = [
  { id: "the-realm", title: "The Realm" },
  { id: "ever-after", title: "Ever After" },
  { id: "the-ball", title: "The Ball" },
  { id: "beat-drop", title: "Beat Drop" },
  { id: "ceo-era", title: "CEO Era" },
] as const;

export type WaypointId = (typeof WAYPOINTS)[number]["id"];

/**
 * Passive interest "sprinkles" — the fandoms she loves, woven into the
 * scroll as kinetic title cards you pass through (no interaction gate).
 * `word` is the oversized poster title, `kicker`/`flavor` the framing,
 * `motif` a single glyph. `t` positions its duotone on the sunrise arc.
 */
export type InterestMeta = {
  kicker: string;
  word: string;
  flavor: string;
  motif: string;
  t: number;
};

export const INTERESTS: Record<WaypointId, InterestMeta> = {
  "the-realm": {
    kicker: "She rolls for initiative",
    word: "THE REALM",
    flavor: "Dungeons, dragons, and a Nat 20 charisma check she passes just by walking in.",
    motif: "⚔",
    t: 0.12,
  },
  "ever-after": {
    kicker: "A certified Disney adult",
    word: "EVER AFTER",
    flavor: "The happily-ever-after energy, minus the waiting-around-for-it part.",
    motif: "✦",
    t: 0.34,
  },
  "the-ball": {
    kicker: "Welcome to the ton",
    word: "THE BALL",
    flavor: "A diamond of the first water — and she knows it, in the best way.",
    motif: "♥",
    t: 0.55,
  },
  "beat-drop": {
    kicker: "Cue the dhol",
    word: "BHANGRA",
    flavor: "Marigold gold and a birthday girl who never sits out a good song.",
    motif: "♪",
    t: 0.74,
  },
  "ceo-era": {
    kicker: "Boss behaviour",
    word: "CEO ERA",
    flavor: "Big Four by day, main character always — the ledgers balance because she says so.",
    motif: "♦",
    t: 0.9,
  },
};

export type Stop =
  | { kind: "friend"; data: Friend; index: number }
  | { kind: "waypoint"; id: WaypointId; title: string }
  | { kind: "finale" };

/** Interleaves the 5 interest waypoints evenly among the friend list, then ends with the finale. */
export function buildStops(friends: Friend[]): Stop[] {
  const n = friends.length;
  const w = WAYPOINTS.length;
  const insertAfter = new Map<number, (typeof WAYPOINTS)[number][]>();

  WAYPOINTS.forEach((wp, k) => {
    const idx = Math.min(n - 1, Math.max(0, Math.round(((k + 1) / (w + 1)) * n) - 1));
    const list = insertAfter.get(idx) ?? [];
    list.push(wp);
    insertAfter.set(idx, list);
  });

  const stops: Stop[] = [];
  friends.forEach((friend, i) => {
    stops.push({ kind: "friend", data: friend, index: i });
    const wps = insertAfter.get(i);
    wps?.forEach((wp) => stops.push({ kind: "waypoint", id: wp.id, title: wp.title }));
  });
  stops.push({ kind: "finale" });

  return stops;
}

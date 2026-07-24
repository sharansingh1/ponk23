"use client";

/**
 * Tiny singleton so Hero's entrance animations start exactly when the
 * D&D gate actually reveals the scene, not on Hero's own mount time
 * (Hero stays mounted underneath the gate the whole time, so a fixed
 * setTimeout would finish invisibly before anyone sees it). Mirrors the
 * subscribe pattern already used in lib/audio.ts.
 */

let revealed = false;
const listeners = new Set<() => void>();

export function markRevealed() {
  if (revealed) return;
  revealed = true;
  listeners.forEach((l) => l());
}

export function isRevealed() {
  return revealed;
}

function subscribeRevealed(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Checks-then-subscribes atomically. Calling `subscribeRevealed` alone
 * from a `useEffect` has a real race: if `markRevealed()` already ran
 * (e.g. a returning visitor whose DndGate effect fires before this
 * component's effect does), the notification is already gone by the
 * time this subscribes, and the listener would wait forever. This
 * closes that gap by firing immediately if already revealed.
 */
export function onRevealed(listener: () => void) {
  if (revealed) {
    listener();
    return () => {};
  }
  return subscribeRevealed(listener);
}

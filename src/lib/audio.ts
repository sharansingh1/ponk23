"use client";

import { Howl } from "howler";

/**
 * Ambient/SFX audio system. Expects these files to exist under /public/audio/
 * (not included — see README): ambient-beach.mp3, bhangra-loop.mp3, and one
 * short file per SfxName below. Missing files fail silently (Howler onloaderror)
 * rather than throwing, so the site works fine before audio assets are added.
 */

export type SfxName = "dice" | "wax-seal" | "chime" | "coin" | "swell";

const SFX_FILES: Record<SfxName, string> = {
  dice: "/audio/sfx-dice.mp3",
  "wax-seal": "/audio/sfx-wax-seal.mp3",
  chime: "/audio/sfx-chime.mp3",
  coin: "/audio/sfx-coin.mp3",
  swell: "/audio/sfx-swell.mp3",
};

type AmbientMode = "beach" | "bhangra";

let ambientBeach: Howl | null = null;
let ambientBhangra: Howl | null = null;
const sfxCache = new Map<SfxName, Howl>();

let muted = true;
let mode: AmbientMode = "beach";
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function getAmbient(target: AmbientMode): Howl {
  if (target === "beach") {
    ambientBeach ??= new Howl({
      src: ["/audio/ambient-beach.mp3"],
      loop: true,
      volume: 0.35,
      onloaderror: () => console.warn("ambient-beach.mp3 not found under /public/audio — add it to enable sound."),
    });
    return ambientBeach;
  }
  ambientBhangra ??= new Howl({
    src: ["/audio/bhangra-loop.mp3"],
    loop: true,
    volume: 0.45,
    onloaderror: () => console.warn("bhangra-loop.mp3 not found under /public/audio — add it to enable sound."),
  });
  return ambientBhangra;
}

export function playSfx(name: SfxName) {
  if (muted) return;
  let howl = sfxCache.get(name);
  if (!howl) {
    howl = new Howl({
      src: [SFX_FILES[name]],
      volume: 0.6,
      onloaderror: () => console.warn(`${SFX_FILES[name]} not found under /public/audio — add it to enable sound.`),
    });
    sfxCache.set(name, howl);
  }
  howl.play();
}

export function setAmbientMode(next: AmbientMode) {
  if (mode === next) return;
  getAmbient(mode).fade(getAmbient(mode).volume(), 0, 400);
  window.setTimeout(() => getAmbient(mode).stop(), 400);
  mode = next;
  if (!muted) getAmbient(mode).play();
  notify();
}

export function toggleMute() {
  muted = !muted;
  if (muted) {
    ambientBeach?.pause();
    ambientBhangra?.pause();
  } else {
    getAmbient(mode).play();
  }
  notify();
}

export function isMuted() {
  return muted;
}

export function getAmbientMode() {
  return mode;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

"use client";

import { useEffect, useRef } from "react";

/**
 * A row of carved rune slots instead of a generic text field. A real
 * input sits invisibly on top capturing keystrokes (so it's still a
 * normal accessible text field), while the visible slots light up rune
 * by rune as you type — the classic "dungeon door lock" mechanic.
 */
export default function RuneInput({
  value,
  onChange,
  length,
  disabled,
  shake,
}: {
  value: string;
  onChange: (v: string) => void;
  length: number;
  disabled?: boolean;
  shake?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const slots = Array.from({ length }, (_, i) => value[i] ?? "");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className={`relative mx-auto flex w-full max-w-[280px] justify-center gap-2.5 ${shake ? "animate-shake" : ""}`}
      onClick={() => inputRef.current?.focus()}
    >
      {slots.map((ch, i) => {
        const filled = ch !== "";
        return (
          <div
            key={i}
            className={`relative flex h-14 w-12 items-center justify-center rounded-sm border-2 font-display text-2xl uppercase transition-all duration-200 ${
              filled
                ? "border-grenadine/70 bg-ink/5 text-ink shadow-[inset_0_0_6px_rgba(90,30,20,0.15)]"
                : "border-ink/25 bg-ink/[0.03] text-transparent"
            }`}
          >
            {filled ? ch : <span className="h-1 w-1 rounded-full bg-ink/25" />}
            {/* carved corner notches */}
            <span className="absolute left-0.5 top-0.5 h-1.5 w-1.5 border-l border-t border-ink/20" />
            <span className="absolute bottom-0.5 right-0.5 h-1.5 w-1.5 border-b border-r border-ink/20" />
          </div>
        );
      })}

      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, length))}
        disabled={disabled}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={length}
        aria-label="Enter the sacred word"
        className="absolute inset-0 h-full w-full cursor-text opacity-0"
      />
    </div>
  );
}

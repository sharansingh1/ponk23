# Design

## Visual Theme

Tequila Sunrise golden-hour cocktail aesthetic — Palm Springs poolside/retro travel poster, not Hawaiian/tiki. The palette itself tells the site's story: it physically shifts from sunset red/orange at the top, through dusk magenta and night navy in the middle (where the friend tributes and interest waypoints live), and blooms into pure sunrise gold at the finale. Five personal-interest "waypoints" (D&D, Disney, Bridgerton, Punjabi/Bhangra, finance/CEO-era) are bold interactive interludes on this same arc — never separate sub-themes.

## Color Palette (OKLCH — starting point, to be eyeballed and refined once rendered)

| Role | Value | Use |
|---|---|---|
| `--sunset-grenadine` | `oklch(0.55 0.20 25)` | Hero top, deepest red accents |
| `--sunset-coral` | `oklch(0.68 0.18 35)` | Early-journey warm accents |
| `--sunset-marigold` | `oklch(0.75 0.16 55)` | Primary brand accent, CTAs, garland/marigold motif |
| `--sunset-honey` | `oklch(0.82 0.14 75)` | Secondary accent, wax-seal gold, borders |
| `--sunrise-citrus` | `oklch(0.88 0.16 95)` | Finale bloom, sunrise burst, highlight states |
| `--dusk-magenta` | `oklch(0.35 0.12 330)` | Mid-journey background (Bridgerton/Beat Drop waypoints) |
| `--night-navy` | `oklch(0.22 0.06 300)` | Deepest background, friend-section base |
| `--ink` | `oklch(0.20 0.02 30)` | Body text on light surfaces |
| `--paper` | `oklch(0.96 0.02 70)` | Card surfaces, text on dark backgrounds |

Gradients interpolate through this table in OKLCH (not RGB/HSL) to avoid muddy grey mid-tones. Every waypoint recolors itself from the *same* token set — e.g. the D&D waypoint uses `--night-navy` + `--sunset-honey` (parchment gold on dark), not an unrelated brown/tan palette.

## Typography

- **Display / headlines**: Fraunces (Google Fonts) — high-contrast, slightly quirky serif; carries the Bridgerton "invitation" feel and her name/section titles.
- **Body**: General Sans (Fontshare) — clean geometric sans, avoids the "Inter-everywhere" AI-template tell.
- **Stamp/label accents only** (e.g. "EST. 2003", "LEO SEASON", achievement badges): Bebas Neue, all-caps, used sparingly — never for body or headline text.

## Motion Energy

Physics-based/spring easing throughout — no linear or default CSS eases anywhere. The scroll-linked sun-on-path animation is the one signature hero effect; everything else (card reveals, hover states, waypoint transitions) is quieter and supports it rather than competing with it. Transitions between major sections use a "pour" gradient wipe (colors sweep like a drink being poured) instead of plain fades.

## Components (conventions to reuse across the build)

- **Friend "stage" card**: gold-rimmed arch/postcard frame, warm gradient background matched to its position in the sunset arc, wax-seal number badge, holographic sheen *only* on hover. Identical structure for every friend — this consistency is deliberate (see PRODUCT.md's "chrome stays quiet" principle).
- **Waypoint sections**: full-bleed, one signature interaction each, always resolve back to the shared palette before/after.
- **Cursor**: small glowing sun/citrus-slice mark with a brief fading trail, desktop only.
- **Audio control**: a single persistent mute/unmute toggle; muted by default; a secondary toggle at the Beat Drop waypoint switches the ambient loop to a bhangra-inspired instrumental.

## Layout

Single continuous vertical scroll, no traditional multi-page nav. A fixed quest-log-style mini-map (side rail on desktop, collapsible on mobile) shows icons for every waypoint and friend node for jumping around after the first pass. Desktop/big-screen is the primary target (party viewing), but layout must remain fully functional and legible on mobile — path simplifies to a straight vertical line on small viewports, cursor-trail and hover-only effects are dropped (touch has no hover), embeds go full-width.

## References / Anti-references

See PRODUCT.md — key anti-references: no literal tiki/Hawaiian imagery, no childish Disney treatment, no flat corporate finance-dashboard look for the CEO Era waypoint, no purple-to-blue AI-template gradients.

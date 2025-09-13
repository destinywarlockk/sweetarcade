# 🎮 Sweetwater Arcade – Master Spec (v1)

## Core Concept
- **Format:** Retro pixel-art arcade game, desktop-first PWA.
- **Controls:** Keyboard only (WASD/Arrows + Space/Enter/Shift). USB arcade sticks map to keystrokes. **No mouse**.
- **Structure:** Marketing (mentor) → Wild Customer reveal → Sales (Snake) → Merch (Tetris) → IT Hub (upgrades) → Warehouse (Frogger) → Celebration → Menu.
- **Tone:** Encouraging, “everyone wins.” CEO always rescues; no lives.

## Style & Aesthetics
- **Palette:** Sweetwater colors (Deep Blue #1d4ed8, Gold #ffd700, Neutral Grays).
- **Art:** 16‑bit pixel art, bold outlines; all sprites/tiles provided in `/assets/`.
- **Backgrounds:** Light animated per stage (Sales guitars, Merch shelves, IT blinking server, Warehouse conveyors).
- **Transitions:** Title‑style cards (text + icon), 1.5–2s, **silent**.
- **Menus:** Simple text lists (Title: Start / Credits). Title background = pixel Sweetwater storefront (subtle animation).

## Fixed Run Flow (always the same order)
1) **Title** (Start / Credits) → 2) **Round Start** (“Get Ready!” 1.5s) → 3) **Marketing Mentor** (typed text crawl, baseline multiplier gift x1.2) → 4) **Wild Customer** (“A wild customer appeared!” + sprite with flash/zoom) → 5) **Sales** (Snake, ~60s) → 6) **Merch** (Tetris, ~60s) → 7) **IT Hub** (pick 1 of 3 upgrades) → 8) **Warehouse** (Frogger, ~60s) → 9) **Celebration** (stays until input) → back to **Title**.

## Personas (Cosmetic Only)
- Selection: **Random, non‑repeating** (never pick the same persona as the prior run; track `lastPersonaId` in localStorage).
- Used for: sprite + name on Wild Customer card; theme icons in Sales; CTA mapping at Celebration.
- No difficulty differences between personas in v1.

## HUD & Timers
- **Top cluster HUD:** Left=Timer, Center=Awareness Bar, Right=Score.
- **Stage duration:** Timer‑based, **~45–60s** each (configurable). Timer **pauses** during fail + CEO rescue; resumes after.
- **Awareness Bar:** Starts partially filled from Marketing (baseline **x1.2**). Fills via play actions only (no decay):
  - Sales: preferred pickups
  - Merch: cleared lines
  - Warehouse: lane crossings
  - Visual feedback: **pulse/glow + chime** at tier bumps (x1.5, x2.0, x2.5, x3.0). Max multiplier **x3**.

## Stages
### Sales (Snake)
- Large board (~20×12), speed ramps with time.
- Pickups: persona‑preferred = **100 pts**; neutrals = **25 pts**.
- Fail: brief stage‑specific fail flash → **CEO rescue** plays → resume (timer paused during sequence).

### Merch (Tetris)
- Standard 7 tetrominoes; **no Hold**.
- **Hybrid gravity curve:** starts slow, ramps modestly, never punishing within the timer window.
- Upgrade: **Firewall** removes a random junk block once.
- Fail: lockout fail animation → CEO rescue → resume (timer paused).

### IT Hub (Upgrades)
- **Menu‑only** overlay; shows **3 random** upgrades, choose **1**:
  - Speed Patch, Firewall, Rewind, Cloud Checkpoint, Optimization.
- Persistence: Chosen upgrade applies **for the remainder of the current run only** (Warehouse + Celebration).

### Warehouse (Frogger)
- **5 lanes**, conveyors have **fixed** speed/direction per lane.
- Hazards: **moving carts** (no stacked boxes in v1).
- Fail: collision animation → CEO rescue → resume (timer paused).

## Failure & Rescue
- On any failure: play **brief fail animation** (~0.5–1s), then **CEO sprite** enters (2s) with a randomized encouragement line; timer is paused throughout.
- **Fast‑track:** If the player ultimately fails **all three** stages, final CEO rescue transitions directly to Celebration.

## Scoring
- **Formula:** Objectives + Efficiency + Awareness – Mistakes.
- **Mistakes:** Single **−10%** penalty applied to the stage subtotal at stage end.
- **Juice:** Floating numbers, combo popups, awareness pulses.
- **Audio:** Department‑themed chiptunes per stage; **1–2s crossfades** between tracks; SFX for key events.

## Celebration
- **Win case:** “Customer Happy!” banner; persona portrait; **persona‑mapped static CTA**; continuous confetti; static crowd silhouettes; score breakdown (vertical list). Stays until input. Replay button = **“Help Another Customer.”**
- **Fast‑track fail case:** Same visuals; banner = **“The Sweetwater Team Came Together!”**; CTA = **homepage** instead of persona category.

## Credits
- Gratitude card: “Thank you to the music makers. We’re grateful to have so many amazing customers.”
- Subtle animated backdrop (notes/waveforms). Stays until input.

## Replay, Scores & Persistence
- **Run length target:** ~5 minutes total per full run.
- **Difficulty scaling:** **None** across plays.
- **Local scores:** Save **best score per persona** and show **top score** on Title.
- **Replay:** Celebration offers **“Help Another Customer”** to start a new run immediately.

## Vendor Layers (Scope Separation)
- **Marketing (global theme):** palettes/skins, CTAs, awareness settings, **date‑range only** windows; no per‑hour schedule in v1.
- **IT (performance/flags):** effect density, reduced motion/audio mode, maintenance toggle. **IT wins** on performance‑critical settings; **Marketing** controls visual theming/CTAs.

## Config Files
- `/config/marketing.json`
  - `baselineMultiplier`: 1.2
  - `introLine`: "It’s dangerous to go alone… take this multiplier!"
  - `theme`: palette fields, optional event skin flags
- `/config/personas.json`
  - `personaId`, `name`, `icon`, **`ctaCategoryUrl`** (static mapping used on Celebration)
- `/config/upgrades.json`
  - Definitions for five upgrades (effects and short descriptions)

# ✅ Sweetwater Arcade – Task Breakdown

## 🎨 Art & Assets
- [ ] Integrate provided pixel-art sprites for employees, customers, and backgrounds (/assets/).
- [ ] Implement animated stage backgrounds (Sales guitars, Merch shelves, IT blinking server, Warehouse conveyors).
- [ ] Title Screen storefront background (subtle animation).
- [ ] Static cheering crowd silhouettes for Celebration.
- [ ] Confetti animation (continuous falling loop).

## 🖥 UI & Menus
- [ ] Title Screen: simple menu (Start / Credits), keyboard-only navigation.
- [ ] Round Start card ("Get Ready!") with fade timing.
- [ ] Marketing mentor: RPG-style text crawl with skip option; baseline x1.2 applied.
- [ ] Wild Customer intro: text + persona sprite w/ flash+zoom.
- [ ] Stage Transition cards: text + icon, fade in/out, silent.
- [ ] IT Hub: text-only upgrade menu, random 3 choices, confirm selection.
- [ ] Celebration: score breakdown (vertical list), persona portrait, CTA, **“Help Another Customer”** button.
- [ ] Credits: gratitude card + subtle animated backdrop; stays until input.

## 🎮 Gameplay – Stages
- [ ] Sales: Snake loop (20×12), speed ramps; preferred=100, neutral=25.
- [ ] Merch: 7 tetrominoes; hybrid gravity curve; Firewall removes random junk block once.
- [ ] Warehouse: Frogger with fixed conveyors + moving carts (no stacked boxes).
- [ ] Global timer: 45–60s per stage; **pauses** during fail + CEO rescue.
- [ ] Fail animations: stage-specific; then CEO rescue full-sprite + random line.

## 📊 Scoring & Awareness
- [ ] HUD top cluster: Timer (L) / Awareness (C) / Score (R).
- [ ] Awareness: grows only via actions (Sales pickups, Merch lines, Warehouse crossings); pulses + chime at tiers; cap x3.
- [ ] Mistakes: −10% of stage subtotal applied at stage end.
- [ ] Floating numbers / combo popups / awareness pulses.

## 🔊 Audio
- [ ] Department-themed chiptune tracks for Title, Marketing, Sales, Merch, IT, Warehouse, Celebration, Credits.
- [ ] Crossfade system (1–2s) between tracks.
- [ ] SFX hooks for pickups, clears, crossings, awareness tier bumps, failures, CEO entry.

## 🔁 Replay & Persistence
- [ ] Local best score per persona; top score on Title.
- [ ] Persona selection: random, non-repeating (track last in localStorage).
- [ ] Celebration button “Help Another Customer” restarts Run Intro.

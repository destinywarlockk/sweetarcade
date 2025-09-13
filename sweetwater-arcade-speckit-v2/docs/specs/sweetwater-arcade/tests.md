# ✅ Sweetwater Arcade – Tests & Acceptance Criteria

## 0) Global / Boot
- [ ] PWA installable: manifest + SW; Lighthouse PWA checks pass.
- [ ] Keyboard-only input works; mouse does nothing in menus/gameplay.
- [ ] Music crossfades between scenes (~1–2s).

## 1) Title & Menu
- [ ] Pixel storefront animates subtly.
- [ ] Only “Start” and “Credits” selectable; Enter triggers.
- [ ] If local high score exists, it displays on Title.

## 2) Credits
- [ ] Gratitude text present.
- [ ] Animated notes/waveforms backdrop.
- [ ] Stays until Enter/Space is pressed.

## 3) Run Intro
- [ ] “Get Ready!” card shows ~1.5s with fade.
- [ ] Marketing mentor text types out (skip reveals instantly); baseline multiplier x1.2 applied; awareness starts partially filled.
- [ ] Wild Customer card: “A wild customer appeared!” + persona sprite with flash/zoom; 2–3s then Sales.
- [ ] Persona selection is random but not same as last run.

## 4) HUD (All Stages)
- [ ] Top cluster shows Timer (L), Awareness (C), Score (R).
- [ ] Timer pauses during fail + CEO rescue; resumes after.
- [ ] Awareness grows on stage actions; pulses + chime at tier bumps; cap x3.

## 5) Sales (Snake)
- [ ] 20×12 grid renders; speed ramps.
- [ ] Preferred pickups = +100; neutral = +25.
- [ ] On crash: fail flash → CEO rescue (2s) → resume; timer paused.
- [ ] Ends on timer; transition card shows (guitar icon).

## 6) Merch (Tetris)
- [ ] 7 tetrominoes only; no Hold.
- [ ] Gravity starts slow, ramps modestly; never punishing within 60s.
- [ ] Firewall removes random junk block once.
- [ ] On lockout: fail flash → CEO rescue → resume; timer paused.
- [ ] Ends on timer; transition card shows (box icon).

## 7) IT Hub
- [ ] Text menu shows 3 random upgrades; choose 1 with Enter.
- [ ] Chosen upgrade applies for rest of run only (Warehouse + Celebration).
- [ ] Blinking server background visible.

## 8) Warehouse (Frogger)
- [ ] 5 lanes; conveyors have fixed speed/direction.
- [ ] Moving carts present; collisions trigger fail animation → CEO rescue.
- [ ] Awareness increments on lane crossings.
- [ ] Ends on timer; transition to Celebration.

## 9) Failure & Rescue
- [ ] Stage-specific fail animation (~0.5–1s) plays before rescue.
- [ ] CEO full sprite enters with random encouragement; 2s duration.
- [ ] If all 3 stages failed, final rescue fast-tracks to Celebration.

## 10) Celebration
- [ ] Win: “Customer Happy!” + persona portrait; persona CTA button.
- [ ] Fast-track: “The Sweetwater Team Came Together!” + persona portrait; CTA goes to homepage.
- [ ] Confetti falls continuously; static crowd silhouettes shown.
- [ ] Score breakdown vertical list + total.
- [ ] “Help Another Customer” starts a fresh run (Get Ready → Marketing → Wild Customer).

## 11) Local Persistence
- [ ] Best score per persona saves/loads from localStorage.
- [ ] `lastPersonaId` saves/loads; next run avoids repeat.

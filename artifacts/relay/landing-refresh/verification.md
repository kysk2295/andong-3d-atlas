# Relay landing revision · 2026-09-30

User requested smaller typography and less text after rejecting the first large-title draft.

## Result
- Live 3D night scene remains the main visual.
- Welcome title is 23px desktop, 21px mobile, 20px short landscape; Pretendard, weight 600.
- Removed tagline and multi-stage information panel; kept a compact 224px menu (208px mobile).
- Play and night-market entry keep existing handlers. 3D map opens the existing Atlas route.
- Styles scoped to the welcome screen. Gameplay HUD untouched.

## Verification
- Desktop 1280×720, mobile 390×844, landscape 667×375: visually checked, no horizontal overflow or clipped actions.
- Play enters market, reload resumes it, popup entry and return work (first draft, unchanged handlers).
- Reset returns to revised landing; nested Play label remains intact. 3D map link opens Atlas; back returns to landing.
- Final npm run build: PASS. Existing bundle size warning remains.
- Full suite: 194/195 pass. Unchanged tests/tourism-map.test.mjs expects benefits + route without the current booths field in src/tourism-map-model.js. Not caused by landing UI/CSS and left unchanged.
- Graphify update unavailable because its Python 3.12 interpreter path is missing; see graphify.log.
- Report screenshot 05 and image captions updated.

Evidence: desktop.png, mobile.png, landscape.png, build.log, tests.log, graphify.log.

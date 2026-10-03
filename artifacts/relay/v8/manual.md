# v1.16.0 — immersive HUD verification

2026-09-29. User requested removing obtrusive relay text, popups and arrows without disrupting the existing 3D world. No skills or subagents used.

## Change
- Removed persistent relay step strip, narrative title/description, coupon/mission cards, station panel, footer disclaimers and control legend from the live world.
- Added compact real-place labels and three menu controls; the next action is a small button at the edge. Interaction targeting and 3D architecture are preserved.
- Removed the rotating screen waypoint arrow and matching floating 3D beacon. Navigation/pathfinding remains functional.
- Moved meal/program selection, station assistance, settings and photos into an explicitly opened side menu. Relay progression, receipt and coupon records are in the journal.
- Reduced active task panels and collapsed optional button controls. Kept keyboard assistance, direct drag interaction and task cancellation.
- Replaced mobile direction-arrow buttons with an analog thumbstick; pointer cancellation, window blur and page hiding stop motion.
- Made checkout a smaller optional side surface without world blur. Completion no longer automatically opens the summary dialog.
- Atlas home, 3D assets and saved localhost progress retained. Version 1.16.0.

## Automated verification
- `npm test`: 156 passed, 0 failed (tests.txt). New tests cover thumbstick dead zone, normalized diagonal speed, ownership of a single finger, release/cancel/blur/visibility and paused input.
- `npm run build`: passed (build.txt). Existing >500 kB chunk warning remains.
- Syntax checks passed. Permanent UI ids are unique.
- `graphify update .`: attempted after edits; existing executable fails because `/opt/homebrew/opt/python@3.12/bin/python3.12` does not exist (graphify.txt). No unrelated runtime changes made.

## Browser checks through the actual UI
Test origin: 127.0.0.1:4174, independent of the user's localhost state.
- Desktop 1280 × 720: clean default workshop HUD; menu opens/closes; program selection, journal and settings work.
- Mask: two direct pointer strokes raised paint progress and completed the first step. No completion popup.
- Traditional brew: optional controls start collapsed; expanded and selected rice, nuruk, water, then completed successfully.
- Mobile 390 × 844: location + three controls + action + thumbstick fit. Thumbstick forward drag moved the camera; release restored both CSS thumb offsets to zero. See mobile-before.png and mobile-after.png.
- Closed menu with Escape and pressed ArrowRight six times with menu-button focus. Camera rotated; world controls resumed after a dialog.
- Traversed transport, two arrival path legs, Woryeonggyo walk and two market approach legs through visible UI. Location labels and unobstructed world layout persisted.
- Checkout: manually opened tea purchase, cancelled, reloaded final build, reopened and completed the mock purchase. Compact side panel remained readable; scene visible.
- Finish: clicked finish. Screen stayed in the 3D market; status said the trip was recorded. No summary dialog auto-opened.
- Browser errors: none in QA or updated localhost tab.
- User tab 3 refreshed to the final build, retaining completed food/receipt/mask/transport progress. Displays '월영교 가는 길' and '월영교 산책 시작하기'. User progress not reset.
- Temporary viewport override reset and QA tab closed. User tab kept.
- Port 4174 server remains running under launchd, PID 44989.

## Actual runtime screenshots
- workshop-hud.png: clean workshop world
- bridge-hud.png: clean night bridge world
- mobile-before.png / mobile-after.png: thumbstick motion
- optional-checkout.png: explicit purchase menu

All screenshots are actual in-app browser captures, not generated images.

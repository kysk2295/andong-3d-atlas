# v1.20 manual verification — 2026-09-29

Browser: Codex IAB; disposable QA origin http://127.0.0.1:4174/?experience=relay. User localhost and production saves were not reset.

- Market: W moved canvas data-position from 0.150,1.700,8.000 to 0.150,1.700,7.800; Space reported data-airborne=true. Storefront depth, shop variants, steam and vendors rendered.
- Entry: assisted walk to the alley door, door animation, dining-room arrival. No runtime errors.
- Window seat: selected through space menu, reached via furniture-aware walk. ORDER kept the selected table. Reload restored that table and ordered meal. Meal camera was -3.000,1.220,-0.690.
- Eating: dragged the right-hand front chicken piece to the mouth guide; completion changed 0/3 to 1/3 only after the hand motion. Two assist-button bites reached 3/3. Explicit finish unlocked the receipt stage.
- Counter: walked from window to counter. Dragged the demo card from left of the reader to the gold target. Printer showed receipt. Clicked receipt and completed the hand pickup; receipt was available after reload. These actions are local simulation, not a transaction.
- Audio setting: turned sound off in menu; after reload button said 공간 소리 꺼짐 with aria-pressed=false. Synthesized audio scheduling, pause/mute, no duplicate loop, no step during jumps/teleports and device failure are unit-tested. Audio was not subjectively auditioned by the agent.
- Mobile 390×844: entry and centre-table approach, menu image successfully loaded. Menu bounds left16/right374/top232/bottom828; no horizontal overflow. Order and close controls fully visible. Cancelling retained unordered state. Temporary viewport reset afterwards.
- Leaving the seat: after menu cancellation, S changed data-position from 0.000,1.220,0.960 to 0.000,1.700,1.080 in the active tab.
- Actual 3D picking: clicked centre chair to walk/sit without automatic ordering; then clicked the physical tabletop menu to open ordering. Console error log remained empty.

Evidence: dining-room.png, market.png, window-meal.png, receipt-in-hand.png, mobile-menu.png; tests.txt (180/180), build.txt. README describes reconstruction and audio limitations.

Remaining fidelity: procedural people and food, illustrative restaurant/store layout, no scanned buildings or motion capture. The scene is more detailed, not a photographic replica. Existing Vite chunk-size warning remains. graphify.txt records the pre-existing missing Python interpreter.

## Published verification

Railway deployment 99d5972a-6deb-4fd6-b584-fea920c547a5 reports SUCCESS. All 12 checks (HTML, JS chunks, styles, menu reference photograph) match local SHA-256 hashes. Production relay refreshed without resetting the user's save: the stored ordered meal appeared at the default centre table. The updated room rendered, food and steam loaded, and console error log was empty. Screenshot: published-dining.png. User's existing Atlas tab was retained; QA tabs closed and viewport override reset.

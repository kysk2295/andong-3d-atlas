# v1.11 visitor-space verification — 2026-09-29

Executed against the local production build at port 4174 with the Codex browser UI. No deployment or live merchant/payment connection.

## Observed user flow

- Default home continues to use the Atlas entry module; the relay remains behind `?experience=relay`.
- Entered the covered market, followed the assisted approach to the restaurant entrance, entered the dining room, walked to the table, and ordered jjimdak. The main dish appears only after ordering.
- Completed three individual eating actions and continued to the separate cashier counter. The dining/cashier viewpoints are different; room movement goes around the central and side tables.
- Paid the sample meal by card, 18,000 KRW. Later verified the counter can also open checkout through the visible E interaction, not only the main action button.
- Dragged the held receipt onto the phone's 3D camera frame. The view inside the phone follows the receipt, remains incomplete off-center, requires an aligned hold, and enables coupon issue only after completion. Confirmed both direction-button and pointer-drag paths. This is sample receipt alignment, not decoding arbitrary real QR codes.
- Entered the hanok courtyard, selected tea, walked to the reception desk, checked the 10,000 → 9,000 KRW sample discount, then walked back to the worktable. Physically dragged all three separate flowers into the teapot. Completed both pours at 60% using the accessible incremental controls.
- Changed to the mask on a 390×844 viewport, drew a partial stroke, cancelled, and reopened it. Progress returned to zero and the uncommitted stroke was discarded. Returned to the already completed tea program without losing its completion.
- Rode the sample shuttle and opened its 3D route view on the mobile viewport. Continued to the bridge, walked to the boat lookout, started the pavilion walk, cancelled it, and resumed. Cancellation did not mark the walk complete.
- Entered the popup, walked to the tea stall, used E to open its purchase dialog, and paid 4,000 KRW sample cash. Walked to the tuho station and used E to throw; the success was recorded.
- Finished the relay. Summary showed all five connections complete, one completed program, 1,000 KRW sample discount and one popup purchase. Reloaded and confirmed the meal's card payment, the tea discount, popup cash payment and 1/1 tuho result persisted.
- Started a fresh mobile visit for the receipt test. The updated phone placement leaves both its screen and the receipt visible above the task panel. Pointer drag aligned the receipt on the 390×844 viewport.

## Evidence

- `receipt-camera-aligned.png`: desktop second-camera receipt interaction.
- `tea-three-flowers.png`: three physical flowers placed in the pot.
- `hanok-courtyard.png`: final facade, open entry, lattice windows, side-mounted sign and traversable courtyard.
- `mobile-mask-cancel-restored.png`: reopened mask task after cancellation.
- `mobile-travel-map.png`: route view while travelling.
- `mobile-bridge-lookout.png`: river-facing viewpoint reached by walking.
- `night-market.png`, `mobile-popup-tuho.png`: populated popup space and station interaction.
- `mobile-relay-completed.png`: complete visitor relay.
- `mobile-receipt-camera.png`: mobile aligned receipt camera.

## Automated and technical checks

- `npm test`: 118 passed. New checks cover collision rejection, collision-free routed segments, unreachable goals, the courtyard doorway and downloaded material integrity.
- `npm run build`: succeeded.
- `node scripts/fetch-relay-materials.mjs`: all ten cached files match the recorded hashes.
- Mobile DOM width equals viewport width (390), with no horizontal overflow in the inspected task.
- Browser error log: no errors. An earlier HDR loader deprecation warning was fixed by using the installed Three.js HDRLoader.

## Limits

Browser viewport emulation, not a physical phone. Pouring hold timing is covered by the existing pure input-model tests; this manual run used the incremental alternative. Architecture, local popup, transport timing, prices and QR benefits remain explicitly labeled proposal/simulation elements. CC0 materials are visual production assets, not documentary Andong photos. Real photographs and operational citations retain their original source records. Actual venue agreements, payment, booking and arbitrary QR authentication are not implemented.

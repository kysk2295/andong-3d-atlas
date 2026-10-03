# Manual UI verification — v1.17.0

Browser: Codex in-app browser. UI actions and screenshots used CUA only; no scene-state injection, scripted DOM clicks or localStorage writes. Separate 127.0.0.1 origin used for disposable QA; the user's localhost progress was not reset.

## Passed
- Fresh start → market → dining room → seated menu → jjimdak order. New pan, photo-sampled food, steel handles, rice and side dishes render; food meshes remain selectable.
- One bite dragged on 1280×720, two further bites on 390×844. The visible counter advanced to 3/3 and enabled finishing the meal. A distinct mouth target now sits below the pan. No horizontal overflow on mobile.
- Payment/receipt and QR via optional keyboard-assist controls. Receipt and 10% demo coupon issued, then redeemed at tea workshop; no real transaction involved.
- Walked through the restaurant exit, alley, workshop entrance and reception.
- All three small chrysanthemum flowers dragged directly into the resized pot: counter 1/3 → 2/3 → 3/3. Recorded tea-flowers-direct.png.
- Both pouring steps completed through the existing 10% assist and amount-check controls at 60%. These runs verify workflow and liquid rendering; they do not constitute a timed physical pointer-hold test.
- Completion retained after refresh. The corrected teacup shows amber liquid below the rim; idle hands stay below the table view, and the floating front label is now a small physical plaque.
- Workshop exit → boarding point → vehicle → simulated travel → alighting → river path → bridge all completed through normal UI actions.
- Desktop bridge: water reflects boats, railings, vegetation and sky. Boat spacing avoids overlapping silhouettes from the entry viewpoint. Dusk lighting and forest use the current build.
- ArrowRight ×4 changed the camera yaw (bridge-arrow-turn.png); R restored the view; ArrowUp ×12 advanced along the bridge (bridge-arrow-walk.png).
- Bridge at 390×844 renders with no horizontal overflow, visible touch control and compact UI. Temporary viewport override reset afterwards.
- Browser error logs were empty after desktop and mobile bridge checks.
- Preview HTTP endpoint returned 200; production build and all 162 tests passed.

## Artifacts
- meal-desktop.png: final-build first-person meal capture. Earlier 390×844 meal interaction was verified as described above; the last recapture remained at desktop size, so no final mobile meal image is included.
- tea-flowers-direct.png: direct flower pickup completion.
- tea-desktop.png: finished tea, corrected cup and resting view.
- bridge-desktop.png, bridge-mobile.png: actual current bridge scene.
- bridge-arrow-turn.png, bridge-arrow-walk.png: physical camera controls.

## Limitations
Photographic PBR materials and lighting improve the reconstructed scene; it is not a photogrammetry replica or AAA photorealism. Faces, some food contours, masks and architecture still show procedural modelling. No real-device touch-hardware test or frame-rate benchmark was performed. The desktop browser was resized for mobile checks.

## User-session handling
Before refreshing the user's existing localhost tab, its visible location was “하차 지점 · 월영교 산책 구간”, with “강변 보행로로 나가기”. Reload restored the saved transport stage because the in-between walking segment is currently transient. The normal “월영교 산책 시작하기” action was used to restore that same alighting segment. No purchase, meal, coupon or workshop records were cleared on localhost.

## Final capture pass
- Latest desktop meal screenshot captured after ordering and entering the direct-eating interaction. Browser error log remained empty.
- Confirmed the user tab was restored to “하차 지점 · 월영교 산책 구간” with “강변 보행로로 나가기”.
- Reset the browser viewport override after capture.

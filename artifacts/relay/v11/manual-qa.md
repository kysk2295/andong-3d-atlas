# v1.19 manual verification

Validated through the actual in-app browser at http://127.0.0.1:4174/?experience=relay (disposable QA origin); user localhost and public saved progress were not reset.

- Reproduced: ordinary WASD moved, but assisted navigation ignored S/WASD. The movement handler returned when navigation was active.
- Fixed: manual keyboard movement, joystick intent or jump cancels the navigation promise with false, immediately returns control, and does not advance the chapter.
- W/A/S/D each changed the expected camera axis (movement-evidence.json).
- Space: camera rose from 1.700 m to 2.086 m; Space + W rose to 2.424 m while moving forward; automatic landing restored 1.700 m.
- R during jump restored spawn at 1.700 m and cleared airborne state.
- Opening menu during jump froze at 1.934 m; W in the menu did not move. Closing menu resumed and landed at 1.700 m.
- 390×844: visible joystick and jump control; clicking jump raised the camera; joystick changed forward position.
- Found and corrected a mobile overlap: the assisted-walking status panel covered the joystick. It now sits above the controls with pass-through non-button space. Verified fresh mobile joystick input cancels navigation, re-enables the action and leaves the visitor in the alley (z=7.420). Jump also cancels navigation and enters the airborne state.
- Full assisted walk and entrance animation reached the restaurant, with Menu selection available.
- Actual desktop/mobile screenshots saved alongside this report. No runtime errors were captured during the checked flows.
- All 173 automated tests passed; production build passed (existing bundle-size warning).
- graphify update attempted; installed executable cannot run because its Python 3.12 interpreter is missing. See graphify.txt. Unrelated interpreter installation unchanged.

Visual scope: model remains a reconstructed scene, with illustrative storefront order and procedural visitors. It is not a measured scan or photoreal AAA environment. Replaced opaque facade boxes with rooms; metre-scaled furniture/steelwork, physical painted signs, scanned square tiles, neutral environment reflections, roof panels and cooking steam improve depth and scale.

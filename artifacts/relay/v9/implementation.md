# First-person atmosphere and materials — v1.17.0

Implemented in the existing relay route; the Atlas home and existing progress model are retained.

## Changes
- Shared 56 cm jjimdak pan with steel rim/handles, photo-sampled chicken and potato surfaces, irregular edible meshes, coiled glass noodles, scallion ribbons, chilli and carrot slices. Cooked rice and side dishes use visitor-scale bowls.
- Table, chair, collision box and seated/meal camera use consistent dimensions. A drag must actually move into a separate mouth region; tapping food in place cannot complete a bite.
- Neutral indoor HDR lighting, area lights and restrained material contrast. Continuous trouser/sleeve silhouettes and narrower articulated hands replace pinched capsule joints.
- Photograph-based pine needle/bark materials replace solid ball canopies; each grove batches trunks/branches/twigs. Forest soil, night sky and studio HDR environments are local assets.
- River uses a live planar reflection target with world-space ripples. The pavilion and boats reflect in it. Warm pavilion lights, a smaller moon, blue-hour sky and restrained night bloom replace fake reflection strips.
- Smaller tea cup, multi-petal chrysanthemums, cloth work mat, moving tea vapour and a closer desktop working view.
- Existing clean HUD and optional menus retained. Mouth target moved below the food for both desktop and mobile.

## Asset provenance
12 additional CC0 files, 17.83 MB. Each file has its source URL, license, byte count and SHA-256 in public/data/relay-materials.json. Download script: scripts/collect-relay-atmosphere.py. Original API manifests: artifacts/relay/v9/references/.
- https://polyhaven.com/a/pine_tree_01 — photographs for pine bark and needles (not the 1.3 GB original model).
- https://polyhaven.com/a/forest_ground_04
- https://polyhaven.com/a/qwantani_night_puresky
- https://polyhaven.com/a/studio_small_09
- Existing supplied-document food photograph: /assets/relay/document/stage-1-image8.webp; reused as a surface reference. The meal remains independently manipulable 3D geometry, not a photograph replacing the scene.

## Scope and limitations
This is a real-time, reconstructed first-person scene. It is not a surveyed replica, a photogrammetry scan of an Andong restaurant, or fully photorealistic human/food modelling. The most visible remaining fidelity gaps are character faces/clothing and some food silhouettes. Render reflections use one additional scene pass at 768 px on desktop, 384 px on small screens, or 256 px in light mode. Large bundled scene chunk still produces the pre-existing Vite size warning; mobile skips postprocessing and retains ordinary rendering.

## Verification
- Production build passed; stable preview serves dist on port 4174.
- 162 automated tests passed, including metre-scale food bounds/raycast pickup, atlas UV ranges, forest batching, reflection resource disposal, genuine pointer movement for a bite, and small cup profiles with unobstructed liquid surfaces.
- Manual UI verification is recorded in manual-qa.md. Screenshots are actual browser captures, not generated concept images.
- graphify update . was attempted. The installed command cannot run because /opt/homebrew/opt/python@3.12/bin/python3.12 is missing; unrelated Python installation was left untouched.

The landscape now uses irregularly placed 6–10 m pines, ground that slopes below the waterline, and a simpler distant foliage material. Journey ground rings were removed; signposts and the normal action button still work. Moonboat silhouettes/float height, separation in the visitor view and curved sail cloth were also corrected.

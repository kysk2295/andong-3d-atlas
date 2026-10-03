# Trails tab removal

- Removed the Trails tab, panel, selector, route visibility/endpoints/fit/source controls.
- Removed its data extraction, listeners, showTrail handler and scene-only trail group/renderer. Cleared unused main imports and trail CSS.
- Browser verified at http://127.0.0.1:4174/?layout=atlas&layers=relay: City, Relay, Trip each selects its correct panel; ArrowLeft from City wraps to Trip; no runtime errors.
- 173 existing tests and production build pass. No additional tests needed for this reversible removal.
- graphify update attempted; installed executable references missing Python 3.12. See graphify.txt.

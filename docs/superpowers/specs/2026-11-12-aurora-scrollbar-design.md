# Aurora Trace 5px scrollbar design

## Intent
Replace the portfolio's existing 4px navy page scrollbar with the user-selected **Aurora Trace** concept, set to **5px**, to add restrained blue luminosity while preserving the clean portfolio presentation.

## Goals
- Keep **native browser document scrolling**, its scrollbar thumb, keyboard/trackpad/wheel/touch behaviour, and the current layout.
- In Chromium/WebKit browsers, render the root vertical scrollbar at **5px** with a rounded blue/cyan gradient thumb, a quiet low glow at rest, and a visibly brighter gradient/glow while the page is actively scrolling or the thumb is hovered.
- Let the active visual state settle shortly after scrolling stops (~220ms), with no continuous looping animation or React re-renders on scroll.
- Use a **transparent track** that fits both the existing light page and a future dark palette.
- Keep the current named nested scrollbar utilities (`.scrollbarxcustom` and `.scrollbarycustom`) untouched.
- Respect reduced-motion preferences; when enabled, keep a stable, legible thumb without scroll-triggered visual pulsing.

## Constraints and non-goals
- No third-party dependency, custom draggable overlay, scroll hijacking, layout shift, section indicators, theme toggle work, or changes to page content.
- Styling remains scoped to the root scrollbar and its decorative glow. Existing page styles are in `public/static/css/_scrollbar.scss`; styles import via `application.scss`; the one-time client behaviour hooks into `app/layout.jsx`.
- Native scrollbar pseudo-elements are browser/OS dependent. Firefox's supported `scrollbar-width: thin` is **not precisely 5px**; macOS/iOS overlay scrollbar visibility and shadow clipping cannot be guaranteed.
- A normal native scrollbar clips outside shadows to its narrow gutter. A separate non-interactive, aria-hidden fixed glow layer aligns approximately with the native thumb, allowing light to bleed into the viewport. The native 5px thumb remains the only draggable scrollbar.
- No repository AGENTS.md or test framework was present on the inspected `master` tree; use Node's built-in tests for the tiny scroll-activity controller and a browser smoke check for visual behaviour.

## Considered approaches
1. **CSS-only native scrollbar** — smallest but cannot reliably distinguish wheel/trackpad scrolling from idle. Not selected.
2. **Native scrollbar styling + tiny passive scroll listener + non-interactive glow layer** — retains browser semantics and provides the visible halo demonstrated in the reference. **Selected after visual verification showed native box shadows were clipped.**
3. **Fully simulated draggable scrollbar** — more precise effects but more fragile with OS scrollbars, accessibility and sizing. Rejected as overengineering.

## Behavioural design
- A client-only effect calls `observeScrollActivity({ glowElement })` once and renders a fixed, pointer-events-none, aria-hidden glow next to the native scrollbar. Geometry is calculated from viewport height, document scroll height and scroll position; native scroll input remains untouched.
- On `window` scroll, mark `document.documentElement` with `data-aurora-scroll-active`, clear the preceding idle timer, and start a new 220ms timer to remove the attribute.
- On resize or observed document height changes, refresh glow position and size. Pointer movement near the right edge brightens the halo. On unmount, remove listeners, any observer and timer, and both activity/hover attributes. Never prevent default scrolling.
- CSS applies a base thumb, with a brighter active/hover treatment under `prefers-reduced-motion: no-preference`; under reduced motion, keep only the static base appearance.
- In non-WebKit scrollbar implementations use native `scrollbar-width: thin` and `scrollbar-color` if available, without overriding WebKit's 5px rule with a non-auto standard width.

## Acceptance
- Chromium/WebKit root scrollbar target is 5px; an actually visible, un-clipped blue halo accompanies its thumb, brighter on scroll or near-edge hover, settling back to subtle idle illumination.
- Rapid scroll events refresh the idle timeout without prematurely dimming the thumb; cleanup reliably detaches the listener and visual state.
- Existing nested-scroll classes and page navigation remain unchanged.
- The feature branch contains a plan, a regression test of controller behaviour, and a PR against `master`.

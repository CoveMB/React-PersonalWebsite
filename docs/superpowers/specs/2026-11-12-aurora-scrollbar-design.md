# Aurora Comet scrollbar — revised design (12 November 2026)

## Decision

The user requested replacing **both the existing Aurora Trace thumb and its scrollbar track** with the [standalone Aurora Comet design](https://github.com/CoveMB/React-PersonalWebsite/pull/42), rather than layering a glow over a native thumb. This supersedes the original Aurora Trace native-thumb design in this feature branch.

## Visual contract

- One **5px circular ice-blue comet head**, with a short tapered luminous tail on the opposite side of scrolling direction.
- Tail extends slightly and brightens during scroll, then settles after about **220ms**. Subtle halo at rest, stronger on hover/focus.
- **No visible scrollbar gutter, track, progress stripe, percentage display, or second decorative glow layer.**
- Visual colours adapt to light and dark/system themes, with restrained brightness and reduced-motion-safe transitions.
- Comet position represents the full scrollable document with a fixed-size head. It does not attempt to replicate the variable-height native thumb.

## Architecture

- The **document remains the scroll container**. Standard wheel, keyboard, touch, anchors, browser history and inertia remain native.
- A single root client component renders a fixed transparent **36px desktop / 44px mobile interaction area** (5px visual head), with an accessible `role=scrollbar` and `aria-controls` referencing the scrollable root `<html>`.
- After the client control mounts, `data-aurora-comet-ready` hides the *root native scrollbar*; when it unmounts, the attribute is removed and the original native scrollbar returns.
- Without JS, the original native root scrollbar is available as a 5px transparent-track fallback; nested `.scrollbarxcustom` and `.scrollbarycustom` are unchanged.
- Geometry is updated on scroll, resize and scroll-document content-height changes. Scrolling direction is tracked only when the page actually moves.
- Clicking or dragging the rail moves the native page scroll position; arrow/page/home/end/space keys work when the rail is focused. Keyboard focus is signalled by the comet halo, not a visible border around the otherwise invisible track.
- No new runtime dependency, custom scrolling engine, React state updates on scroll, or unrelated page changes.

## Tradeoffs and verification

- CSS hiding a native scrollbar has accessibility risks: mitigate with a genuine keyboard/pointer-operable, labelled, 36px desktop / 44px mobile target scrollbar and native fallback when JS is unavailable.
- The visual indicator differs from a native thumb in both length and recognizability; keep conservative glow and verify on multiple screen sizes.
- Small layout shifts are possible when hiding the native 5px gutter after hydration; accept this over hiding scroll access in no-JS/error cases.
- Tested with Node behaviour tests and a standalone Chromium DOM/browser harness for scroll direction, pointer seek, keyboard actions, cleanup, theme backgrounds and reduced motion. Full Next.js build, Firefox/Safari rendering and live site interactions require additional verification.

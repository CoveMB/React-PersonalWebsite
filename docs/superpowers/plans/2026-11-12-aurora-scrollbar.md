# Aurora Comet integration — revised implementation plan

The earlier Aurora Trace approach used a 5px native thumb plus a separate glow. User feedback requested the **entire visible scrollbar and track replaced** with the supplied Aurora Comet head and tail. This plan records the revised accepted implementation, superseding the previous native-thumb proposal.

## Work completed

1. [x] Review the active `feat/aurora-trace-scrollbar-5px` branch, root layout, Sass scrollbar rules, existing glow controller, existing tests and right-side section navigation.
2. [x] Preserve native document scrolling. Replace the old noninteractive halo with a single labelled, draggable custom visual rail mounted by the existing root client component. Keep the visual head 5px and transparent hit area 44px.
3. [x] Hide the root native thumb/track only after JS mounts the overlay; restore fallback on cleanup. Do not touch named nested scrollbars. Remove obsolete native-glow activity styling.
4. [x] Position the head using scroll progress; reverse the tapered tail on direction change, briefly brighten while active, support future theme overrides and reduced motion.
5. [x] Add `id=portfolio-scroll-viewport` to the scrollable root and `aria-controls` to the control. Support pointer seek/drag and arrow/page/home/end/space keyboard interaction.
6. [x] Replace native-halo-specific tests with behaviour tests of positioning, boundary handling, direction, idle reset, pointer drag, keyboard control, resize/content changes and cleanup.
7. [x] Browser-smoke the implemented CSS/JS in Chromium using a standalone page: desktop and 390px layout, light/dark, reduced motion, wheel, scroll direction, keyboard/seek, native scrollbar hidden while mounted, restored on cleanup. Correct the initially discovered hidden-element measurement issue and remove a full-rail focus outline that looked like a track.
8. [x] Review and update this plan and design specification for accuracy.

## Integration checks before merge

- [ ] In a provisioned full-repository checkout, run `node --test tests/*.test.mjs`, `npm run lint` and `npm run build`. A full Next.js build was unavailable in the editing environment.
- [ ] Compare real screenshots of the complete portfolio in Chromium, Firefox and Safari. Verify the comet remains visible against hero imagery and dark-theme panels and does not collide with section dots.
- [ ] Verify system light/dark toggle, keyboard focus visibility, 320px/mobile touch and assistive-technology semantics. This feature branch and the separate theme branch both modify `_scrollbar.scss`; integrate deliberately.
- [ ] Confirm browser no-JS fallback, delayed hydration/route transitions, and no non-scrollable-page visual indicator.

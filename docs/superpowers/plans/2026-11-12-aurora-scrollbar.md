# Aurora Trace 5px Scrollbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or subagent-driven-development) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the portfolio's 4px root scrollbar with a native 5px Aurora Trace variant and scroll-responsive luminosity.

**Architecture:** Keep scrollbar painting in the existing SCSS partial. A tiny, client-only controller adds/removes a root attribute following passive `window` scroll events, without affecting scroll mechanics or React rendering.

**Tech Stack:** Next.js 16, React 19, SCSS, vanilla browser events, Node `node:test` (no new dependencies).

**Spec:** `docs/superpowers/specs/2026-11-12-aurora-scrollbar-design.md`

## Global Constraints
- WebKit/Chromium root scrollbar **5px**; Firefox `thin` approximation is acceptable where precise pixel size is unavailable.
- Aurora blue gradient idle; distinct brighter hover/scroll state; ~220ms cooldown.
- Preserve native document scroll, existing light palette and any later dark theme, nested custom scrollbar utilities, reduced-motion support, and current layout.
- No custom overlay, scrolling engine, packages, or theme implementation.

## Review Focus
- Rapid successive scroll events: timer restarts; the active state cannot expire after an earlier event (controller test).
- Component unmount during a pending timeout: no remaining listener/timer or root marker (controller test).
- Non-scrolling initial render / page reload: default visual stays idle; a scroll event alone activates it (controller test and browser check).
- Reduced motion / keyboard and wheel scrolling: no flickering highlight under reduced motion; native scroll remains available (browser check).
- Browser-specific root selectors and nested scrollbars: 5px applied to document in Chromium, Firefox graceful fallback, nested utilities unchanged (browser/SCSS review).

---

### Task 1: Add the scroll activity controller and behaviour regression tests

**Files:**
- Create: `src/utils/scrollbarActivity.mjs`
- Create: `tests/scrollbarActivity.test.mjs`

**Interfaces:**
- `observeScrollActivity({ scrollTarget = window, rootElement = document.documentElement, idleDelayMs = 220 } = {}) -> () => void`
- The returned cleanup function removes listener, timer and `data-aurora-scroll-active` root attribute.

- [ ] **Step 1: Write failing tests.** With fake `scrollTarget` and `rootElement`, assert that a passive `scroll` listener is attached; the attribute is absent initially; scroll adds it; repeated scroll replaces the timer; timeout removes it; cleanup removes attribute/timer/listener, including pending-timeout teardown.
- [ ] **Step 2: Run red tests.** `node --test tests/scrollbarActivity.test.mjs` must fail while the controller has not been implemented.
- [ ] **Step 3: Implement `observeScrollActivity`.** Use one scroll listener, `setTimeout`/`clearTimeout` provided by `scrollTarget`, and an idempotent cleanup. Do not touch `scrollTop` or navigation.
- [ ] **Step 4: Run green tests.** `node --test tests/scrollbarActivity.test.mjs` returns zero failed tests.

### Task 2: Connect styling to the existing page

**Files:**
- Create: `src/components/animation/ScrollbarActivity.jsx`
- Modify: `app/layout.jsx`
- Modify: `public/static/css/_scrollbar.scss`

**Interfaces:**
- Client component imports `observeScrollActivity`, calls it from `useEffect`, returns `null`; mounted once in the root body.
- CSS state key: `html[data-aurora-scroll-active]`.
- Retain `.scrollbarxcustom` / `.scrollbarycustom` definitions unchanged.

- [ ] **Step 1: Replace only the root scrollbar rules** in `_scrollbar.scss` with a transparent track, 5px `html::-webkit-scrollbar`, cyan-to-blue gradient rounded thumb, restrained idle shadow, brighter scroll/hover state gated behind `prefers-reduced-motion: no-preference`, and `@supports not selector(::-webkit-scrollbar)` Firefox `thin` fallback.
- [ ] **Step 2: Add the client component and mount** once from `app/layout.jsx` without modifying existing HTML classes or child composition.
- [ ] **Step 3: Verify styles and scroll functionality in a real browser.** Smoke-check active vs idle, 5px Chromium gutter, scrollbar hover, keyboard/wheel scrolling, light/dark background legibility, reduced motion, and no horizontal overflow. Note OS overlay limitations.
- [ ] **Step 4: Run verification.** `node --test tests/scrollbarActivity.test.mjs`; `npm run lint` and `npm run build` if dependencies available; otherwise record inability, and use syntax and browser checks rather than claiming those passed.
- [ ] **Step 5: Independently review implementation.** Compare the full diff with this plan and spec for event lifecycle, visual fallback, accessibility, scope creep and unintended changes; fix verified problems, rerun affected checks.
- [ ] **Step 6: Commit coherently and open a PR** from `feat/aurora-trace-scrollbar-5px` into `master`, including review and verification status.

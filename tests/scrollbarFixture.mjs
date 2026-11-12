import assert from 'node:assert/strict';
import { mountAuroraCometScrollbar } from '../src/utils/scrollbarActivity.mjs';
export function makeFixture({ height = 600, documentHeight = 3600, railHeight = 500 } = {}) {
  const rootAttributes = new Set();
  const railAttributes = new Map();
  const css = new Map();
  const classes = new Set();
  const listeners = new Map();
  const railListeners = new Map();
  const timers = new Map();
  let nextId = 0;
  let activePointer = null;
  let observed = null;
  let disconnected = false;
  const scrollingElement = { scrollHeight: documentHeight, scrollTop: 0 };
  const rootElement = {
    clientHeight: height,
    setAttribute: (name) => rootAttributes.add(name),
    removeAttribute: (name) => rootAttributes.delete(name),
  };
  const railElement = {
    clientHeight: railHeight,
    hidden: true,
    dataset: {},
    style: { setProperty: (name, value) => css.set(name, value) },
    classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name), contains: (name) => classes.has(name) },
    setAttribute: (name, value) => railAttributes.set(name, value),
    addEventListener: (type, listener) => railListeners.set(type, listener),
    removeEventListener: (type, listener) => { if (railListeners.get(type) === listener) railListeners.delete(type); },
    getBoundingClientRect: () => ({ top: 44, height: railHeight }),
    setPointerCapture: (pointerId) => { activePointer = pointerId; },
    hasPointerCapture: (pointerId) => activePointer === pointerId,
    releaseCapture: () => { activePointer = null; },
  };
  const scrollTarget = {
    innerHeight: height,
    addEventListener: (type, listener) => listeners.set(type, listener),
    removeEventListener: (type, listener) => { if (listeners.get(type) === listener) listeners.delete(type); },
    setTimeout: (callback) => { const id = ++nextId; timers.set(id, callback); return id; },
    clearTimeout: (id) => timers.delete(id),
    ResizeObserver: class { constructor(callback) { this.callback = callback; observed = this; } observe(element) { assert.equal(element, scrollingElement); } disconnect() { disconnected = true; } },
    scrollTo: ({ top }) => { scrollingElement.scrollTop = top; listeners.get('scroll')?.(); },
    scrollBy: ({ top }) => { scrollingElement.scrollTop += top; listeners.get('scroll')?.(); },
  };
  const cleanup = mountAuroraCometScrollbar({ scrollTarget, rootElement, railElement, scrollingElement });
  return {
    railElement, rootElement, scrollTarget, scrollingElement, css, classes, listeners,
    railListeners, timers, rootAttributes, railAttributes, cleanup,
    emitScroll: (top) => { scrollingElement.scrollTop = top; listeners.get('scroll')?.(); },
    emitRail: (type, event) => railListeners.get(type)?.(event),
    flushTimers: () => { for (const [id, callback] of [...timers]) { timers.delete(id); callback(); } },
    refresh: () => observed?.callback(),
    wasDisconnected: () => disconnected,
  };
}

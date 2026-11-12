import test from 'node:test';
import assert from 'node:assert/strict';
import { observeScrollActivity } from '../src/utils/scrollbarActivity.mjs';

const ACTIVE_ATTRIBUTE = 'data-aurora-scroll-active';

const createFixture = () => {
  const attributes = new Set();
  const timers = new Map();
  let nextTimerId = 0;
  let scrollListener;
  let scrollOptions;

  const rootElement = {
    setAttribute: (name) => attributes.add(name),
    removeAttribute: (name) => attributes.delete(name),
    hasAttribute: (name) => attributes.has(name),
  };

  const scrollTarget = {
    addEventListener: (event, listener, options) => {
      assert.equal(event, 'scroll');
      scrollListener = listener;
      scrollOptions = options;
    },
    removeEventListener: (event, listener) => {
      assert.equal(event, 'scroll');
      if (scrollListener === listener) scrollListener = undefined;
    },
    setTimeout: (callback, delay) => {
      assert.equal(delay, 220);
      const id = ++nextTimerId;
      timers.set(id, callback);
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
  };

  return {
    rootElement,
    scrollTarget,
    timers,
    fireScroll: () => scrollListener?.(),
    flushTimers: () => {
      for (const [id, callback] of [...timers]) {
        timers.delete(id);
        callback();
      }
    },
    hasListener: () => typeof scrollListener === 'function',
    listenerOptions: () => scrollOptions,
    isActive: () => rootElement.hasAttribute(ACTIVE_ATTRIBUTE),
  };
};

test('is idle at mount and subscribes to passive page scrolling', () => {
  const fixture = createFixture();
  const cleanup = observeScrollActivity(fixture);
  assert.equal(fixture.isActive(), false);
  assert.equal(fixture.hasListener(), true);
  assert.deepEqual(fixture.listenerOptions(), { passive: true });
  cleanup();
});

test('lights the thumb on scroll and restores idle after the cooldown', () => {
  const fixture = createFixture();
  const cleanup = observeScrollActivity(fixture);
  fixture.fireScroll();
  assert.equal(fixture.isActive(), true);
  assert.equal(fixture.timers.size, 1);
  fixture.flushTimers();
  assert.equal(fixture.isActive(), false);
  cleanup();
});

test('rapid scroll events reset the idle cooldown', () => {
  const fixture = createFixture();
  const cleanup = observeScrollActivity(fixture);
  fixture.fireScroll();
  const [firstTimerId] = fixture.timers.keys();
  fixture.fireScroll();
  assert.equal(fixture.isActive(), true);
  assert.equal(fixture.timers.has(firstTimerId), false);
  assert.equal(fixture.timers.size, 1);
  fixture.flushTimers();
  assert.equal(fixture.isActive(), false);
  cleanup();
});

test('cleanup detaches scrolling and cancels any pending visual state', () => {
  const fixture = createFixture();
  const cleanup = observeScrollActivity(fixture);
  fixture.fireScroll();
  cleanup();
  cleanup();
  assert.equal(fixture.hasListener(), false);
  assert.equal(fixture.timers.size, 0);
  assert.equal(fixture.isActive(), false);
  fixture.fireScroll();
  assert.equal(fixture.isActive(), false);
});

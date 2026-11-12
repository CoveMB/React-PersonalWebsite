import test from 'node:test';
import assert from 'node:assert/strict';
import * as scrollbar from '../src/utils/scrollbarActivity.mjs';

const makeElements = () => {
  const attributes = new Set();
  const listeners = new Map();
  const styles = new Map();
  const rootElement = {
    clientHeight: 600,
    scrollHeight: 3600,
    setAttribute: (name) => attributes.add(name),
    removeAttribute: (name) => attributes.delete(name),
    hasAttribute: (name) => attributes.has(name),
  };
  const glowElement = {
    hidden: true,
    style: { setProperty: (name, value) => styles.set(name, value) },
  };
  const timers = new Map();
  let nextTimer = 1;
  const scrollTarget = {
    scrollY: 0,
    innerWidth: 800,
    innerHeight: 600,
    addEventListener: (type, callback) => listeners.set(type, callback),
    removeEventListener: (type, callback) => {
      if (listeners.get(type) === callback) listeners.delete(type);
    },
    setTimeout: (callback) => {
      const id = nextTimer++;
      timers.set(id, callback);
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
  };
  return {
    scrollTarget, rootElement, glowElement, styles, attributes, listeners, timers,
    emit: (type, props) => listeners.get(type)?.(props),
  };
};

test('glow geometry follows native thumb position instead of staying at page top', () => {
  const values = scrollbar.getAuroraGlowGeometry({ viewportHeight: 600, scrollHeight: 3600, scrollTop: 1500 });
  assert.deepEqual(values, { height: 100, top: 250 });
  assert.deepEqual(scrollbar.getAuroraGlowGeometry({ viewportHeight: 600, scrollHeight: 3600, scrollTop: 3000 }), { height: 100, top: 500 });
});

test('glow geometry hides when page does not scroll and clamps extreme scroll offsets', () => {
  assert.equal(scrollbar.getAuroraGlowGeometry({ viewportHeight: 600, scrollHeight: 600, scrollTop: 0 }), null);
  assert.deepEqual(scrollbar.getAuroraGlowGeometry({ viewportHeight: 600, scrollHeight: 3600, scrollTop: -500 }), { height: 100, top: 0 });
  assert.deepEqual(scrollbar.getAuroraGlowGeometry({ viewportHeight: 600, scrollHeight: 3600, scrollTop: 5000 }), { height: 100, top: 500 });
});

test('decorative glow aligns at mount, follows scroll and resize, and stops on cleanup', () => {
  const fixture = makeElements();
  const cleanup = scrollbar.observeScrollActivity({ ...fixture });
  assert.equal(fixture.glowElement.hidden, false);
  assert.equal(fixture.styles.get('--aurora-glow-height'), '100px');
  assert.equal(fixture.styles.get('--aurora-glow-top'), '0px');

  fixture.scrollTarget.scrollY = 1500;
  fixture.emit('scroll');
  assert.equal(fixture.styles.get('--aurora-glow-top'), '250px');
  assert.equal(fixture.attributes.has('data-aurora-scroll-active'), true);

  fixture.scrollTarget.innerHeight = 500;
  fixture.rootElement.clientHeight = 500;
  fixture.emit('resize');
  assert.equal(fixture.styles.get('--aurora-glow-height'), `${500 * 500 / 3600}px`);

  fixture.rootElement.scrollHeight = 500;
  fixture.emit('resize');
  assert.equal(fixture.glowElement.hidden, true);

  cleanup();
  assert.equal(fixture.listeners.has('scroll'), false);
  assert.equal(fixture.listeners.has('resize'), false);
  assert.equal(fixture.timers.size, 0);
  assert.equal(fixture.attributes.has('data-aurora-scroll-active'), false);
});

test('edge hover activates the noninteractive halo and moving away removes it', () => {
  const fixture = makeElements();
  const cleanup = scrollbar.observeScrollActivity({ ...fixture });
  fixture.emit('pointermove', { clientX: 794 });
  assert.equal(fixture.attributes.has('data-aurora-scroll-hover'), true);
  fixture.emit('pointermove', { clientX: 300 });
  assert.equal(fixture.attributes.has('data-aurora-scroll-hover'), false);
  cleanup();
  assert.equal(fixture.listeners.has('pointermove'), false);
});

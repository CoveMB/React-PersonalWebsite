import test from 'node:test';
import assert from 'node:assert/strict';
import { getCometGeometry } from '../src/utils/scrollbarActivity.mjs';
import { makeFixture } from './scrollbarFixture.mjs';

test('maps fixed-size comet head to exact start, middle and end of the rail', () => {
  const opts = { viewportHeight: 600, scrollHeight: 3600, railHeight: 500 };
  assert.deepEqual(getCometGeometry({ ...opts, scrollTop: 0 }), { top: 0, percentage: 0 });
  assert.deepEqual(getCometGeometry({ ...opts, scrollTop: 1500 }), { top: 247.5, percentage: 50 });
  assert.deepEqual(getCometGeometry({ ...opts, scrollTop: 3000 }), { top: 495, percentage: 100 });
});

test('clamps overscroll and hides indicator when document does not scroll', () => {
  const opts = { viewportHeight: 600, scrollHeight: 3600, railHeight: 500 };
  assert.deepEqual(getCometGeometry({ ...opts, scrollTop: -100 }), { top: 0, percentage: 0 });
  assert.deepEqual(getCometGeometry({ ...opts, scrollTop: 9999 }), { top: 495, percentage: 100 });
  assert.equal(getCometGeometry({ ...opts, scrollHeight: 600, scrollTop: 0 }), null);
  assert.equal(getCometGeometry({ ...opts, railHeight: 3, scrollTop: 0 }), null);
  assert.equal(getCometGeometry({ ...opts, scrollTop: NaN }), null);
});

test('mount enables overlay, updates orientation and percentage, dims when idle', () => {
  const fixture = makeFixture();
  assert.equal(fixture.rootAttributes.has('data-aurora-comet-ready'), true);
  assert.equal(fixture.railElement.hidden, false);
  assert.equal(fixture.css.get('--comet-y'), '0px');
  assert.equal(fixture.railAttributes.get('aria-valuenow'), '0');
  fixture.emitScroll(1500);
  assert.equal(fixture.railElement.dataset.direction, 'down');
  assert.equal(fixture.css.get('--comet-y'), '247.5px');
  assert.equal(fixture.railAttributes.get('aria-valuenow'), '50');
  assert.equal(fixture.classes.has('is-moving'), true);
  fixture.emitScroll(700);
  assert.equal(fixture.railElement.dataset.direction, 'up');
  assert.equal(fixture.timers.size, 1);
  fixture.flushTimers();
  assert.equal(fixture.classes.has('is-moving'), false);
  fixture.cleanup();
});

test('removes all listeners and restores native scrollbar after unmount', () => {
  const fixture = makeFixture();
  fixture.emitScroll(700);
  fixture.cleanup();
  fixture.cleanup();
  assert.equal(fixture.rootAttributes.has('data-aurora-comet-ready'), false);
  assert.equal(fixture.timers.size, 0);
  assert.equal(fixture.listeners.size, 0);
  assert.equal(fixture.railListeners.size, 0);
  assert.equal(fixture.wasDisconnected(), true);
});

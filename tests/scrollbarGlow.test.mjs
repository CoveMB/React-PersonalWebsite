import test from 'node:test';
import assert from 'node:assert/strict';
import { makeFixture } from './scrollbarFixture.mjs';

test('pointer clicking or dragging moves the real page, not a simulated content surface', () => {
  const fixture = makeFixture();
  let prevented = false;
  fixture.emitRail('pointerdown', { button: 0, pointerId: 7, clientY: 44 + 250, preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(Math.round(fixture.scrollingElement.scrollTop), 1500);
  fixture.emitRail('pointermove', { pointerId: 7, clientY: 44 + 497.5 });
  assert.equal(fixture.scrollingElement.scrollTop, 3000);
  fixture.railElement.releaseCapture();
  fixture.emitRail('pointermove', { pointerId: 7, clientY: 45 });
  assert.equal(fixture.scrollingElement.scrollTop, 3000);
  fixture.cleanup();
});

test('ignores non-primary pointer presses', () => {
  const fixture = makeFixture();
  fixture.emitRail('pointerdown', { button: 2, pointerId: 2, clientY: 280, preventDefault() { throw Error('should not prevent default'); } });
  assert.equal(fixture.scrollingElement.scrollTop, 0);
  fixture.cleanup();
});

test('keyboard arrows, page jump and endpoints control the native page position', () => {
  const fixture = makeFixture();
  const key = (k) => fixture.emitRail('keydown', { key: k, preventDefault() {} });
  key('ArrowDown'); assert.equal(fixture.scrollingElement.scrollTop, 48);
  key('PageDown'); assert.equal(fixture.scrollingElement.scrollTop, 528);
  key(' '); assert.equal(fixture.scrollingElement.scrollTop, 1008);
  key('End'); assert.equal(fixture.scrollingElement.scrollTop, 3000);
  key('Home'); assert.equal(fixture.scrollingElement.scrollTop, 0);
  key('ArrowUp'); assert.equal(fixture.scrollingElement.scrollTop, -48);
  fixture.cleanup();
});

test('resize and content changes adjust travel or hide the comet', () => {
  const fixture = makeFixture();
  fixture.emitScroll(1500);
  fixture.railElement.clientHeight = 300;
  fixture.refresh();
  assert.equal(fixture.css.get('--comet-y'), '147.5px');
  fixture.scrollingElement.scrollHeight = 600;
  fixture.refresh();
  assert.equal(fixture.railElement.hidden, true);
  fixture.scrollingElement.scrollHeight = 3600;
  fixture.refresh();
  assert.equal(fixture.railElement.hidden, false);
  fixture.cleanup();
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { selectRoleFitModelId, selectRoleFitModelCandidates } from '../src/utils/roleFit.js';

const model = (model_id, vram_required_MB) => ({ model_id, vram_required_MB });
const catalog = [
  model('Qwen2.5-0.5B-Instruct-q0f16-MLC', 1624.12),
  model('Qwen2.5-0.5B-Instruct-q4f16_1-MLC', 944.62),
  model('Qwen2.5-1.5B-Instruct-q4f16_1-MLC', 1629.75),
  model('Qwen2.5-3B-Instruct-q4f16_1-MLC', 2504.76),
  model('Qwen3-4B-q4f16_1-MLC', 3431.59),
];
test('prefer more capable 3B instruct model over tiny default while keeping smaller fallbacks', () => {
  assert.equal(selectRoleFitModelId(catalog), 'Qwen2.5-3B-Instruct-q4f16_1-MLC');
  const ids = selectRoleFitModelCandidates(catalog);
  assert.deepEqual(ids.slice(0, 3), [
    'Qwen2.5-3B-Instruct-q4f16_1-MLC',
    'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
  ]);
  assert.equal(new Set(ids).size, ids.length);
});
test('do not select models absent from runtime catalog or unbounded enormous models', () => {
  assert.deepEqual(selectRoleFitModelCandidates([]), []);
  assert.deepEqual(selectRoleFitModelCandidates([
    model('Unknown-70B-Instruct-q4f16_1-MLC', 40000),
    model('Qwen2.5-1.5B-Instruct-q4f16_1-MLC', 1629.75),
  ]), ['Qwen2.5-1.5B-Instruct-q4f16_1-MLC']);
});
test('low-resource compatibility retains 0.5B fallback', () => {
  const ids = selectRoleFitModelCandidates(catalog.filter(x => /0\.5B/.test(x.model_id)));
  assert.deepEqual(ids, ['Qwen2.5-0.5B-Instruct-q4f16_1-MLC', 'Qwen2.5-0.5B-Instruct-q0f16-MLC']);
});

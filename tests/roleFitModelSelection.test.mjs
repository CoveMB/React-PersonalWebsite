import assert from 'node:assert/strict';
import test from 'node:test';
import { selectRoleFitModelId, selectRoleFitModelCandidates } from '../src/utils/roleFit.js';

const model = (model_id, vram_required_MB) => ({ model_id, vram_required_MB });
const catalog = [
  model('Qwen3.5-0.8B-q4f16_1-MLC', 1629.49),
  model('Qwen3.5-0.8B-q4f32_1-MLC', 1894.19),
  model('Qwen2.5-0.5B-Instruct-q4f16_1-MLC', 944.62),
  model('Qwen2.5-0.5B-Instruct-q4f32_1-MLC', 1060.2),
  model('Qwen2.5-1.5B-Instruct-q4f16_1-MLC', 1629.75),
  model('Qwen2.5-3B-Instruct-q4f16_1-MLC', 2504.76),
  model('Qwen3.5-4B-q4f16_1-MLC', 3867.82),
];

test('prioritize Qwen3.5 0.8B as the only primary model; retain a small compatibility fallback', () => {
  assert.equal(selectRoleFitModelId(catalog), 'Qwen3.5-0.8B-q4f16_1-MLC');
  assert.deepEqual(selectRoleFitModelCandidates(catalog), [
    'Qwen3.5-0.8B-q4f16_1-MLC',
    'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
  ]);
});

test('when shader-f16 is unavailable use Qwen3.5 q4f32 with an f32 fallback', () => {
  assert.equal(selectRoleFitModelId(catalog, { supportsF16: false }), 'Qwen3.5-0.8B-q4f32_1-MLC');
  assert.deepEqual(selectRoleFitModelCandidates(catalog, { supportsF16: false }), [
    'Qwen3.5-0.8B-q4f32_1-MLC',
    'Qwen2.5-0.5B-Instruct-q4f32_1-MLC',
  ]);
});

test('return only exact supported model IDs actually present in the runtime catalog', () => {
  assert.deepEqual(selectRoleFitModelCandidates([]), []);
  assert.deepEqual(selectRoleFitModelCandidates([
    model('Qwen2.5-3B-Instruct-q4f16_1-MLC', 2504.76),
    model('Unknown-70B-Instruct-q4f16_1-MLC', 40000),
    model('Qwen3.5-0.8B-q4f16_1-MLC', 1629.49),
  ]), ['Qwen3.5-0.8B-q4f16_1-MLC']);
  assert.deepEqual(selectRoleFitModelCandidates([
    model('Qwen2.5-0.5B-Instruct-q4f16_1-MLC', 944.62),
  ]), ['Qwen2.5-0.5B-Instruct-q4f16_1-MLC']);
});

test('do not silently choose unsupported F16 model without shader-f16 support', () => {
  const f16Only = catalog.filter(m => m.model_id.includes('q4f16_1-'));
  assert.deepEqual(selectRoleFitModelCandidates(f16Only, { supportsF16: false }), []);
});

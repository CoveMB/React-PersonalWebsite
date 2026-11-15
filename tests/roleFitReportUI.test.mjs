import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
const aiReport = readFileSync(new URL('../src/components/ai/RoleFitAIReport.jsx', import.meta.url), 'utf8');
const aiSection = readFileSync(new URL('../src/components/ai/AI.jsx', import.meta.url), 'utf8');

test('AI assessment is the first card, the mechanical report remains independent underneath', () => {
  assert.ok(aiSection.indexOf('<RoleFitAIReport') < aiSection.indexOf('<RoleFitReport'));
  assert.match(aiSection, /mechanicalAssessment=\{roleFitState\.result\}/);
});
test('recruiter UI renders source-backed experience statements, not job quotes or model notes', () => {
  assert.match(aiReport, /selection\.title/);
  assert.match(aiReport, /selection\.summary/);
  assert.match(aiReport, /selection\.sources/);
  assert.doesNotMatch(aiReport, /No source-checked item was selected|Model interpretation \(unverified\)/);
});
test('unverified raw model JSON is diagnostic-only and a missing AI model keeps readable fallback', () => {
  assert.match(aiReport, /<details[^>]*>/);
  assert.match(aiReport, /<pre>\{assessment\.original\}<\/pre>/);
  assert.match(aiReport, /buildRoleFitRecruiterSummary/);
  assert.match(aiReport, /model.*unavailable|unavailable.*model/i);
});

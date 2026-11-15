import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
const ai = readFileSync(new URL('../src/components/ai/RoleFitAIReport.jsx', import.meta.url),'utf8');
const section = readFileSync(new URL('../src/components/ai/AI.jsx', import.meta.url),'utf8');
const hook = readFileSync(new URL('../src/components/ai/useRoleFitLab.js', import.meta.url),'utf8');

test('AI is a distinct first card; mechanical report remains below',()=>{
  assert.ok(section.indexOf('<RoleFitAIReport') < section.indexOf('<RoleFitReport'));
  assert.match(section,/<RoleFitReport assessment=\{roleFitState\.result\}/);
  assert.doesNotMatch(section,/mechanicalAssessment=\{roleFitState\.result\}/);
});
test('AI card cannot render deterministic fallback content before actual model completion',()=>{
  assert.doesNotMatch(ai,/buildRoleFitRecruiterSummary|fallbackSections|assessment\?\.sections|safeBaseline|RecruiterItem/);
  assert.match(ai,/status === ['"]running['"]/);
  assert.match(ai,/status === ['"]unavailable['"]/);
  assert.match(ai,/status === ['"]failed['"]/);
  assert.match(ai,/status === ['"]ready['"]/);
  assert.match(ai,/assessment\?\.text/);
  assert.match(ai,/unverified|not verified|unreviewed/i);
});
test('AI generation prompt uses source quotes and enough tokens to produce all sections',()=>{
  assert.match(hook,/max_tokens:\s*(?:[4-9]\d\d|1\d\d\d)/);
  assert.doesNotMatch(hook,/buildRoleFitRecruiterSummary/);
  assert.match(hook,/buildRoleFitAIRequest/);
});
test('model-authored bullets are announced as a semantic list, not decorative paragraphs', () => {
  assert.match(ai, /<ul\b[^>]*className="roleFitAIModelBulletList"/);
  assert.match(ai, /<li\b[^>]*className="roleFitAIModelBullet"/);
});

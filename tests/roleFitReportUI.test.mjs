import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const section = readFileSync(new URL('../src/components/ai/AI.jsx', import.meta.url), 'utf8');
const report = readFileSync(new URL('../src/components/ai/RoleFitReport.jsx', import.meta.url), 'utf8');
const hook = readFileSync(new URL('../src/components/ai/useRoleFitLab.js', import.meta.url), 'utf8');
const content = readFileSync(new URL('../src/content/roleFitLabContent.js', import.meta.url), 'utf8');

test('only one assessment card is rendered after an analysis', () => {
  assert.match(section, /<RoleFitReport\b/);
  assert.doesNotMatch(section, /RoleFitAIReport|<RoleFitAIReport\b/);
  assert.equal((section.match(/<RoleFitReport\b/g) ?? []).length, 1);
  assert.match(section, /aiAssessment=\{roleFitState\.aiAssessment\}/);
  assert.match(section, /aiStatus=\{roleFitState\.aiStatus\}/);
});

test('the report has exactly the three named primary classification groups', () => {
  assert.match(report, /title: 'Directly demonstrated'/);
  assert.match(report, /title: 'Transferable experience'/);
  assert.match(report, /title: 'Not established'/);
  assert.match(report, /const groups = \[/);
  assert.match(report, /groups\.map\(/);
  assert.doesNotMatch(report, /Mechanical assessment|independent mechanical|Relevant documented work|Consequential requirements to verify/);
});

test('a model note is labeled as unverified, and the candidate can inspect source excerpts', () => {
  assert.match(report, /Local AI interpretation · unverified wording/);
  assert.match(report, /sourceQuote\.replace/);
  assert.match(report, /Open source/);
  assert.match(report, /not necessarily professional tenure/);
  assert.doesNotMatch(report, /dangerouslySetInnerHTML/);
});

test('unavailable and malformed model responses never masquerade as generated conclusions', () => {
  assert.match(report, /aiStatus === 'unavailable'/);
  assert.match(report, /aiStatus === 'failed'/);
  assert.match(report, /aiStatus === 'empty'/);
  assert.match(report, /Showing the source-based comparison instead, not a generated AI result/);
  assert.match(hook, /action\.result\.kind === 'accepted'/);
});

test('progressive disclosure, input revision control and keyboard shortcuts remain', () => {
  assert.match(report, /initialVisiblePerGroup = 3/);
  assert.match(report, /<details className="roleFitInventory roleFitAdditionalItems">/);
  assert.match(report, /role-fit-heading/);
  assert.match(report, /tabIndex=\{-1\}/);
  assert.match(hook, /gateReference\.current\.bump\(\)/);
  assert.match(hook, /event\.ctrlKey \|\| event\.metaKey/);
});

test('privacy copy no longer promises two competing reports or a first-five-thousand-character model-only view', () => {
  assert.doesNotMatch(content, /both assessments|first 5,000 characters|mechanical report covers/i);
  assert.match(content, /not uploaded/);
  assert.match(content, /clearly labeled evidence-only comparison/i);
});

test('AI failure explanation distinguishes invalid JSON from generation and download failures', () => {
  assert.match(report, /aiFailure/);
  assert.match(report, /roleFitAiFailureMessages/);
  assert.match(hook, /classifyRoleFitAIError/);
  assert.match(content, /invalid_json/);
  assert.match(content, /generation_limit/);
  assert.match(content, /download_failed/);
  assert.doesNotMatch(report, /The local AI could not produce a usable, source-bound interpretation/);
});

test('partial transfer wording distinguishes ambiguous illustrative lists from mandatory AND groups', () => {
  assert.match(report, /relatedGroupKind/);
  assert.match(report, /illustrative framework list/);
  assert.match(report, /full combined requirement remains/);
});

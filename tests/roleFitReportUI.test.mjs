import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
const section = readFileSync(new URL('../src/components/ai/AI.jsx', import.meta.url), 'utf8');
const report = readFileSync(new URL('../src/components/ai/RoleFitReport.jsx', import.meta.url), 'utf8');
const hook = readFileSync(new URL('../src/components/ai/useRoleFitLab.js', import.meta.url), 'utf8');
const content = readFileSync(new URL('../src/content/roleFitLabContent.js', import.meta.url), 'utf8');
const newCardPath = new URL('../src/components/ai/RoleFitAIReport.jsx', import.meta.url);
const aiCard = () => existsSync(newCardPath) ? readFileSync(newCardPath, 'utf8') : '';

test('AI card is before and independent of the existing deterministic evidence card', () => {
  assert.match(section, /<RoleFitAIReport\b/);
  assert.match(section, /<RoleFitReport\b/);
  assert.ok(section.indexOf('<RoleFitAIReport') < section.indexOf('<RoleFitReport'));
  assert.equal((section.match(/<RoleFitAIReport\b/g) ?? []).length, 1);
  assert.equal((section.match(/<RoleFitReport\b/g) ?? []).length, 1);
  assert.match(section, /<RoleFitReport assessment=\{roleFitState\.result\}/);
});

test('deterministic report retains existing three-category structure and source links without AI prose', () => {
  assert.match(report, /title: 'Directly demonstrated'/);
  assert.match(report, /title: 'Transferable experience'/);
  assert.match(report, /title: 'Not established'/);
  assert.match(report, /<EvidenceDetails/);
  assert.match(report, /<RequirementGroup/);
  assert.match(report, /roleFitItemEvidence/);
  assert.doesNotMatch(report, /aiStatus|aiFailure|aiAssessment|row\.modelNote|Local AI interpretation/);
});

test('AI card displays accepted model-authored notes in the three required categories', () => {
  const src=aiCard();
  assert.match(src, /AI assessment/);
  assert.match(src, /Directly demonstrated/);
  assert.match(src, /Transferable experience/);
  assert.match(src, /Not established/);
  assert.match(src, /sections\[group\.key\]/);
  assert.match(src, /selection\.note/);
  assert.doesNotMatch(src, /dangerouslySetInnerHTML/);
});

test('rejection section visibly explains why text was rejected and renders original response inertly', () => {
  const src=aiCard();
  assert.match(src, /rejectedItems/);
  assert.match(src, /rejectionReasons/);
  assert.match(src, /rawModelOutput/);
  assert.match(src, /<pre\b/);
  assert.match(src, /Rejected model output/);
  assert.doesNotMatch(src, /dangerouslySetInnerHTML|innerHTML/);
});

test('AI card contains runtime fallback and safe diagnostic but cannot misrepresent mechanical findings as AI', () => {
  const src=aiCard();
  assert.match(src, /status === 'running'/);
  assert.match(src, /status === 'unavailable'/);
  assert.match(src, /status === 'failed'/);
  assert.match(src, /roleFitAiFailureMessages/);
  assert.match(src, /aiFailure\?\.code/);
  assert.doesNotMatch(src, /buildRoleFitAssessment|matchRoleRequirements|buildRoleFitRecruiterSummary/);
});

test('existing layout classes and user-input affordances are reused', () => {
  const src=aiCard();
  assert.match(src, /aiPart roleFitResultCard/);
  assert.match(report, /aiPart roleFitResultCard/);
  assert.match(report, /roleFitThreeWayGrid/);
  assert.match(report, /initialVisiblePerGroup = 3/);
  assert.match(report, /roleFitInventory roleFitAdditionalItems/);
  assert.match(section, /roleFitForm/);
  assert.match(hook, /event\.ctrlKey \|\| event\.metaKey/);
  assert.match(hook, /gateReference\.current\.bump\(\)/);
});

test('privacy note does not promise remote processing; original model response is not sent outside browser', () => {
  assert.match(content, /not uploaded/);
  assert.doesNotMatch(hook, /localStorage|sessionStorage|fetch\s*\(/);
  assert.doesNotMatch(aiCard(), /fetch\s*\(|navigator\.sendBeacon|localStorage/);
});

test('accepted AI answers with no rejections do not show a misleading rejected-output panel', () => {
  const src = aiCard();
  assert.match(src, /status !== 'ready'/);
  assert.doesNotMatch(src, /const hasRejectedResponse = Boolean\(assessment\?\.rawModelOutput\) \|\|/);
});

test('loading 100 percent no longer masquerades as completion; generation has independent progress', () => {
  assert.match(hook, /awaitRoleFitModelReady/);
  assert.match(hook, /Finalizing local model initialization/);
  assert.match(hook, /streamRoleFitAI/);
  assert.match(hook, /signal: controller\.signal/);
  assert.match(hook, /activeAbortReference\.current\?\.abort\(\)/);
  assert.match(content, /first_token_timeout/);
  assert.match(content, /generation_stalled/);
  assert.match(content, /generation_timeout/);
  assert.doesNotMatch(hook, /const response = await engine\.chat\.completions\.create\(/);
});

test('interrupted model output is displayed in the AI card but never as a verified interpretation', () => {
  const src = aiCard();
  assert.match(src, /aiFailure\?\.partialOutput/);
  assert.match(src, /Incomplete model output/);
  assert.match(src, /<pre\b[^>]*>\{aiFailure\.partialOutput\}<\/pre>/);
  assert.doesNotMatch(src, /dangerouslySetInnerHTML/);
  assert.doesNotMatch(report, /aiFailure|partialOutput/);
  assert.doesNotMatch(hook, /localStorage|sessionStorage/);
});

test('failed model inference exposes the original exception in the existing local diagnostic panel', () => {
  const src = aiCard();
  assert.match(hook, /technicalDetails: formatRoleFitAIErrorDetails\\(cause\\)/);
  assert.match(src, /<summary>Technical diagnostic<\\/summary>/);
  assert.match(src, /open=\\{status === 'failed'\\}/);
  assert.match(src, /\\{aiFailure\\.technicalDetails\\}/);
  assert.match(src, /review before sharing/i);
  assert.doesNotMatch(src, /dangerouslySetInnerHTML|innerHTML/);
  assert.doesNotMatch(report, /technicalDetails/);
  assert.doesNotMatch(hook, /localStorage|sessionStorage|fetch\\s*\\(/);
});

test('first-token timeout retries a smaller local model without modifying the card layout', () => {
  assert.match(hook, /runRoleFitWithFallback/);
  assert.match(hook, /loadEngine\(revision, excludedIds\)/);
  assert.match(hook, /onRetry:/);
  assert.match(hook, /Trying a smaller local model/);
  assert.match(hook, /stopModel\(\{ workerReference, engineReference, enginePromiseReference \}\)/);
  assert.match(section, /<RoleFitAIReport/);
  assert.match(section, /<RoleFitReport/);
  assert.match(report, /roleFitThreeWayGrid/);
});


test('first-token timeout explains prompt prefill as an alternative to a GPU stall', () => {
  assert.match(content, /first_token_timeout:[\s\S]{0,240}prepar(?:ing|ation|e) the prompt/);
});

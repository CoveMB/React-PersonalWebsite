import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const section = readFileSync(new URL('../src/components/ai/AI.jsx', import.meta.url), 'utf8');
const report = readFileSync(new URL('../src/components/ai/RoleFitReport.jsx', import.meta.url), 'utf8');
const aiCard = readFileSync(new URL('../src/components/ai/RoleFitAIReport.jsx', import.meta.url), 'utf8');
const hook = readFileSync(new URL('../src/components/ai/useRoleFitLab.js', import.meta.url), 'utf8');
const content = readFileSync(new URL('../src/content/roleFitLabContent.js', import.meta.url), 'utf8');
const resumeImport = readFileSync(new URL('../src/utils/resumeText.js', import.meta.url), 'utf8');
const aiLogic = readFileSync(new URL('../src/utils/roleFitAI.mjs', import.meta.url), 'utf8');

test('independent AI card remains above the evidence report without changing the outer layout', () => {
  assert.match(section, /<RoleFitAIReport\b/);
  assert.match(section, /<RoleFitReport\b/);
  assert.ok(section.indexOf('<RoleFitAIReport') < section.indexOf('<RoleFitReport'));
  assert.equal((section.match(/<RoleFitAIReport\b/g) ?? []).length, 1);
  assert.equal((section.match(/<RoleFitReport\b/g) ?? []).length, 1);
  assert.match(section, /<RoleFitReport assessment=\{roleFitState\.result\}/);
  assert.match(aiCard, /aiPart roleFitResultCard/);
  assert.match(report, /aiPart roleFitResultCard/);
});

test('AI card uses its own Markdown sections, never deterministic requirement associations', () => {
  assert.match(aiCard, /Directly demonstrated/);
  assert.match(aiCard, /Transferable experience/);
  assert.match(aiCard, /Not established/);
  assert.match(aiCard, /assessment\.sections\[group\.key\]/);
  assert.match(aiCard, /<InlineMarkdown text=\{note\}/);
  assert.doesNotMatch(aiCard, /buildThreeSectionRoleFit|mechanicalAssessment|row\.evidence/);
  assert.doesNotMatch(aiCard, /requirementId|sourceUrl|selectedCount} accepted/);
});

test('model content renders inertly, including HTML-looking input', () => {
  assert.doesNotMatch(aiCard, /dangerouslySetInnerHTML|innerHTML|DOMParser/);
  assert.match(aiCard, /<pre className="roleFitOutput">\{assessment\.rawModelOutput\}<\/pre>/);
  assert.match(aiCard, /<InlineMarkdown text=\{note\}/);
});

test('unstructured Markdown is visible but not assigned artificial categories', () => {
  assert.match(aiCard, /Unstructured model response/);
  assert.match(aiCard, /did not follow the requested Markdown headings/);
  assert.match(aiCard, /unstructured/);
  assert.match(aiCard, /unverified/);
});

test('missing model commentary is disclosed instead of mechanically filled', () => {
  assert.match(aiCard, /The model did not provide a statement in this section/);
  assert.match(aiCard, /missingSections/);
  assert.doesNotMatch(aiCard, /buildRoleFitAssessment|matchRoleRequirements/);
});

test('independent evidence card preserves three categories and published sources', () => {
  assert.match(report, /title: 'Directly demonstrated'/);
  assert.match(report, /title: 'Transferable experience'/);
  assert.match(report, /title: 'Not established'/);
  assert.match(report, /<EvidenceDetails/);
  assert.match(report, /roleFitItemEvidence/);
  assert.doesNotMatch(report, /aiStatus|aiFailure|aiAssessment|Local AI interpretation/);
});

test('the hook supplies the build-time Markdown résumé directly to the model', () => {
  assert.match(resumeImport, /Resume Cove Marquis EN\.md\?raw/);
  assert.match(hook, /resumeRoleFitText/);
  assert.match(hook, /buildRoleFitMarkdownRequest/);
  assert.match(hook, /roleFitMarkdownGenerationOptions/);
  assert.doesNotMatch(hook, /buildRoleFitAIRequest|allowedIds|responseFormat/);
  assert.match(aiLogic, /interpretRoleFitMarkdownResponse/);
  assert.doesNotMatch(aiLogic, /interpretRoleFitAIResponse|roleFitAIResponseSchema/);
});

test('error handling and technical console diagnostics remain visible without raw exceptions in the UI', () => {
  assert.match(hook, /console\.error\('\[AI Lab\] Local model failure'/);
  assert.match(hook, /formatRoleFitAIErrorDetails\(cause\)/);
  assert.match(aiCard, /Technical diagnostic \(error codes only\)/);
  assert.match(aiCard, /Incomplete model output/);
  assert.doesNotMatch(aiCard, /aiFailure\.technicalDetails/);
});

test('privacy, form and lifecycle constraints remain intact', () => {
  assert.match(content, /not uploaded/);
  assert.match(hook, /event\.ctrlKey \|\| event\.metaKey/);
  assert.match(hook, /gateReference\.current\.bump\(\)/);
  assert.match(hook, /activeAbortReference\.current\?\.abort\(\)/);
  assert.match(hook, /streamRoleFitAI/);
  assert.match(hook, /runRoleFitWithFallback/);
  assert.match(section, /roleFitForm/);
  assert.doesNotMatch(hook, /localStorage|sessionStorage|fetch\s*\(/);
  assert.doesNotMatch(aiCard, /navigator\.sendBeacon|fetch\s*\(/);
});

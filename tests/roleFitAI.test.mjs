import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildThreeSectionRoleFit, runRoleFitAnalyses,
  classifyRoleFitAIError, formatRoleFitAIErrorDetails,
} from '../src/utils/roleFitAI.mjs';
import { getRoleFitEvidenceCatalog } from '../src/utils/roleFitEvidence.mjs';
import { normalizeRolePosting, parseRoleRequirements } from '../src/utils/roleFitRequirements.mjs';
import { matchRoleRequirements } from '../src/utils/roleFitMatching.mjs';
import { buildRoleFitAssessment } from '../src/utils/roleFitAssessment.mjs';
import { createRoleFitRevisionGuard } from '../src/utils/roleFitEnhancement.mjs';

const catalog = getRoleFitEvidenceCatalog();
const job = [
  'Role: Senior Java Software Engineer',
  'Required skills:',
  'Java and Spring Boot',
  'REST APIs and microservices',
  'React',
  'Angular',
  'Six years of Java experience',
  'Fulltime onsite four days a week',
].join('\n');

const assess = posting => {
  const text = normalizeRolePosting(posting);
  const requirements = parseRoleRequirements(text);
  return buildRoleFitAssessment({
    jobText: text, requirements,
    matches: matchRoleRequirements(requirements, catalog),
    evidenceCatalog: catalog,
  });
};

test('independent evidence report preserves direct, transferable, and unestablished categories', () => {
  const { sections, counts } = buildThreeSectionRoleFit(assess(job));
  assert.deepEqual(Object.keys(sections), ['direct', 'transferable', 'notEstablished']);
  assert.ok(counts.direct > 0 && counts.transferable > 0 && counts.notEstablished > 0);
  assert.ok(sections.direct.some(row => /\bREST APIs\b/.test(row.requirement.quote)));
  assert.ok(sections.notEstablished.some(row => /Java and Spring Boot/.test(row.requirement.quote)));
  assert.ok(!sections.direct.some(row => /\bJava\b/.test(row.requirement.quote)));
});

test('unconfirmed Java tenure and onsite logistics are never called direct evidence', () => {
  const { sections } = buildThreeSectionRoleFit(assess(job));
  const gaps = sections.notEstablished.map(row => row.requirement.quote).join('\n');
  assert.match(gaps, /Java and Spring Boot/);
  assert.match(gaps, /Six years of Java experience/);
  assert.match(gaps, /onsite/i);
});

test('Wissen Java/Spring requirements retain separate documented backend transferability', () => {
  const posting = [
    'Role: Senior Java Software Engineer',
    'Required skills:',
    'Experience with Java/J2EE, DB technologies.',
    'Experience with Java frameworks like Spring, Hibernate, Spring boot.',
    'Experience in building and consuming RESTful APIs and Microservices.',
  ].join('\n');
  const { sections } = buildThreeSectionRoleFit(assess(posting));
  assert.ok(sections.notEstablished.some(row => /Java\/J2EE/.test(row.requirement.quote)));
  assert.ok(sections.notEstablished.some(row => /frameworks like Spring/.test(row.requirement.quote)));
  assert.equal(sections.transferable.filter(row =>
    /frameworks like Spring/.test(row.relatedToQuote ?? '')).length, 1);
  assert.ok(!sections.direct.some(row => /Spring|Java/.test(row.requirement.quote)));
});

test('explicitly unnecessary Java is not presented as a missing qualification', () => {
  const { sections } = buildThreeSectionRoleFit(assess('Role: React Engineer\nNo Java required.\nReact is required.'));
  assert.ok(sections.direct.some(row => row.requirement.quote.includes('React')));
  assert.ok(!Object.values(sections).flat().some(row => row.requirement.quote === 'No Java required.'));
});

test('no-model and runtime-failure paths retain the independent evidence report', async () => {
  const gate = createRoleFitRevisionGuard();
  const revision = gate.bump();
  let baseline;
  const unavailable = await runRoleFitAnalyses({
    jobDescription: job, gate, revision, onMechanical: result => { baseline = result; },
  });
  assert.equal(unavailable.status, 'unavailable');
  assert.ok(baseline.details.length);
  const failure = await runRoleFitAnalyses({
    jobDescription: job, gate, revision, onMechanical: result => { baseline = result; },
    producer: async () => { throw new Error('GPU unavailable'); },
  });
  assert.equal(failure.status, 'failed');
  assert.ok(baseline.details.length);
});

test('model-authored Markdown does not borrow deterministic classification or change evidence', async () => {
  const gate = createRoleFitRevisionGuard();
  const revision = gate.bump();
  let mechanical;
  let generated;
  const result = await runRoleFitAnalyses({
    jobDescription: job, gate, revision,
    onMechanical: assessment => { mechanical = assessment; },
    producer: async ({ jobText }) => {
      assert.match(jobText, /Senior Java Software Engineer/);
      return { text: '## Directly demonstrated\n- The model claims Java knowledge, but this is unverified.\n## Transferable experience\n- Backend development.' };
    },
    onAI: parsed => { generated = parsed; },
  });
  assert.equal(result.status, 'ready');
  assert.equal(generated.kind, 'accepted');
  assert.match(generated.sections.direct[0], /unverified/);
  assert.ok(buildThreeSectionRoleFit(mechanical).sections.notEstablished.some(row =>
    /Java and Spring Boot/.test(row.requirement.quote)));
});

test('unstructured Markdown remains model-authored and does not become fabricated categories', async () => {
  const gate = createRoleFitRevisionGuard();
  const revision = gate.bump();
  const result = await runRoleFitAnalyses({
    jobDescription: job, gate, revision,
    producer: async () => ({ text: 'This is a model-generated unstructured observation.' }),
  });
  assert.equal(result.aiAssessment.kind, 'unstructured');
  assert.deepEqual(result.aiAssessment.sections.direct, []);
});

test('stale AI results cannot overwrite a newer job analysis', async () => {
  const gate = createRoleFitRevisionGuard();
  const revision = gate.bump();
  let finish;
  let called = false;
  const pending = runRoleFitAnalyses({
    jobDescription: job, gate, revision,
    producer: async () => new Promise(resolve => { finish = resolve; }),
    onAI: () => { called = true; },
  });
  gate.bump();
  finish({ text: '## Directly demonstrated\n- Old experience.' });
  assert.equal((await pending).status, 'stale');
  assert.equal(called, false);
});

test('recognizable runtime and input failures have safe error codes', () => {
  assert.deepEqual(
    classifyRoleFitAIError({ code: 'input_context_limit' }, 'input'),
    { stage: 'input', code: 'input_context_limit' },
  );
  assert.deepEqual(
    classifyRoleFitAIError(new Error('GPU out of memory'), 'generation'),
    { stage: 'generation', code: 'memory_limit' },
  );
  assert.deepEqual(
    classifyRoleFitAIError(new Error('Network failed for https://example.com/private'), 'load'),
    { stage: 'load', code: 'download_failed' },
  );
});

test('local runtime errors preserve nested details only in a bounded diagnostic string', () => {
  const root = new Error('Local worker generation failed');
  root.code = 'failure';
  const wrapper = { name: 'RoleFitStreamError', code: 'generation_failed',
    message: 'generation_failed', cause: root };
  const details = formatRoleFitAIErrorDetails(wrapper);
  assert.match(details, /Local worker generation failed/);
  assert.match(details, /Wrapped by: RoleFitStreamError/);
  assert.ok(details.length <= 8000);
  const circular = new Error('circular cause');
  circular.cause = circular;
  assert.ok(formatRoleFitAIErrorDetails(circular).length <= 8000);
});

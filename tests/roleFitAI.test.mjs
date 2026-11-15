import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildRoleFitAIRequest,
  interpretRoleFitAIResponse,
  runRoleFitAnalyses,
} from '../src/utils/roleFitAI.mjs';
import { getRoleFitEvidenceCatalog } from '../src/utils/roleFitEvidence.mjs';
import { createRoleFitRevisionGuard } from '../src/utils/roleFitEnhancement.mjs';

const catalog = getRoleFitEvidenceCatalog();
const job = 'Role: Senior Java Engineer\nJava is mandatory. React is required. Azure is a plus.';
const contextFrom = () => {
  let assessment;
  return {
    get assessment() { return assessment; },
    set assessment(value) { assessment = value; },
  };
};

const createContext = async () => {
  const state = contextFrom();
  const gate = createRoleFitRevisionGuard();
  const revision = gate.bump();
  const outcome = await runRoleFitAnalyses({
    jobDescription: job,
    evidenceCatalog: catalog,
    gate, revision,
    onMechanical: (assessment) => { state.assessment = assessment; },
  });
  assert.equal(outcome.status, 'unavailable');
  return { mechanicalAssessment: state.assessment, evidenceCatalog: catalog };
};

test('Analyze starts the model even if a mechanical assessment already exists', async () => {
  const events = [];
  const gate = createRoleFitRevisionGuard();
  const revision = gate.bump();
  const previousResult = { roleTitle: 'Previous role' };
  let fulfill;
  const pending = new Promise((resolve) => { fulfill = resolve; });
  const running = runRoleFitAnalyses({
    jobDescription: job, previousMechanicalAssessment: previousResult, evidenceCatalog: catalog,
    gate, revision,
    onMechanical: (assessment) => events.push(['mechanical', assessment]),
    producer: async (context) => { events.push(['model-started', context.mechanicalAssessment]); return pending; },
    onAI: (result) => events.push(['ai-ready', result]),
  });
  assert.deepEqual(events.map(([name]) => name), ['mechanical', 'model-started']);
  assert.notEqual(events[0][1], previousResult);
  assert.equal(events[0][1], events[1][1]);
  fulfill('A modest local model response.');
  assert.equal((await running).status, 'ready');
  assert.deepEqual(events.map(([name]) => name), ['mechanical', 'model-started', 'ai-ready']);
  assert.equal(events[2][1].kind, 'fallback');
  assert.equal(events[2][1].original, 'A modest local model response.');
});

test('model request supplies evidence and quote ids without private contact information', async () => {
  const context = await createContext();
  const request = buildRoleFitAIRequest({ jobText: job, ...context });
  const prompt = JSON.stringify(request);
  assert.match(prompt, /\\\"direct\\\"|\"direct\"/);
  assert.match(prompt, /transferable/);
  assert.match(prompt, /notEstablished|not_established/);
  assert.match(prompt, /React/);
  assert.match(prompt, /rest-apis|react/);
  assert.doesNotMatch(prompt, /marquisbenjamin23|514-625|@/);
  assert.ok(prompt.length <= 13000, `prompt too large: ${prompt.length}`);
});

test('AI can independently select direct, transferable and not-established requirements', async () => {
  const context = await createContext();
  const byKey = (key) => context.mechanicalAssessment.details.find((row) => row.requirement.options.some((opt) => opt.key === key));
  const react = byKey('react'); const azure = byKey('azure'); const java = byKey('java');
  assert.equal(react.status, 'direct');
  assert.equal(azure.status, 'transferable');
  assert.equal(java.status, 'not_documented');
  const result = interpretRoleFitAIResponse(JSON.stringify({
    directlyDemonstrated: [{ requirementId: react.requirementId, evidenceIds: ['react'], note: 'Documented React interface work.' }],
    transferableExperience: [{ requirementId: azure.requirementId, evidenceIds: ['aws'], note: 'Cloud providers differ.' }],
    notEstablished: [{ requirementId: java.requirementId, note: 'Professional Java has not been established.' }],
  }), context);
  assert.equal(result.kind, 'model_ranked');
  assert.equal(result.sections.direct.length, 1);
  assert.ok(result.sections.transferable.length >= 1);
  assert.ok(result.sections.notEstablished.length >= 1);
  assert.ok(result.sections.direct[0].requirementIds.includes(react.requirementId));
  assert.ok(result.sections.direct[0].sources.some((e) => e.id === 'react'));
  assert.ok(result.sections.transferable.some((x) => x.requirementIds.includes(azure.requirementId)));
  assert.ok(result.sections.notEstablished[0].requirementIds.includes(java.requirementId));
});

test('model cannot promote Java or forge evidence despite producing plausible JSON', async () => {
  const context = await createContext();
  const java = context.mechanicalAssessment.details.find((row) => row.requirement.options.some((x) => x.key === 'java'));
  const output = interpretRoleFitAIResponse(JSON.stringify({
    directlyDemonstrated: [{ requirementId: java.requirementId, evidenceIds: ['fake-java'], note: '10 years of Java experience.' }],
    transferableExperience: [],
    notEstablished: [],
  }), context);
  assert.equal(output.kind, 'fallback');
  assert.match(output.original, /10 years of Java/);
  assert.ok(!output.sections.direct.some(x => /Java(?!Script)/i.test(x.title)));
  assert.ok(output.sections.notEstablished.some(x => /Java/i.test(x.title)));
});

test('non-schema text falls back to source-grounded bullets rather than recruiter-facing unverified prose', async () => {
  const context = await createContext();
  const response = 'Directly demonstrated: React\nTransferable experience: AWS for Azure\nNot established: Java.';
  const result = interpretRoleFitAIResponse(response, context);
  assert.equal(result.kind, 'fallback');
  assert.equal(result.original, response);
  assert.ok(result.sections.direct.some(x => /React/i.test(x.title)));
  assert.ok(result.sections.transferable.some(x => /Azure/i.test(x.title)));
  assert.ok(result.sections.notEstablished.some(x => /Java/i.test(x.title)));
  assert.doesNotMatch(JSON.stringify(result.sections), /AWS for Azure|invented claim/i);
  assert.match(result.warning, /small model|verified/i);
});

test('late model results and errors cannot overwrite the most recent posting', async () => {
  const gate = createRoleFitRevisionGuard(); const revision = gate.bump();
  const events = [];
  let fulfill;
  const pending = new Promise((resolve) => { fulfill = resolve; });
  const run = runRoleFitAnalyses({
    jobDescription: job, evidenceCatalog: catalog, gate, revision,
    producer: () => pending,
    onMechanical: () => events.push('mechanical'),
    onAI: () => events.push('stale-ai'),
    onError: () => events.push('stale-error'),
  });
  assert.deepEqual(events, ['mechanical']);
  gate.bump();
  fulfill('Directly demonstrated: invented claim');
  assert.equal((await run).status, 'stale');
  assert.deepEqual(events, ['mechanical']);
});

test('a failed local model still leaves the independent mechanical result available', async () => {
  const gate = createRoleFitRevisionGuard(); const revision = gate.bump();
  const events = [];
  const result = await runRoleFitAnalyses({
    jobDescription: job, evidenceCatalog: catalog, gate, revision,
    producer: async () => { throw new Error('GPU unavailable'); },
    onMechanical: (assessment) => events.push(['mechanical', assessment]),
    onAI: () => events.push(['unexpected-ai']),
    onError: () => events.push(['error']),
  });
  assert.equal(result.status, 'failed');
  assert.deepEqual(events.map(([type]) => type), ['mechanical', 'error']);
  assert.ok(events[0][1].details.length > 0);
});

test('large postings remain bounded for a small local model without changing the mechanical result', async () => {
  const longPosting = Array.from({ length: 150 }, (_, i) => `Requirement ${i}: React, TypeScript, AWS and microservices experience; preferred Azure and Spring Boot.`).join('\n');
  const gate = createRoleFitRevisionGuard();
  const revision = gate.bump();
  let fullAssessment;
  await runRoleFitAnalyses({
    jobDescription: longPosting,
    evidenceCatalog: catalog, gate, revision,
    onMechanical: (assessment) => { fullAssessment = assessment; },
  });
  assert.ok(fullAssessment.coverageNote, 'long postings should disclose parser overflow');
  const request = buildRoleFitAIRequest({ jobText: longPosting, mechanicalAssessment: fullAssessment, evidenceCatalog: catalog });
  const prompt = JSON.stringify(request);
  assert.ok(prompt.length <= 12000, `local AI prompt exceeded 12k characters: ${prompt.length}`);
  assert.equal(fullAssessment.details.length, 60, 'mechanical inventory must retain its independent 60-row capacity');
});

test('a second Analyze cancels the older model and launches again without waiting', async () => {
  const gate = createRoleFitRevisionGuard();
  let completeOld;
  const slow = new Promise((resolve) => { completeOld = resolve; });
  const changes = [];
  const firstRevision = gate.bump();
  const first = runRoleFitAnalyses({
    jobDescription: job, evidenceCatalog: catalog, gate, revision: firstRevision,
    producer: () => slow,
    onMechanical: () => changes.push('first mechanical'),
    onAI: () => changes.push('first ai'),
  });
  const secondRevision = gate.bump();
  const second = runRoleFitAnalyses({
    jobDescription: job.replace('Senior Java', 'Senior TypeScript'), evidenceCatalog: catalog,
    gate, revision: secondRevision,
    producer: async () => 'Directly demonstrated: TypeScript.',
    onMechanical: () => changes.push('second mechanical'),
    onAI: () => changes.push('second ai'),
  });
  assert.equal((await second).status, 'ready');
  completeOld('Old model response');
  assert.equal((await first).status, 'stale');
  assert.deepEqual(changes, ['first mechanical', 'second mechanical', 'second ai']);
});

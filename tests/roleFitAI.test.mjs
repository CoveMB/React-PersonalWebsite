import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  buildRoleFitAIRequest,
  buildThreeSectionRoleFit,
  interpretRoleFitAIResponse,
  roleFitAIGenerationOptions,
  classifyRoleFitAIError,
  formatRoleFitAIErrorDetails,
  runRoleFitAnalyses,
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
const assess = (posting) => {
  const jobText = normalizeRolePosting(posting);
  const requirements = parseRoleRequirements(jobText);
  return buildRoleFitAssessment({
    jobText, requirements,
    matches: matchRoleRequirements(requirements, catalog),
    evidenceCatalog: catalog,
  });
};
const find = (assessment, pattern) =>
  assessment.details.find((row) => pattern.test(row.requirement.quote));
const modelItem = (row, note) => ({ id: row.requirementId, note });

test('recruiter view has precisely three evidence-status categories and preserves important gaps', () => {
  const assessment = assess(job);
  const { sections, counts } = buildThreeSectionRoleFit(assessment);
  assert.deepEqual(Object.keys(sections), ['direct', 'transferable', 'notEstablished']);
  assert.ok(counts.direct > 0);
  assert.ok(counts.transferable > 0);
  assert.ok(counts.notEstablished > 0);
  assert.ok(sections.direct.some((row) => /\bREST APIs\b/.test(row.requirement.quote)));
  assert.ok(sections.transferable.some((row) => row.requirement.quote === 'Angular'));
  assert.ok(sections.notEstablished.some((row) => /\bJava and Spring Boot\b/.test(row.requirement.quote)));
  const ids = Object.values(sections).flat().map((row) => row.requirementId);
  assert.equal(new Set(ids).size, ids.length, 'a requirement must not appear in more than one category');
});

test('unknown experience, tenure and onsite conditions are not presented as direct matches', () => {
  const { sections } = buildThreeSectionRoleFit(assess(job));
  const unresolved = sections.notEstablished.map((row) => row.requirement.quote).join('\n');
  assert.match(unresolved, /Java and Spring Boot/);
  assert.match(unresolved, /Six years of Java experience/);
  assert.match(unresolved, /onsite/);
  assert.ok(!sections.direct.some((row) => /\bJava\b/.test(row.requirement.quote)));
});

test('optional and excluded technologies are not promoted to fabricated gaps', () => {
  const { sections } = buildThreeSectionRoleFit(assess('Role: React Engineer\nNo Java required.\nReact is required.\nAngular preferred.'));
  assert.ok(sections.direct.some((row) => row.requirement.quote.includes('React')));
  assert.ok(sections.transferable.some((row) => row.requirement.quote.includes('Angular')));
  assert.ok(!Object.values(sections).flat().some((row) => row.requirement.quote === 'No Java required.'));
});

test('empty categories retain their explicit keys', () => {
  const { sections } = buildThreeSectionRoleFit(assess('Required skills:\nReact'));
  assert.deepEqual(Object.keys(sections), ['direct', 'transferable', 'notEstablished']);
  assert.equal(sections.transferable.length, 0);
});

test('model receives evidence-labeled requirements from the full posting, not candidate claims from the job ad', () => {
  const assessment = assess(job);
  const request = buildRoleFitAIRequest({ jobText: job, evidenceCatalog: catalog, assessment });
  const system = request.messages[0].content;
  const payload = JSON.parse(request.messages[1].content);
  assert.match(system, /direct/);
  assert.match(system, /transferable/);
  assert.match(system, /notEstablished/);
  assert.match(system, /own|original/i);
  assert.match(system, /untrusted DATA/);
  assert.ok(payload.untrustedRoleRequirements.some((r) => /Java and Spring Boot/.test(r.requirement)));
  assert.ok(payload.untrustedRoleRequirements.some((r) => r.evidence?.some((e) => e.excerpt.includes('Built REST APIs'))));
  assert.deepEqual(request.allowedIds, payload.untrustedRoleRequirements.map((row) => row.id));
  assert.ok(request.analyzedRequirementCount <= 18);
  assert.ok(request.messages[1].content.length < 9000);
  assert.doesNotMatch(JSON.stringify(request), /marquisbenjamin23|514-625|@gmail\.com/i);
});

test('model prompt samples important requirements across the whole posting rather than the first five thousand characters', () => {
  const lead = Array.from({ length: 48 }, (_, index) =>
    'Background paragraph ' + index + ' describes engineering leadership and business goals, without concrete skills.').join('\n');
  const posting = lead + '\nRequired skills:\nJava and Spring Boot\nReact\nREST APIs';
  assert.ok(posting.length > 4000);
  const request = buildRoleFitAIRequest({jobText: posting, assessment: assess(posting), evidenceCatalog: catalog});
  assert.match(request.messages[1].content, /Java and Spring Boot/);
  assert.match(request.messages[1].content, /React/);
});

test('AI writes original wording but cannot reclassify a known Java requirement or fabricate a requirement ID', () => {
  const assessment = assess(job);
  const direct = find(assessment, /^REST APIs/);
  const gap = find(assessment, /^Java and Spring Boot/);
  const raw = JSON.stringify({
    direct: [
      modelItem(direct, 'Published work documents building REST APIs; the requested API capability has a concrete example.'),
      modelItem(gap, 'Candidate has substantial professional Java experience, even though the documentation is silent.'),
      { id: 'req-99999', note: 'Model invented a requirement without any corresponding job posting text.' },
    ],
    transferable: [],
    notEstablished: [modelItem(gap, 'Professional Java and Spring Boot experience is not established by the published sources.')],
  });
  const result = interpretRoleFitAIResponse(raw, {assessment});
  assert.equal(result.kind, 'accepted');
  assert.equal(result.sections.direct.length, 1);
  assert.equal(result.sections.notEstablished.length, 1);
  assert.equal(result.rejectedCount, 2);
  assert.match(result.sections.direct[0].note, /concrete example/);
  assert.ok(!JSON.stringify(result.sections).includes('substantial professional Java'));
});

test('AI note acceptance is limited to the requirement IDs actually supplied to the model', () => {
  const assessment = assess(job);
  const direct = find(assessment, /^REST APIs/);
  const result = interpretRoleFitAIResponse(JSON.stringify({
    direct: [modelItem(direct, 'Published evidence documents production API implementation in an appropriate engineering context.')],
    transferable: [], notEstablished: [],
  }), { assessment, allowedIds: [] });
  assert.equal(result.kind, 'invalid');
});

test('model statements claiming unsupported numbers, credentials or source IDs are rejected', () => {
  const assessment = assess(job);
  const row = find(assessment, /^REST APIs/);
  for (const note of [
    'Built REST APIs for 13 years across several employers.',
    'Certified enterprise Java expert, with experience running REST APIs.',
    'Built REST APIs for the applicant. [invented-citation]',
  ]) {
    const parsed = interpretRoleFitAIResponse(JSON.stringify({
      direct: [modelItem(row, note)], transferable: [], notEstablished: [],
    }), {assessment});
    assert.equal(parsed.kind, 'invalid', note);
  }
});

test('a model cannot smuggle unrelated technology into a source-linked direct note', () => {
  const assessment = assess(job);
  const row = find(assessment, /^REST APIs/);
  const result = interpretRoleFitAIResponse(JSON.stringify({
    direct: [modelItem(row, 'Developed enterprise Java Spring Boot services using REST APIs for this employer.')],
    transferable: [], notEstablished: [],
  }), {assessment});
  assert.equal(result.kind, 'invalid');
});

test('a gap interpretation must explicitly acknowledge that evidence is missing', () => {
  const assessment = assess(job);
  const gap = find(assessment, /^Java and Spring Boot/);
  const misleading = interpretRoleFitAIResponse(JSON.stringify({
    direct: [], transferable: [],
    notEstablished: [modelItem(gap, 'The candidate has extensive Java and Spring Boot industry experience.')],
  }), { assessment });
  assert.equal(misleading.kind, 'invalid');

  const qualified = interpretRoleFitAIResponse(JSON.stringify({
    direct: [], transferable: [],
    notEstablished: [modelItem(gap, 'The published sources do not establish professional Java and Spring Boot experience.')],
  }), { assessment });
  assert.equal(qualified.kind, 'accepted');
});

test('model notes are supplementary, preserve source-backed categories and never overwrite evidence excerpts', () => {
  const assessment = assess(job);
  const direct = find(assessment, /^REST APIs/);
  const novel = 'Documented REST integration work directly addresses the requirement for HTTP service interfaces.';
  const parsed = interpretRoleFitAIResponse(JSON.stringify({
    direct: [modelItem(direct, novel)], transferable: [], notEstablished: [],
  }), {assessment});
  const report = buildThreeSectionRoleFit(assessment, parsed);
  const row = report.sections.direct.find((r) => r.requirementId === direct.requirementId);
  assert.equal(row.modelNote, novel);
  assert.deepEqual(row.evidence.map((item) => item.id), direct.evidence.map((item) => item.id));
  assert.ok(report.sections.notEstablished.some((r) => /Java and Spring Boot/.test(r.requirement.quote)));
});

test('duplicate cross-category outputs, bad JSON, and extra-text responses cannot create fabricated AI conclusions', () => {
  const assessment = assess(job);
  const direct = find(assessment, /^REST APIs/);
  const note = 'Documented REST API work establishes related interface and integration experience.';
  const parsed = interpretRoleFitAIResponse(JSON.stringify({
    direct: [modelItem(direct, note), modelItem(direct, note)],
    transferable: [modelItem(direct, note)],
    notEstablished: [],
  }), {assessment});
  assert.equal(parsed.kind, 'accepted');
  assert.equal(parsed.selectedCount, 1);
  assert.ok(parsed.rejectedCount >= 2);
  assert.equal(interpretRoleFitAIResponse('not structured as JSON', {assessment}).kind, 'invalid');
  assert.equal(interpretRoleFitAIResponse('', {assessment}).kind, 'empty');
  assert.equal(interpretRoleFitAIResponse('{"direct":[]}', {assessment}).kind, 'invalid');
  assert.equal(interpretRoleFitAIResponse('<img src=x onerror=alert(1)>', {assessment}).kind, 'invalid');
});

test('AI response can include legitimate empty category arrays without inventing filler claims', () => {
  const assessment = assess('Required skills:\nReact');
  const row = find(assessment, /React/);
  const parsed = interpretRoleFitAIResponse(JSON.stringify({
    direct: [modelItem(row, 'Published React interface development demonstrates the requested frontend framework experience.')],
    transferable: [], notEstablished: [],
  }), {assessment});
  assert.equal(parsed.kind, 'accepted');
  assert.equal(parsed.sections.transferable.length, 0);
  assert.equal(buildThreeSectionRoleFit(assessment, parsed).sections.notEstablished.length, 0);
});

test('no-model and failed-model flows still deliver the evidence-backed comparison', async () => {
  const gate = createRoleFitRevisionGuard();
  const revision = gate.bump();
  let baseline;
  const absent = await runRoleFitAnalyses({
    jobDescription: job, gate, revision, onMechanical: (result) => { baseline = result; },
  });
  assert.equal(absent.status, 'unavailable');
  assert.ok(baseline.details.length);
  const failing = await runRoleFitAnalyses({
    jobDescription: job, gate, revision, onMechanical: (result) => { baseline = result; },
    producer: async () => { throw new Error('GPU unavailable'); },
  });
  assert.equal(failing.status, 'failed');
  assert.ok(baseline.details.length);
});

test('completed local AI notes belong to the current revision only', async () => {
  const gate = createRoleFitRevisionGuard();
  const revision = gate.bump();
  let finish;
  let called = false;
  const pending = runRoleFitAnalyses({
    jobDescription: job, gate, revision,
    producer: async () => new Promise((resolve) => { finish = resolve; }),
    onAI: () => { called = true; },
  });
  gate.bump();
  finish(JSON.stringify({ direct: [], transferable: [], notEstablished: [] }));
  assert.equal((await pending).status, 'stale');
  assert.equal(called, false);
});

test('small-model generation is bounded and lower-variance than the prior prose generation', () => {
  assert.ok(roleFitAIGenerationOptions.max_tokens >= 500 && roleFitAIGenerationOptions.max_tokens <= 750);
  assert.ok(roleFitAIGenerationOptions.temperature <= 0.3);
  assert.ok(roleFitAIGenerationOptions.repetition_penalty >= 1);
  const hook = readFileSync(new URL('../src/components/ai/useRoleFitLab.js', import.meta.url), 'utf8');
  assert.match(hook, /roleFitAIGenerationOptions/);
  assert.match(hook, /allowedIds: request.allowedIds/);
  assert.doesNotMatch(hook, /localStorage|sessionStorage|fetch\s*\(/);
});

test('WebLLM requests JSON object output rather than relying solely on prompt instructions', () => {
  assert.deepEqual(roleFitAIGenerationOptions.response_format, { type: 'json_object' });
});

test('malformed model output and zero usable claims have different safe failure codes', () => {
  const assessment = assess(job);
  assert.equal(interpretRoleFitAIResponse('not valid JSON', { assessment }).failureCode, 'invalid_json');
  assert.equal(interpretRoleFitAIResponse('{"direct":[]}', { assessment }).failureCode, 'invalid_schema');
  assert.equal(interpretRoleFitAIResponse('{"direct":[],"transferable":[],"notEstablished":[]}', { assessment }).failureCode, 'no_notes_generated');
  assert.equal(interpretRoleFitAIResponse('', { assessment }).failureCode, 'empty_response');
  assert.equal(interpretRoleFitAIResponse('{"direct":[{"id":"req-999","note":"Model fabricated a made-up candidate claim here."}],"transferable":[],"notEstablished":[]}', { assessment }).failureCode, 'no_valid_notes');
  assert.equal(interpretRoleFitAIResponse('{"direct":', { assessment, outputLimitReached: true }).failureCode, 'generation_limit');
});

test('runtime failure classification distinguishes loading and generation, without revealing raw errors', async () => {
  const load = classifyRoleFitAIError({ message: 'Network failed https://example.com/private?job=Java' }, 'load');
  const memory = classifyRoleFitAIError(new Error('GPU out of memory for private job posting'), 'generation');
  assert.deepEqual(load, { stage: 'load', code: 'download_failed' });
  assert.deepEqual(memory, { stage: 'generation', code: 'memory_limit' });
  assert.doesNotMatch(JSON.stringify([load, memory]), /private|job=|example\.com/);
});

test('Wissen-style compound Java/Spring gap preserves the missing Java stack while showing related backend experience as transferable', () => {
  const assessment = assess('Role: Senior Java Software Engineer\nRequired skills:\nJava and Spring Boot\nREST APIs and microservices');
  const { sections } = buildThreeSectionRoleFit(assessment);
  const gap = sections.notEstablished.find(row => /Java and Spring Boot/.test(row.requirement.quote));
  assert.ok(gap, 'the overall Java/Spring requirement is not established');
  assert.ok(sections.transferable.some(row =>
    row.relatedToRequirementId === gap.requirementId &&
    row.evidence.some(source => source.capabilities.some(key => ['nodejs', 'koa', 'express'].includes(key)))
  ), 'related backend implementation belongs in Transferable experience, without asserting Java work');
  assert.ok(!sections.direct.some(row => /\bJava\b/.test(row.requirement.quote)));
});

test('alternative or ambiguous lists do not create duplicate related-experience items', () => {
  const both = assess('React or Vue\nJava/J2EE\nJava and Spring Boot');
  const { sections } = buildThreeSectionRoleFit(both);
  assert.ok(sections.direct.some(row => /React or Vue/.test(row.requirement.quote)));
  assert.ok(!sections.transferable.some(row => /React or Vue|Java\/J2EE/.test(row.relatedToQuote ?? '')));
  const ids = Object.values(sections).flat().map(row => row.requirementId);
  assert.equal(new Set(ids).size, ids.length);
});

test('Wissen framework example list shows relevant Node.js backend transfer while retaining unverified Java-family requirements', () => {
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
    /frameworks like Spring/.test(row.relatedToQuote ?? '')).length, 1,
    'overlapping Spring and Spring Boot transfer sources should not be repeated');
  assert.ok(sections.transferable.some(row =>
    /frameworks like Spring/.test(row.relatedToQuote ?? '') &&
    row.evidence.some(source => source.capabilities.some(key => ['koa', 'express', 'nodejs'].includes(key)))
  ), 'backend framework equivalence is not assumed; concrete related work is still visible');
});

test('rejected non-JSON answer remains inspectable with a specific cause', () => {
  const raw = '### Directly demonstrated\n- Claimed professional Java without supporting evidence';
  const result = interpretRoleFitAIResponse(raw, { assessment: assess(job) });
  assert.equal(result.kind, 'invalid');
  assert.equal(result.failureCode, 'invalid_json');
  assert.equal(result.rawModelOutput, raw);
  assert.equal(result.rawModelOutputTruncated, false);
  assert.ok(result.rejectionReasons.includes('invalid_json'));
});

test('partial rejection preserves full original output and each rejected item reason', () => {
  const assessment = assess(job);
  const direct = find(assessment, /^REST APIs/);
  const gap = find(assessment, /^Java and Spring Boot/);
  const raw = JSON.stringify({
    direct: [
      modelItem(direct, 'Published REST API and microservice experience is documented in the public résumé.'),
      modelItem(gap, 'The candidate is a certified Java professional with twenty years of experience.'),
      { id: 'invented-id', note: 'The candidate has proven Kotlin backend development experience.' },
    ],
    transferable: [],
    notEstablished: [],
  });
  const result = interpretRoleFitAIResponse(raw, { assessment, allowedIds: [direct.requirementId, gap.requirementId] });
  assert.equal(result.kind, 'accepted');
  assert.equal(result.selectedCount, 1);
  assert.equal(result.rawModelOutput, raw);
  assert.equal(result.rejectedItems.length, 2);
  assert.ok(result.rejectedItems.find(x => x.id === gap.requirementId).reasons.includes('category_mismatch'));
  assert.ok(result.rejectedItems.find(x => x.id === 'invented-id').reasons.includes('unknown_requirement'));
  assert.ok(result.rejectedItems.every(x => x.note.length <= 245));
});

test('a note using an unsupported technology or missing evidence is rejected with a human-readable reason code', () => {
  const assessment = assess(job);
  const direct = find(assessment, /^REST APIs/);
  const raw = JSON.stringify({
    direct: [modelItem(direct, 'Built professional Java Spring Boot services with REST APIs, beyond the evidence.')],
    transferable: [],
    notEstablished: [],
  });
  const result = interpretRoleFitAIResponse(raw, { assessment });
  assert.equal(result.kind, 'invalid');
  assert.ok(result.rejectedItems[0].reasons.includes('unsupported_technology'));
  assert.equal(result.rawModelOutput, raw);
});

test('invalid JSON schema and bounded large replies are inspectable but cannot become accepted claims', () => {
  const assessment = assess(job);
  const wrong = '{"direct":[],"transferable":[]}';
  const missing = interpretRoleFitAIResponse(wrong, { assessment });
  assert.equal(missing.failureCode, 'invalid_schema');
  assert.equal(missing.rawModelOutput, wrong);
  const huge = 'a'.repeat(9000);
  const bounded = interpretRoleFitAIResponse(huge, { assessment });
  assert.equal(bounded.failureCode, 'response_too_long');
  assert.equal(bounded.rawModelOutput.length, 8000);
  assert.equal(bounded.rawModelOutputTruncated, true);
});

test('empty or failed inference never fabricates a rejected model answer', () => {
  const result = interpretRoleFitAIResponse('', { assessment: assess(job) });
  assert.equal(result.kind, 'empty');
  assert.equal(result.rawModelOutput, '');
  assert.deepEqual(result.rejectedItems, []);
});


test('streamed generation and post-load handshake timeouts have safe, distinct diagnostic codes', () => {
  for (const code of ['stream_startup_timeout', 'first_token_timeout', 'generation_stalled',
    'generation_timeout', 'model_ready_timeout', 'invalid_stream']) {
    const stage = code === 'model_ready_timeout' ? 'load' : 'generation';
    const classified = classifyRoleFitAIError({ code }, stage);
    assert.deepEqual(classified, { code, stage }, code);
  }
  const wrapper = { code: 'generation_failed', cause: new Error('GPU out of memory while generating') };
  assert.deepEqual(classifyRoleFitAIError(wrapper, 'generation'), { stage: 'generation', code: 'memory_limit' });
  assert.equal(classifyRoleFitAIError({ code: 'unexpected_foo' }, 'generation').code, 'generation_failed');
});

test('AI failure diagnostics preserve the original nested runtime message and stack', () => {
  const underlying = new Error('WebLLM GPU validation failed during JSON generation');
  underlying.name = 'GPUValidationError';
  underlying.code = 'gpu_validation';
  const wrapper = { name: 'RoleFitStreamError', code: 'generation_failed',
    message: 'generation_failed', cause: underlying };
  const details = formatRoleFitAIErrorDetails(wrapper);
  assert.match(details, /Underlying exception: GPUValidationError \\[gpu_validation\\]/);
  assert.match(details, /WebLLM GPU validation failed during JSON generation/);
  assert.match(details, /Stack:/);
  assert.match(details, /Wrapped by: RoleFitStreamError \\[generation_failed\\]/);
  assert.ok(details.indexOf('GPUValidationError') < details.indexOf('RoleFitStreamError'));
  assert.ok(details.length <= 8000);
});

test('AI failure diagnostics handle strings, cyclic causes and oversized errors safely', () => {
  assert.match(formatRoleFitAIErrorDetails('Worker generation crashed'), /Worker generation crashed/);
  const circular = new Error('repeated cause');
  circular.cause = circular;
  assert.equal(formatRoleFitAIErrorDetails(circular).match(/repeated cause/g)?.length >= 1, true);
  const oversized = new Error('z'.repeat(16000));
  assert.ok(formatRoleFitAIErrorDetails(oversized).length <= 8000);
  assert.equal(formatRoleFitAIErrorDetails(null), '');
});

test('AI prompt is prefill-bounded for local model while preserving all three categories', () => {
  const input = [
    'Role: Senior Java Software Engineer',
    'Required skills:',
    'Java and Spring Boot',
    'REST APIs and microservices',
    'React',
    'Angular',
    'Azure',
    'Python',
    'AWS Lambda',
    'Cypress',
    'SQL',
    'Docker',
    'Kafka',
    'Kubernetes',
    'CI/CD',
  ].join('\n');
  const assessment = assess(input);
  const request = buildRoleFitAIRequest({ jobText: input, assessment, evidenceCatalog: catalog });
  const included = JSON.parse(request.messages[1].content).untrustedRoleRequirements;
  const counts = included.reduce((acc, row) => ({ ...acc, [row.category]: (acc[row.category] ?? 0) + 1 }), {});
  assert.ok(included.length <= 9, 'only a few candidate requirements are needed for two notes per category');
  assert.ok(counts.direct > 0 && counts.notEstablished > 0, 'preserve strengths and key gaps');
  assert.ok(Object.values(counts).every(count => count <= 3));
  assert.ok(included.every(row => row.evidence.length <= 2));
  assert.ok(included.every(row => row.evidence.every(source => source.excerpt.length <= 115)));
  assert.ok(request.messages[1].content.length < 4800, 'shorter prompt to reduce GPU prefill');
  assert.ok(request.totalRequirementCount >= request.analyzedRequirementCount);
});

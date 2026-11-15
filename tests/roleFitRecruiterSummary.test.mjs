import assert from 'node:assert/strict';
import test from 'node:test';
import { getRoleFitEvidenceCatalog } from '../src/utils/roleFitEvidence.mjs';
import { normalizeRolePosting, parseRoleRequirements } from '../src/utils/roleFitRequirements.mjs';
import { matchRoleRequirements } from '../src/utils/roleFitMatching.mjs';
import { buildRoleFitAssessment } from '../src/utils/roleFitAssessment.mjs';
import { buildRoleFitRecruiterSummary } from '../src/utils/roleFitRecruiterSummary.mjs';
import { buildRoleFitAIRequest, interpretRoleFitAIResponse } from '../src/utils/roleFitAI.mjs';

const catalog = getRoleFitEvidenceCatalog();
const wissen = `About the job
Role: Senior Java Software Engineer
Required skills:
Experience with Java/J2EE, DB technologies.
Experience with Java frameworks like Spring, Hibernate, Spring boot.
Experience with front-end technologies: HTML5, CSS3, JavaScript, and modern frameworks/libraries such as Angular, React, or Vue.js. - Good to have
Experience in building and consuming RESTful APIs and Microservices.
Familiarity with version control systems (Git), CI/CD pipelines, and Agile development methodologies.
Fulltime onsite 3-4 days per week.`;
const contextFor = (text) => {
  const jobText = normalizeRolePosting(text);
  const requirements = parseRoleRequirements(jobText);
  const mechanicalAssessment = buildRoleFitAssessment({
    jobText, requirements,
    matches: matchRoleRequirements(requirements, catalog),
    evidenceCatalog: catalog,
  });
  return { jobText, mechanicalAssessment, evidenceCatalog: catalog };
};
const allItems = (report) => Object.values(report.sections).flat();

// The new test first fails at the missing summary module; it must stay failed
// until the recruiter-facing, source-checked formatter is implemented.
test('Java recruiter summary leads with documented REST, microservices, Agile and React work', () => {
  const report = buildRoleFitRecruiterSummary(contextFor(wissen).mechanicalAssessment);
  const direct = report.sections.direct;
  assert.ok(direct.length >= 3, `direct examples: ${direct.map(x => x.title)}`);
  assert.ok(direct.some(x => /REST APIs/i.test(x.title) && /microservices/i.test(x.title)));
  assert.ok(direct.some(x => /Agile|CI\/CD|Scrum/i.test(x.title)));
  assert.ok(direct.some(x => /React/i.test(x.title)));
  assert.ok(direct.every(x => x.sources.length && x.summary && !/No source-checked/.test(x.summary)));
  const restAndMicro = direct.find(x => /REST APIs/i.test(x.title) && /microservices/i.test(x.title));
  assert.ok(restAndMicro.sources.some(x => x.id === 'rest-apis'));
  assert.ok(restAndMicro.sources.some(x => x.id === 'microservices' || x.id === 'svelte'));
});

test('Java gap stays material while Node.js and Koa are shown as transferable, not direct Java', () => {
  const report = buildRoleFitRecruiterSummary(contextFor(wissen).mechanicalAssessment);
  const transferable = report.sections.transferable;
  assert.ok(transferable.some(x => /Node\.js|Koa/i.test(x.title + ' ' + x.summary)), JSON.stringify(transferable));
  assert.ok(transferable.some(x => /Java/i.test(x.title + ' ' + x.summary)));
  assert.ok(transferable.every(x => x.sources.every(s => s.id !== 'owner-no-professional-java')));
  const gaps = report.sections.notEstablished;
  assert.ok(gaps.some(x => /Java/i.test(x.title) && /Spring|J2EE/i.test(x.title + ' ' + x.summary)), JSON.stringify(gaps));
  assert.ok(!report.sections.direct.some(x => /Java(?!Script)/i.test(x.title)));
  assert.ok(gaps.some(x => /Java/i.test(x.title) && /no professional Java|owner.confirmed/i.test(x.summary)), JSON.stringify(gaps));
});

test('candidate positives have eligible exact sources and model cannot introduce unsourced claims', () => {
  const report = buildRoleFitRecruiterSummary(contextFor(wissen).mechanicalAssessment);
  const allowed = new Map(catalog.map(x => [x.id, x]));
  for (const item of [...report.sections.direct, ...report.sections.transferable]) {
    assert.ok(item.sources.length > 0, item.title);
    for (const source of item.sources) {
      assert.equal(source.sourceQuote, allowed.get(source.id)?.sourceQuote);
      assert.ok(source.sourceUrl?.startsWith('/'));
    }
    assert.doesNotMatch(item.title + item.summary, /10 years of Java|strong Java background|I worked in Spring/i);
  }
  assert.ok(allItems(report).length <= 11, 'recruiter report should be bounded');
});

test('React OR Vue can display React direct; React AND Vue never claims the conjunction is direct', () => {
  const orReport = buildRoleFitRecruiterSummary(contextFor('Role: Frontend Engineer\nExperience with React or Vue is required.').mechanicalAssessment);
  assert.ok(orReport.sections.direct.some(x => /React/i.test(x.title)));
  assert.ok(!orReport.sections.direct.some(x => /Vue/i.test(x.title)));
  const andReport = buildRoleFitRecruiterSummary(contextFor('Role: Frontend Engineer\nExperience with React and Vue is required.').mechanicalAssessment);
  assert.ok(!andReport.sections.direct.some(x => /React.*Vue|Vue.*React/i.test(x.title)));
  assert.ok(andReport.sections.notEstablished.some(x => /Vue|React/i.test(x.title)));
});

test('vague postings are not falsely presented as validated strengths', () => {
  const report = buildRoleFitRecruiterSummary(contextFor('Role: Wonderful teammate\nBring curiosity and good vibes.').mechanicalAssessment);
  assert.deepEqual(report.sections.direct, []);
  assert.deepEqual(report.sections.transferable, []);
  assert.deepEqual(report.sections.notEstablished, []);
});

test('model request asks for ranking choices only and stays bounded without personal contact details', () => {
  const context = contextFor(wissen);
  const request = buildRoleFitAIRequest(context);
  const json = JSON.stringify(request);
  assert.match(json, /\"direct\"|\\\"direct\\\"/);
  assert.match(json, /requirementId|choiceId/);
  assert.doesNotMatch(json, /@|514-625|marquisbenjamin23/);
  assert.ok(json.length < 6500, `Small model prompt too long: ${json.length}`);
  assert.doesNotMatch(json, /"note":"short interpretation"/);
});

test('the posted invalid fenced JSON becomes a useful recruiter summary, not empty categories or raw content', () => {
  const context = contextFor(wissen);
  const response = `\`\`\`json\n{ "directlyDemonstrated": [{ "requirementId": "req-999", "evidenceIds": ["rest-apis"], "note": "10 years of professional Java" }], "transferableExperience": [], "notEstablished": [] }\n\`\`\``;
  const result = interpretRoleFitAIResponse(response, context);
  assert.equal(result.kind, 'fallback');
  assert.ok(result.sections.direct.some(x => /REST APIs/i.test(x.title)));
  assert.ok(result.sections.notEstablished.some(x => /Java/i.test(x.title)));
  assert.doesNotMatch(JSON.stringify(result.sections), /10 years of professional Java|req-999/);
  assert.ok(result.original?.includes('```json'), 'raw text retained only for optional diagnostics');
});

test('model choices may prioritize valid evidence but cannot promote Java, remove gaps or surface model prose', () => {
  const context = contextFor(wissen);
  const rows = context.mechanicalAssessment.details;
  const rest = rows.find(x => x.requirement.options.some(o => o.key === 'rest'));
  const java = rows.find(x => x.requirement.options.some(o => o.key === 'java'));
  const result = interpretRoleFitAIResponse(JSON.stringify({
    direct: [java.requirementId, rest.requirementId],
    transferable: [java.requirementId],
    notEstablished: [],
    note: 'I have 10 years of Java experience and Spring Boot expertise.',
  }), context);
  assert.equal(result.kind, 'model_ranked');
  assert.ok(result.sections.direct.some(x => x.requirementIds.includes(rest.requirementId)));
  assert.ok(!result.sections.direct.some(x => x.requirementIds.includes(java.requirementId)));
  assert.ok(result.sections.notEstablished.some(x => /Java/i.test(x.title)));
  assert.doesNotMatch(JSON.stringify(result.sections), /10 years of Java/);
});

test('legacy object-schema and markdown-wrapped choices validate per ID rather than require every model-provided evidence ID', () => {
  const context = contextFor(wissen);
  const rest = context.mechanicalAssessment.details.find(x => x.requirement.options.some(o => o.key === 'rest'));
  const result = interpretRoleFitAIResponse(`\`\`\`json\n${JSON.stringify({
    directlyDemonstrated: [{ requirementId: rest.requirementId, evidenceIds: ['rest-apis', 'invalid', ...Array(20).fill('react')], note: 'Invented impossible claim' }],
    transferableExperience: [], notEstablished: [],
  })}\n\`\`\``, context);
  assert.equal(result.kind, 'model_ranked');
  assert.ok(result.sections.direct.some(x => x.requirementIds.includes(rest.requirementId)));
  assert.doesNotMatch(JSON.stringify(result.sections), /Invented impossible/);
});

test('malformed or absent AI results still show a grounded concise assessment, not a JSON wall', () => {
  const context = contextFor(wissen);
  for (const response of ['{ "direct": [', 'plain text pretending to be a candidate', '', 'x'.repeat(9000)]) {
    const result = interpretRoleFitAIResponse(response, context);
    assert.equal(result.kind, 'fallback');
    assert.ok(result.sections.direct.length > 0);
    assert.ok(result.sections.notEstablished.length > 0);
    assert.ok(allItems(result).length < 12);
  }
});


test('repeated Java stack clauses form one concise transferable context, not two duplicate bullets', () => {
  const report = buildRoleFitRecruiterSummary(contextFor(wissen).mechanicalAssessment);
  const related = report.sections.transferable.filter(x => /Java/i.test(x.title));
  assert.equal(related.length, 1, JSON.stringify(related.map(x => x.title)));
  assert.ok(related[0].requirementIds.length >= 2);
});

test('the exact failed-style small-model response produces readable Java-role claims rather than a JSON wall', () => {
  const context = contextFor(wissen);
  const original = `\`\`\`json {
  "directlyDemonstrated": [
    {"requirementId":"req-4","evidenceIds":["rest-apis"],"note":"Built REST APIs and real-time services."},
    {"requirementId":"req-5","evidenceIds":[],"note":"Experience with Java/J2EE, DB technologies."},
    {"requirementId":"req-6","evidenceIds":["microservices","react","node-backend","cicd","docker-terraform","svelte","agile","product","git","cominity-infra","tooly-graphql","typescript","aws"]}
  ],
  "transferableExperience":[{"requirementId":"req-10","evidenceIds":["rest-apis"],"note":"Experience in building REST APIs and microservices."}],
  "notEstablished": []
} \`\`\``;
  const result = interpretRoleFitAIResponse(original, context);
  assert.ok(['fallback', 'model_ranked'].includes(result.kind));
  assert.ok(result.sections.direct.some(x => /REST APIs.*microservices/i.test(x.title)));
  assert.ok(result.sections.direct.some(x => /Agile|CI\/CD/i.test(x.title)));
  assert.ok(result.sections.notEstablished.some(x => /Java.*Spring/i.test(x.title)));
  assert.doesNotMatch(JSON.stringify(result.sections), /req-10|12 years|No source-checked/);
});

test('role exclusions and model fallback never manufacture a Java deficit', () => {
  const context = contextFor('Role: Frontend Engineer\nNo Java required. React experience is essential.');
  const result = interpretRoleFitAIResponse('', context);
  assert.ok(result.sections.direct.some(x => /React/.test(x.title)));
  assert.ok(!result.sections.notEstablished.some(x => /Java/.test(x.title)));
});

test('a model can reorder equally required documented capabilities without changing their trust status', () => {
  const context = contextFor('Role: Full-stack engineer\nExperience with React is required.\nREST APIs are required.');
  const summary = buildRoleFitRecruiterSummary(context.mechanicalAssessment);
  const react = summary.sections.direct.find(x => /React/.test(x.title));
  const rest = summary.sections.direct.find(x => /REST APIs/.test(x.title));
  assert.ok(react && rest);
  const ranked = interpretRoleFitAIResponse(JSON.stringify({
    direct: [rest.id, react.id], transferable: [], notEstablished: [],
  }), context);
  assert.equal(ranked.kind, 'model_ranked');
  assert.equal(ranked.sections.direct[0].id, rest.id);
  assert.equal(ranked.sections.direct[1].id, react.id);
});

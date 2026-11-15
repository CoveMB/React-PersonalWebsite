import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { buildRoleFitAIRequest, interpretRoleFitAIResponse, runRoleFitAnalyses } from '../src/utils/roleFitAI.mjs';
import { getRoleFitEvidenceCatalog } from '../src/utils/roleFitEvidence.mjs';
import { createRoleFitRevisionGuard } from '../src/utils/roleFitEnhancement.mjs';

const evidenceCatalog = getRoleFitEvidenceCatalog();
const javaRole = 'Role: Senior Java Software Engineer\nRequires Java, J2EE, Spring Boot, Hibernate, REST APIs, microservices, React and Scrum. Very specifically Rocket Tangerine 723.';

const makeGate = () => {
  const gate = createRoleFitRevisionGuard();
  return { gate, revision: gate.bump() };
};

test('the AI prompt requires original model-written statements under the three requested category headings', () => {
  const request = buildRoleFitAIRequest({ jobText: javaRole, evidenceCatalog });
  const system = request.messages.find(({ role }) => role === 'system')?.content ?? '';
  const user = request.messages.find(({ role }) => role === 'user')?.content ?? '';
  assert.match(system, /Directly demonstrated/);
  assert.match(system, /Transferable experience/);
  assert.match(system, /Not established/);
  assert.match(system, /write|author|compose/i);
  assert.doesNotMatch(system, /Return JSON ONLY|select.*IDs|reorder.*IDs|preclassified/i);
  assert.match(user, /Rocket Tangerine 723/);
  assert.match(user, /Built REST APIs and real-time WebSocket services/);
  assert.match(user, /Developed end-to-end projects using microservices/);
  assert.match(user, /no professional Java/i);
  assert.doesNotMatch(JSON.stringify(request), /verifiedCategoryChoices|mechanicalAssessment|modelRanking|precomputedMatches|classificationResults/);
  assert.doesNotMatch(JSON.stringify(request), /514-625|marquisbenjamin23|\b@\b/);
});

test('a generated novel statement is preserved, not replaced by mechanical templates', () => {
  const actual = '### Directly demonstrated\n- Built on-device octopus telemetry with REST APIs.\n### Transferable experience\n- Node.js may help with Java work, but the stack differs.\n### Not established\n- Java/J2EE and Hibernate are not established.';
  const result = interpretRoleFitAIResponse(actual);
  assert.equal(result.kind, 'generated');
  assert.equal(result.text, actual);
  assert.doesNotMatch(result.text, /Built REST APIs and real-time WebSocket services for a multi-service platform/);
  assert.equal('sections' in result, false);
});

test('old JSON note fields are formatted using only model-produced wording, without inferred evidence', () => {
  const original = '```json\n' + JSON.stringify({
    directlyDemonstrated: [{ requirementId: 'req-999', evidenceIds: ['fake'], note: 'AI wrote exactly the Zinnia River API sentence.' }],
    transferableExperience: [{ statement: 'AI wrote a different technical-stack comparison.' }],
    notEstablished: [{ note: 'No published Java employment evidence was identified.' }],
  }) + '\n```';
  const result = interpretRoleFitAIResponse(original);
  assert.equal(result.kind, 'generated');
  assert.match(result.text, /AI wrote exactly the Zinnia River API sentence/);
  assert.match(result.text, /AI wrote a different technical-stack comparison/);
  assert.match(result.text, /No published Java employment evidence was identified/);
  assert.doesNotMatch(result.text, /req-999|fake|source-backed|Published sources/);
  assert.equal(result.original, original);
});

test('JSON-only IDs do not become fabricated prose or deterministic category claims', () => {
  const result = interpretRoleFitAIResponse(JSON.stringify({
    direct: ['req-1', 'req-5'], transferable: [], notEstablished: [],
  }));
  assert.equal(result.kind, 'unstructured');
  assert.equal(result.text, '');
  assert.ok(result.original.includes('req-5'));
  assert.equal('sections' in result, false);
});

test('invalid JSON and no text show transparent model status, not deterministic fallback', () => {
  assert.equal(interpretRoleFitAIResponse('').kind, 'empty');
  const invalid = interpretRoleFitAIResponse('```json\n{"direct": [\n```');
  assert.equal(invalid.kind, 'unstructured');
  assert.equal(invalid.text, '');
  assert.match(invalid.original, /direct/);
  assert.equal('sections' in invalid, false);
});

test('plaintext and HTML-looking model output are preserved as inert data', () => {
  const output = '<img src=x onerror=alert(1)>\n### Directly demonstrated\n- A unique self-produced account.';
  const result = interpretRoleFitAIResponse(output);
  assert.equal(result.kind, 'generated');
  assert.equal(result.text, output);
});

test('the AI prompt is bounded and discloses when the posting was clipped, without limiting mechanical report', async () => {
  const text = Array.from({ length: 170 }, (_, n) => `Section ${n} calls for React, TypeScript and AWS; or Java and Spring with Kubernetes.`).join('\n');
  const request = buildRoleFitAIRequest({ jobText: text, evidenceCatalog });
  assert.ok(JSON.stringify(request).length <= 11000, `prompt bytes: ${JSON.stringify(request).length}`);
  assert.equal(request.postingTruncated, true);
  assert.ok(request.messages[1].content.includes('Section 0'));
  const {gate,revision} = makeGate();
  let mechanical;
  const outcome = await runRoleFitAnalyses({ jobDescription:text, gate,revision,evidenceCatalog, onMechanical: result => mechanical=result });
  assert.equal(outcome.status,'unavailable');
  assert.equal(mechanical.details.length,60);
  assert.equal(interpretRoleFitAIResponse('### Not established\n- X', {jobText:text}).postingTruncated, true);
});

test('the AI path never receives the mechanical assessment for evaluation or prompting', async () => {
  const { gate, revision } = makeGate();
  const calls=[];
  let complete;
  const delayed = new Promise(resolve => { complete = resolve; });
  const oldMechanical = { roleTitle:'Wrong previously analyzed job' };
  const promise = runRoleFitAnalyses({jobDescription:javaRole,gate,revision,evidenceCatalog,
    previousMechanicalAssessment:oldMechanical,
    onMechanical: result=>calls.push(['mechanical',result]),
    producer: async context => { calls.push(['model-request',context]); return delayed; },
    onAI: result=>calls.push(['model-ready',result]),
  });
  assert.deepEqual(calls.map(x=>x[0]), ['mechanical','model-request']);
  assert.equal('mechanicalAssessment' in calls[1][1], false);
  assert.equal('requirements' in calls[1][1], false);
  complete('### Directly demonstrated\n- This sentence came from the model only.');
  const outcome = await promise;
  assert.equal(outcome.status,'ready');
  assert.equal(calls[2][1].text.includes('This sentence came from the model only.'),true);
});

test('late AI responses and failures are discarded on edit/reset/reanalyze/unmount', async () => {
  for (const action of ['edit','reset','reanalyze','unmount']) {
    const {gate,revision} = makeGate();
    let complete;
    const delayed = new Promise(resolve => { complete = resolve; });
    const calls=[];
    const first = runRoleFitAnalyses({jobDescription:javaRole,gate,revision,evidenceCatalog,
      producer:()=>delayed,onMechanical:()=>calls.push('mechanical'),onAI:()=>calls.push('stale-ai'),onError:()=>calls.push('stale-error')});
    if(action==='unmount')gate.dispose();else gate.bump();
    complete('### Directly demonstrated\n- Stale AI output');
    assert.equal((await first).status,'stale',action);
    assert.deepEqual(calls,['mechanical'],action);
  }
});

test('AI model failure never substitutes the mechanical report into the AI response', async () => {
  const {gate,revision} = makeGate();
  const calls=[];
  const result=await runRoleFitAnalyses({jobDescription:javaRole,gate,revision,evidenceCatalog,
    producer:()=>{throw new Error('WebGPU unavailable')},onMechanical:()=>calls.push('mechanical'),
    onAI:()=>calls.push('ai'),onError:()=>calls.push('error')});
  assert.equal(result.status,'failed');
  assert.deepEqual(calls,['mechanical','error']);
});

test('model composition code does not import or invoke the deterministic recruiter summary',()=>{
  const source=readFileSync(new URL('../src/utils/roleFitAI.mjs',import.meta.url),'utf8');
  assert.doesNotMatch(source,/buildRoleFitRecruiterSummary|verifiedCategoryChoices|safeBaseline\.sections/);
});

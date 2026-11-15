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

test('prompt treats role requirements as untrusted and requires cited candidate evidence for every positive claim', () => {
  const {messages} = buildRoleFitAIRequest({jobText: javaRole, evidenceCatalog});
  const system = messages[0].content;
  assert.match(system, /employer.{0,60}(?:NOT|never|not).{0,60}(?:candidate|experience)|job posting.{0,100}NOT candidate/i);
  assert.match(system, /(?:verify|check|support).{0,100}(?:positive|affirmative).{0,100}(?:candidate|evidence)|positive claim.{0,100}source/i);
  assert.match(system, /JavaScript.{0,35}(?:not|!=|≠).{0,35}Java/i);
  assert.match(system, /Node\.js.{0,60}(?:not|!=|≠).{0,45}Java/i);
  assert.match(system, /React.{0,55}(?:not|!=|≠|does not).{0,70}Angular/i);
  assert.match(system, /years|duration/i);
  assert.match(system, /large.scale|extensive|strong|expert/i);
  assert.match(system, /final.{0,30}(?:check|review)|before responding|before finalizing/i);
  assert.match(system, /\[source-id\]|\[evidence-id\]|\[id\]/i);
  assert.match(system, /### Directly demonstrated/);
  assert.match(system, /### Transferable experience/);
  assert.match(system, /### Not established/);
});

test('confirmed lack of professional Java experience is prominent and distinct from undocumented frameworks', () => {
  const {messages} = buildRoleFitAIRequest({jobText: javaRole, evidenceCatalog});
  const system=messages[0].content;
  const user=messages[1].content;
  assert.match(system, /confirmed.*(?:no professional Java|NO PROFESSIONAL JAVA)/i);
  assert.match(system, /Spring.{0,80}(?:not documented|not established|no evidence)/i);
  assert.match(user, /CONFIRMED CANDIDATE LIMITATION/i);
  assert.match(user, /no professional Java work/i);
  assert.ok(user.indexOf('CONFIRMED CANDIDATE LIMITATION') < user.indexOf('EMPLOYER JOB POSTING'));
  assert.match(user, /\[owner-no-professional-java\]/);
  assert.match(user, /CANDIDATE SOURCE EXCERPTS/i);
  assert.match(user, /\[rest-apis\]/);
});

test('unrelated JavaScript jobs do not receive Java absence as an employer-role gap', () => {
  const jobText='Role: JavaScript Frontend Engineer\nExperience with React and REST APIs required.';
  const {messages} = buildRoleFitAIRequest({jobText, evidenceCatalog});
  const all=messages.map(({content})=>content).join('\n');
  assert.doesNotMatch(all, /CONFIRMED CANDIDATE LIMITATION/);
  assert.doesNotMatch(all, /(?:candidate|owner) (?:explicitly )?confirm(?:ed|s).*no professional Java/i);
  assert.match(all, /JavaScript/);
});

test('model source excerpts are concise, source-labelled and do not use mechanical categories', () => {
  const {messages}=buildRoleFitAIRequest({jobText:javaRole, evidenceCatalog});
  const user=messages[1].content;
  const sourceSection=user.split('CANDIDATE SOURCE EXCERPTS')[1];
  const lines=sourceSection.split('\n').filter(line=>/^\[[a-z0-9-]+\]:/.test(line));
  assert.equal(lines.length, evidenceCatalog.filter(item=>['resume','project'].includes(item.sourceType)).length);
  assert.ok(lines.every(line=>line.length<=230), lines.filter(line=>line.length>230).join('\n'));
  assert.doesNotMatch(user, /directlyDemonstrated|transferableExperience|notEstablished|verifiedCategoryChoices/);
  assert.ok(JSON.stringify(buildRoleFitAIRequest({jobText:'React experience required.\n'.repeat(500), evidenceCatalog})).length <= 11000);
});

test('explicitly excluded Java must not be described as a missing requirement by the model prompt', () => {
  const {messages}=buildRoleFitAIRequest({jobText:'Role: React Engineer\nNo Java required; React is essential.',evidenceCatalog});
  assert.match(messages[0].content, /explicitly (?:excluded|not required)|not required.{0,45}(?:gap|missing)/i);
});

test('a Java requirement omitted from the bounded posting excerpt does not inject an irrelevant limitation', () => {
  const jobText = `${'Role: React engineer; React and TypeScript required.\n'.repeat(110)}Java required.`;
  const request=buildRoleFitAIRequest({jobText, evidenceCatalog});
  assert.equal(request.postingTruncated,true);
  assert.doesNotMatch(request.messages[1].content, /CONFIRMED CANDIDATE LIMITATION/);
});

test('the system never asserts owner-confirmed Java absence when the evidence record is missing', () => {
  const catalogWithoutConfirmation=evidenceCatalog.filter(({sourceType})=>sourceType!=='owner_confirmation');
  const request=buildRoleFitAIRequest({jobText:javaRole, evidenceCatalog:catalogWithoutConfirmation});
  assert.doesNotMatch(request.messages[0].content, /candidate confirmed NO PROFESSIONAL JAVA EXPERIENCE/i);
  assert.doesNotMatch(request.messages[1].content, /CONFIRMED CANDIDATE LIMITATION/);
});

test('repetitive model-written bullets are presented at most three times per section without substituting claims', () => {
  const response = [
    '#### Directly demonstrated',
    '- Built REST APIs with Koa.',
    '- Built React interfaces.',
    '- Developed event-driven services.',
    '- This fourth distinct model sentence must be omitted from the compact card.',
    '#### Transferable experience',
    '- Built and deployed services on AWS, including Lambda, DynamoDB, SNS, SQS, and EventBridge.',
    '- Deployed services on AWS, including Lambda, DynamoDB, SNS, SQS, and EventBridge.',
    ...Array(18).fill('- Built and maintained CI/CD pipelines.'),
    '- Worked with Scrum and Kanban.',
    '#### Not established',
    '- Professional Java experience is not demonstrated.',
  ].join('\n');
  const result = interpretRoleFitAIResponse(response, { jobText: javaRole });
  assert.equal(result.kind, 'generated');
  assert.ok(result.presentationAdjusted, 'the UI should be able to disclose editorial trimming');
  assert.ok(result.omittedBullets >= 17);
  assert.match(result.text, /#### Directly demonstrated/);
  assert.match(result.text, /#### Not established/);
  assert.match(result.text, /Professional Java experience/);
  assert.equal((result.text.match(/Built and maintained CI\/CD pipelines\./g) ?? []).length, 1);
  assert.equal((result.text.split("\n").filter((line) => /services on AWS, including/.test(line)) ?? []).length, 1,
    'the identical AWS fact with a leading verb should not appear twice');
  assert.doesNotMatch(result.text, /fourth distinct model sentence/);
  assert.equal(result.original, response, 'full model wording must remain available in diagnostics');
  assert.equal('sections' in result, false, 'never insert deterministic category evaluations');
});

test('distinct source-relevant model sentences remain unchanged when already concise', () => {
  const response = [
    '### Directly demonstrated', '- Built React interfaces. [react]', '- Built REST APIs. [rest-apis]',
    '### Transferable experience', '- Node.js systems are relevant to a Java role, but differ.',
    '### Not established', '- Professional Java experience is not documented.',
  ].join('\n');
  const result = interpretRoleFitAIResponse(response);
  assert.equal(result.text, response);
  assert.equal(result.presentationAdjusted, false);
  assert.equal(result.omittedBullets, 0);
});

test('the AI presentation boundary never fills a missing category or invents replacement experience', () => {
  const response = '### Transferable experience\n' + Array(20).fill('- AWS infrastructure and CI/CD experience.').join('\n');
  const result = interpretRoleFitAIResponse(response);
  assert.equal((result.text.match(/AWS infrastructure and CI\/CD experience/g) ?? []).length, 1);
  assert.doesNotMatch(result.text, /### Not established|### Directly demonstrated/);
  assert.equal(result.original, response);
});

test('legacy JSON model notes are also capped to three authored statements per category', () => {
  const notes = Array.from({ length: 8 }, (_, i) => ({ note: `Unique model statement ${i + 1} about portfolio.` }));
  const response = JSON.stringify({ directlyDemonstrated: notes, transferableExperience: [], notEstablished: [] });
  const result = interpretRoleFitAIResponse(response);
  assert.equal((result.text.match(/Unique model statement/g) ?? []).length, 3);
  assert.equal(result.omittedBullets, 5);
  assert.ok(result.presentationAdjusted);
  assert.doesNotMatch(result.text, /Unique model statement 8/);
});

test('pinned WebLLM generation options use a bounded response and provisional anti-repetition settings', async () => {
  const { roleFitAIGenerationOptions } = await import('../src/utils/roleFitAI.mjs');
  assert.ok(roleFitAIGenerationOptions.temperature > 0.15 && roleFitAIGenerationOptions.temperature <= 0.7);
  assert.ok(roleFitAIGenerationOptions.repetition_penalty > 1 && roleFitAIGenerationOptions.repetition_penalty < 1.25);
  assert.ok(roleFitAIGenerationOptions.frequency_penalty > 0 && roleFitAIGenerationOptions.frequency_penalty < 1);
  assert.ok(roleFitAIGenerationOptions.max_tokens >= 400 && roleFitAIGenerationOptions.max_tokens <= 520);
  const hook = readFileSync(new URL('../src/components/ai/useRoleFitLab.js', import.meta.url), 'utf8');
  assert.match(hook, /roleFitAIGenerationOptions/);
  assert.doesNotMatch(hook, /max_tokens:\s*560/);
});

test('the prompt explicitly prioritizes unique concise findings and completing the gaps section', () => {
  const prompt = buildRoleFitAIRequest({ jobText: javaRole, evidenceCatalog }).messages[0].content;
  assert.match(prompt, /repea(?:t|ted)|duplicat/i);
  assert.match(prompt, /at most two|maximum two|up to two/i);
  assert.match(prompt, /Not established/i);
  assert.match(prompt, /stop|finish|complete/i);
});

test('incomplete three-section model output is disclosed without generating absent findings', () => {
  const response = '### Directly demonstrated\n- Built a sourced React application. [react]';
  const result = interpretRoleFitAIResponse(response);
  assert.deepEqual(result.missingSections, ['Transferable experience', 'Not established']);
  assert.equal(result.text, response);
  assert.ok(!result.presentationAdjusted);
});

test('repeated model headings do not bypass the category limit', () => {
  const response = [
    '### Directly demonstrated', '- First valid model claim.',
    '### Directly demonstrated', ...Array(15).fill('- Second repetitive model claim.'),
    '### Transferable experience', '- One model-authored comparison.',
    '### Not established', '- One model-authored gap.',
  ].join('\n');
  const result = interpretRoleFitAIResponse(response);
  assert.equal((result.text.match(/### Directly demonstrated/g) ?? []).length, 1);
  assert.doesNotMatch(result.text, /Second repetitive model claim/);
  assert.match(result.text, /One model-authored gap/);
  assert.ok(result.omittedBullets >= 15);
});

test('the AI run reports model token-limit completion without modifying model claims', async () => {
  const { gate, revision } = makeGate();
  let rendered;
  const output = '### Directly demonstrated\n- Wrote unique applicant description.';
  const result = await runRoleFitAnalyses({
    jobDescription: javaRole, gate, revision, evidenceCatalog,
    producer: async () => ({ text: output, finishReason: 'length' }),
    onAI: (assessment) => { rendered = assessment; },
  });
  assert.equal(result.status, 'ready');
  assert.equal(rendered.outputLimitReached, true);
  assert.equal(rendered.text, output);
  assert.deepEqual(rendered.missingSections, ['Transferable experience', 'Not established']);
});

test('near-identical bullets naming different technologies are not silently deduplicated', () => {
  const text = [
    '### Directly demonstrated',
    '- Developed a reference application with reusable modules using React, Node.js, TypeScript, Docker, AWS and automated tests.',
    '- Developed a reference application with reusable modules using Vue, Node.js, TypeScript, Docker, AWS and automated tests.',
    '### Transferable experience',
    '- Different runtime expertise can be transferable.',
    '### Not established',
    '- Java is not documented.',
  ].join('\n');
  const result = interpretRoleFitAIResponse(text);
  assert.equal(result.text, text, 'different technologies are distinct model-authored statements, not formatting duplicates');
});

test('plain and bold model headings receive the same concise display protection', () => {
  const response = [
    '**Directly demonstrated**', ...Array(9).fill('- Delivered a unique model-authored statement.'),
    'Transferable experience:', '- React work may transfer to another stack.',
    '**Not established:**', '- Java experience is undocumented.',
  ].join('\n');
  const result = interpretRoleFitAIResponse(response);
  assert.deepEqual(result.missingSections, []);
  assert.equal((result.text.match(/Delivered a unique model-authored statement/g) ?? []).length, 1);
  assert.match(result.text, /Java experience is undocumented/);
});

test('duplicate model headings without bullets are still marked as presentation adjustments', () => {
  const response = '### Directly demonstrated\n### Directly demonstrated\n### Transferable experience\n### Not established';
  const result = interpretRoleFitAIResponse(response);
  assert.equal((result.text.match(/### Directly demonstrated/g) ?? []).length, 1);
  assert.equal(result.presentationAdjusted, true);
  assert.equal(result.omittedBullets, 0);
  assert.equal(result.original, response);
});

test('word-order changes with opposite implications are not flattened by repetition cleanup', () => {
  const text = [
    '### Transferable experience',
    '- React experience may transfer to Vue development but does not demonstrate direct Vue expertise in this role.',
    '- Vue experience may transfer to React development but does not demonstrate direct React expertise in this role.',
    '### Directly demonstrated', '- Built REST APIs using Koa.',
    '### Not established', '- Java is undocumented.',
  ].join('\n');
  const result = interpretRoleFitAIResponse(text);
  assert.equal(result.text, text, 'reversed subjects change the meaning and must remain separate');
});

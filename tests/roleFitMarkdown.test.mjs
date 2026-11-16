import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  buildRoleFitMarkdownRequest, prepareRoleFitResumeMarkdown,
  interpretRoleFitMarkdownResponse, roleFitMarkdownGenerationOptions,
  roleFitMarkdownInputCharacterLimit,
} from '../src/utils/roleFitMarkdown.mjs';

const resume = readFileSync(new URL('../public/static/documents/Resume Cove Marquis EN.md', import.meta.url), 'utf8');

test('published Markdown résumé retains professional content without contact lines', () => {
  const prepared = prepareRoleFitResumeMarkdown(resume);
  assert.match(prepared, /Summary of qualifications/);
  assert.match(prepared, /Employment History/);
  assert.match(prepared, /JavaScript/);
  assert.match(prepared, /OpenZeppelin/);
  assert.doesNotMatch(prepared, /^Phone:|^Email:|^LinkedIn:|^GitHub:|^Portfolio:/gm);
  assert.ok(prepared.length > 5000);
});

test('direct AI request contains full job posting and original Markdown résumé, not derived classifications', () => {
  const job = 'Role: Senior Java Engineer\nJava/J2EE required\nREST APIs and microservices\n' +
    'End of employer posting; retain this exact sentence.';
  const request = buildRoleFitMarkdownRequest({ jobText: job, resumeMarkdown: resume });
  assert.equal(request.messages.length, 2);
  assert.equal(request.messages[0].role, 'system');
  assert.equal(request.messages[1].role, 'user');
  assert.ok(request.messages[1].content.includes(job));
  assert.ok(request.messages[1].content.includes('## Employment History'));
  assert.ok(request.messages[1].content.includes('End of employer posting; retain this exact sentence.'));
  assert.doesNotMatch(request.messages[1].content, /untrustedRoleRequirements|rankedEvidenceIds/);
  assert.deepEqual(Object.keys(request), ['messages']);
});

test('Markdown generation uses no JSON grammar or requirement IDs', () => {
  assert.equal(roleFitMarkdownGenerationOptions.response_format, undefined);
  assert.ok(roleFitMarkdownGenerationOptions.max_tokens > 200);
  assert.ok(roleFitMarkdownGenerationOptions.max_tokens <= 680);
  const request = buildRoleFitMarkdownRequest({ jobText: 'Java role', resumeMarkdown: resume });
  const system = request.messages[0].content;
  assert.match(system, /Markdown/);
  assert.match(system, /## Directly demonstrated/);
  assert.match(system, /## Transferable experience/);
  assert.match(system, /## Not established/);
  assert.doesNotMatch(system, /req-\d+|json_object/);
});


test('prompt actively identifies missing required skills before leaving Not established empty', () => {
  const request = buildRoleFitMarkdownRequest({
    jobText: 'Senior Java developer. Required: Java, Spring Boot, REST APIs.',
    resumeMarkdown: '# Technical skills\n- JavaScript, TypeScript, Node.js, React',
  });
  const system = request.messages[0].content;
  assert.match(system, /Before finalizing, review the job.s required technical skills/i);
  assert.match(system, /In Not established, name the most important required skills/i);
  assert.match(system, /If a role requires Java or Spring and the résumé only documents JavaScript or Node/i);
  assert.match(system, /does not document/i);
  assert.doesNotMatch(system, /the candidate lacks (?:the |this )?skill/i);
});

test('oversized complete inputs fail explicitly rather than silently trimming source text', () => {
  assert.ok(roleFitMarkdownInputCharacterLimit > 8000);
  assert.throws(
    () => buildRoleFitMarkdownRequest({ jobText: 'Java '.repeat(3000), resumeMarkdown: resume }),
    error => error.code === 'input_context_limit',
  );
  assert.throws(
    () => buildRoleFitMarkdownRequest({ jobText: 'Developer role', resumeMarkdown: '' }),
    error => error.code === 'resume_unavailable',
  );
});

test('three model-authored Markdown sections are parsed without matching requirement IDs', () => {
  const raw = [
    '## Directly demonstrated',
    '- Documented **React** interfaces.',
    '- REST APIs and microservices.',
    '## Transferable experience',
    '- Node backend expertise differs from Spring.',
    '## Not established',
    '- Java and Hibernate experience is not documented.',
  ].join('\n');
  const result = interpretRoleFitMarkdownResponse(raw);
  assert.equal(result.kind, 'accepted');
  assert.equal(result.selectedCount, 4);
  assert.deepEqual(result.missingSections, []);
  assert.equal(result.sections.direct[0], 'Documented **React** interfaces.');
  assert.equal(result.sections.transferable.length, 1);
  assert.equal(result.sections.notEstablished.length, 1);
  assert.equal(result.rawModelOutput, raw);
});

test('Markdown parsing supports numbered headings, paragraphs, and wrapped bullet lines', () => {
  const result = interpretRoleFitMarkdownResponse([
    '1. Directly demonstrated',
    '- Web API work',
    'using TypeScript.',
    '',
    '2. Transferable experience:',
    'Backend experience could transfer.',
    '',
    '3. Not established',
    'Professional Java tenure is undocumented.',
  ].join('\n'));
  assert.equal(result.kind, 'accepted');
  assert.deepEqual(result.sections.direct, ['Web API work using TypeScript.']);
  assert.deepEqual(result.sections.transferable, ['Backend experience could transfer.']);
  assert.deepEqual(result.sections.notEstablished, ['Professional Java tenure is undocumented.']);
});

test('missing sections remain absent instead of being filled from the deterministic report', () => {
  const result = interpretRoleFitMarkdownResponse('## Directly demonstrated\n- React work.');
  assert.equal(result.kind, 'accepted');
  assert.deepEqual(result.sections.transferable, []);
  assert.deepEqual(result.sections.notEstablished, []);
  assert.deepEqual(result.missingSections, ['transferable', 'notEstablished']);
});

test('unstructured model text remains inspectable without fabricating evidence categories', () => {
  const raw = 'The candidate has relevant API skills, but the requested Java stack is not documented.';
  const result = interpretRoleFitMarkdownResponse(raw);
  assert.equal(result.kind, 'unstructured');
  assert.equal(result.selectedCount, 0);
  assert.equal(result.rawModelOutput, raw);
  assert.deepEqual(result.sections.direct, []);
});

test('model HTML is inert data and cannot create a script or candidate claim', () => {
  const malicious = '<img src=x onerror=alert(1)>';
  const result = interpretRoleFitMarkdownResponse('## Directly demonstrated\n- ' + malicious);
  assert.equal(result.kind, 'accepted');
  assert.equal(result.sections.direct[0], malicious);
});

test('empty, incomplete, and overlong generation remains non-authoritative', () => {
  assert.equal(interpretRoleFitMarkdownResponse('').failureCode, 'empty_response');
  assert.equal(interpretRoleFitMarkdownResponse('## Directly demonstrated\n- React', {
    outputLimitReached: true,
  }).failureCode, 'generation_limit');
  const long = interpretRoleFitMarkdownResponse('## Directly demonstrated\n- ' + 'x'.repeat(8100));
  assert.equal(long.failureCode, 'response_too_long');
  assert.equal(long.rawModelOutput.length, 8000);
  assert.equal(long.rawModelOutputTruncated, true);
});

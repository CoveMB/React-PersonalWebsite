import assert from 'node:assert/strict';
import test from 'node:test';
import { parseRoleRequirements } from '../src/utils/roleFitRequirements.mjs';
import { matchRoleRequirements } from '../src/utils/roleFitMatching.mjs';
import { buildRoleFitAssessment } from '../src/utils/roleFitAssessment.mjs';
import { getRoleFitEvidenceCatalog } from '../src/utils/roleFitEvidence.mjs';
const evidenceCatalog=getRoleFitEvidenceCatalog();
const assess=(jobText)=>{const requirements=parseRoleRequirements(jobText); return buildRoleFitAssessment({jobText,requirements,matches:matchRoleRequirements(requirements,evidenceCatalog),evidenceCatalog});};

test('Wissen Java is a core gap with sourced REST and React strengths',()=>{
  const result=assess('Role: Senior Java Software Engineer\nRequired skills:\nJava and Spring are mandatory.\nREST APIs and Microservices.\nReact or Vue.\nFulltime onsite 3 days a week.');
  assert.equal(result.conclusion.kind,'transferable_core_gap');
  assert.ok(result.criticalGaps.some(g=>g.requirement.options.some(x=>x.key==='java')));
  assert.ok(result.highlights.some(x=>x.evidence.some(e=>e.id==='react'||e.id==='rest-apis')));
  assert.ok(result.conditions.some(x=>x.requirement.category==='logistics'));
  assert.ok(result.details.every(x=>x.requirement.quote));
});
test('React TypeScript role can have documented alignment',()=>{
  const result=assess('Role: React Developer\nRequired skills:\nReact and TypeScript\nCI/CD');
  assert.equal(result.conclusion.kind,'documented_alignment');
});
test('unknown-only role cannot invent candidate skill',()=>{
  const result=assess('Required skills:\nPHP Laravel\nElixir Phoenix');
  assert.ok(['insufficient_role_details','insufficient_evidence'].includes(result.conclusion.kind));
  assert.equal(result.highlights.length,0);
});
test('optional requirements do not dominate required strengths',()=>{
  const result=assess('Required skills:\nReact\nNice to have:\nDjango\nAzure');
  assert.equal(result.conclusion.kind,'documented_alignment');
  assert.equal(result.criticalGaps.length,0);
});
test('pure conditions and soft skills do not become invented role fit',()=>{
  const result=assess('Fulltime onsite 4 days per week\nExcellent interpersonal communication required.');
  assert.equal(result.conclusion.kind,'insufficient_role_details');
});
test('years in job cannot be turned into candidate tenure',()=>{
  const result=assess('Role: Senior Java Engineer\nRequired 6 years of Java experience.');
  assert.ok(result.details.some(x=>x.requirement.category==='tenure'));
  assert.ok(!JSON.stringify(result.highlights).includes('6 years'));
});
test('partial coverage appears in report, with unparsed source text',()=>{
  const result=assess(Array.from({length:65},(_,i)=>`Must learn XYZ${i}`).join('\n'));
  assert.equal(result.unparsedQuotes.length,65); // 60 unknown + 5 over limit
  assert.match(result.coverageNote,/Partial coverage/);
});
test('no hallucinated percentages or applicant recommendation',()=>{
  const result=assess('Java and Spring mandatory. React optional.');
  assert.doesNotMatch(result.conclusion.summary,/\d+%|should apply|should not apply/i);
  assert.ok(result.highlights.length<=4);
});

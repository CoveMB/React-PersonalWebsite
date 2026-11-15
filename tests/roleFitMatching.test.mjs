import assert from 'node:assert/strict';
import test from 'node:test';
import { parseRoleRequirements } from '../src/utils/roleFitRequirements.mjs';
import { matchRoleRequirements } from '../src/utils/roleFitMatching.mjs';
import { getRoleFitEvidenceCatalog } from '../src/utils/roleFitEvidence.mjs';
const catalog=getRoleFitEvidenceCatalog();
const match=(text)=>{const requirements=parseRoleRequirements(text);return {requirements,matches:matchRoleRequirements(requirements,catalog)};};

test('Java core is not silently promoted from JavaScript or Node work',()=>{
  const {matches}=match('Role: Senior Java Software Engineer\nJava and Spring required');
  assert.equal(matches[0].status,'not_documented');
  assert.equal(matches[0].rationaleCode,'owner_confirmed_absence');
  assert.equal(matches[1].status,'not_documented');
});
test('React satisfies an alternative but not conjunction with Vue',()=>{
  assert.equal(match('React or Vue').matches[0].status,'direct');
  assert.notEqual(match('React and Vue').matches[0].status,'direct');
  assert.equal(match('Angular, React, or Vue').matches[0].status,'direct');
});
test('REST, React, AWS, CI/CD have direct evidence, HTML and CSS do not',()=>{
  for(const name of ['REST APIs','React','AWS','CI/CD']) assert.equal(match(name).matches[0].status,'direct',name);
  for(const name of ['HTML5','CSS3']) assert.notEqual(match(name).matches[0].status,'direct',name);
});
test('unknown technologies are not fabricated negatives or positives',()=>{
  for(const name of ['Azure','Django','Kafka','C#','PHP Laravel']){
    const status=match(name).matches[0].status;assert.notEqual(status,'direct',name);
  }
});
test('published project narratives support Python and Kubernetes exposure, not tenure',()=>{
  for(const name of ['Python','Kubernetes']) assert.equal(match(name).matches[0].status,'direct',name);
  assert.equal(match('6 years of Python experience').matches[0].status,'needs_confirmation');
});
test('learning-only, planned and user-entered claims can never satisfy requirements',()=>{
  const augmented=[...catalog,{id:'invented', sourceType:'resume',sourceQuote:'Built PHP systems',maturity:'planned',experienceType:'professional',capabilities:['java','php']}];
  const r=parseRoleRequirements('Java is required');
  const m=matchRoleRequirements(r,augmented);assert.equal(m[0].status,'not_documented');
});
test('logistics and soft-skill statements are questions, not mismatches',()=>{
  for(const line of ['Fulltime onsite 3 days a week','Strong communication skills']) assert.equal(match(line).matches[0].status,'needs_confirmation');
});
test('source ids in matches resolve to eligible catalog evidence',()=>{
  const {matches}=match('React and REST APIs with CI/CD and microservices');
  const ids=new Set(catalog.map(x=>x.id));
  for(const row of matches) for(const id of row.evidenceIds) assert.ok(ids.has(id));
});

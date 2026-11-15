import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRoleFitEnhancementRequest, validateRoleFitEnhancement, applyRoleFitEnhancement } from '../src/utils/roleFit.js';
import { createRoleFitRevisionGuard, enhanceRoleFitWith } from '../src/utils/roleFitEnhancement.mjs';
import { parseRoleRequirements } from '../src/utils/roleFitRequirements.mjs';
import { matchRoleRequirements } from '../src/utils/roleFitMatching.mjs';
import { buildRoleFitAssessment } from '../src/utils/roleFitAssessment.mjs';
import { getRoleFitEvidenceCatalog } from '../src/utils/roleFitEvidence.mjs';
const evidenceCatalog=getRoleFitEvidenceCatalog();
const jobText='Role: Senior Java Developer\nJava is mandatory; React experience is a plus.';
const requirements=parseRoleRequirements(jobText);
const base=buildRoleFitAssessment({jobText,requirements,matches:matchRoleRequirements(requirements,evidenceCatalog),evidenceCatalog});
const context={jobText,requirements,evidenceCatalog};
const serialized=(value)=>JSON.stringify(value);

test('model prompts contain only public ID metadata, never resume contact details',()=>{
  const request=buildRoleFitEnhancementRequest(context);
  const prompt=JSON.stringify(request);
  assert.match(prompt,/untrustedPosting/);
  assert.doesNotMatch(prompt,/@|514-625|marquisbenjamin23/);
  assert.ok(prompt.length<12000);
});
test('malformed and oversized suggestions cannot replace baseline',()=>{
  for(const bad of ['not json','```json\n{}\n```','{}','x'.repeat(8193),serialized({additionalRequirements:[],rankedEvidenceIds:42})])
    assert.equal(validateRoleFitEnhancement(bad,context),null);
});
test('unknown IDs, forged excerpt and outside span are discarded',()=>{
  const result=validateRoleFitEnhancement(serialized({
    additionalRequirements:[{quote:'I know professional Java',span:{start:0,end:24}},{quote:'React',span:{start:90000,end:90005}}],
    rankedEvidenceIds:['fabricated-java','react','owner-no-professional-java']
  }),context);
  assert.deepEqual(result.additionalRequirements,[]);
  assert.deepEqual(result.rankedEvidenceIds,['react']);
});
test('legitimate overlooked quoted subsection is grounded and does not remove Java gap',()=>{
  const start=jobText.indexOf('React experience');const quote='React experience';
  const validated=validateRoleFitEnhancement(serialized({
    additionalRequirements:[{quote,span:{start,end:start+quote.length}}],
    rankedEvidenceIds:['react']
  }),context);
  assert.equal(validated.additionalRequirements.length,1);
  const enhanced=applyRoleFitEnhancement(base,validated,context);
  assert.equal(enhanced.mode,'enhanced');
  assert.ok(enhanced.details.some(x=>x.requirement.extraction==='model_verified'));
  assert.ok(enhanced.criticalGaps.some(x=>x.requirement.options.some(({key})=>key==='java')));
});
test('old results cannot update after edit, Reset, new Analyze or disposal',async()=>{
  for(const reason of ['edit','reset','new analyze','unmount']){
    const gate=createRoleFitRevisionGuard();const revision=gate.bump();
    let resolve; const pending=new Promise(r=>{resolve=r;});
    const resultPromise=enhanceRoleFitWith({baseline:base,gate,revision,producer:()=>pending,validate:()=>({additionalRequirements:[],rankedEvidenceIds:['react']}),apply:()=>({fake:'value'})});
    if(reason==='unmount') gate.dispose(); else gate.bump();
    resolve('{}');
    assert.equal((await resultPromise).status,'stale',reason);
  }
});
test('failed or empty local model leaves baseline intact',async()=>{
  for(const producer of [async()=>{throw new Error('failed')},async()=> '{}',async()=>null]){
    const gate=createRoleFitRevisionGuard();const revision=gate.bump();
    const outcome=await enhanceRoleFitWith({baseline:base,gate,revision,producer,
      validate:(raw)=>validateRoleFitEnhancement(raw,context),
      apply:(baseline,safe)=>applyRoleFitEnhancement(baseline,safe,context)});
    assert.ok(['unchanged','failed'].includes(outcome.status));
    assert.equal(outcome.assessment,undefined);
  }
});

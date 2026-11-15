import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { roleFitEvidenceCatalog, isPositiveEvidenceEligible } from '../src/utils/roleFitEvidence.mjs';
import { capabilityCatalog } from '../src/utils/roleFitTaxonomy.mjs';

const resumeText=readFileSync(new URL('../public/static/documents/Resume Cove Marquis EN.md',import.meta.url),'utf8');
const projectText=readFileSync(new URL('../src/content/texts/projectTexts.js',import.meta.url),'utf8');

test('every positive statement has an exact, public, corresponding source quotation',()=>{
  for(const item of roleFitEvidenceCatalog.filter(isPositiveEvidenceEligible)){
    const source=item.sourceType==='resume' ? resumeText : projectText;
    assert.ok(source.includes(item.sourceQuote), `${item.id} quoted material not found in its source`);
    assert.ok(item.sourceUrl && item.sourceUrl.startsWith('/'), `${item.id} lacks a safe same-site source link`);
  }
});
test('evidence identifiers and canonical technology keys are unique and intentional',()=>{
  const seen=new Set(); const known=new Set(capabilityCatalog.map(x=>x.key));
  for(const item of roleFitEvidenceCatalog){
    assert.ok(!seen.has(item.id),`duplicate ${item.id}`);seen.add(item.id);
    for(const key of item.capabilities) assert.ok(known.has(key),`${item.id} unsupported capability: ${key}`);
  }
});
test('planned work or learning-only items cannot be presented as professional experience',()=>{
  for(const item of roleFitEvidenceCatalog.filter(isPositiveEvidenceEligible)){
    assert.equal(item.maturity,'documented');
    assert.ok(!/client delivery portal is planned|Rust \(learning\)/i.test(item.sourceQuote));
    assert.ok(['professional','other'].includes(item.experienceType));
  }
});
test('only explicit owner confirmation describes no professional Java experience',()=>{
  const negatives=roleFitEvidenceCatalog.filter((item)=>item.explicitlyAbsent?.length);
  assert.deepEqual(negatives.map(x=>x.id),['owner-no-professional-java']);
  assert.deepEqual(negatives[0].explicitlyAbsent,['java']);
  assert.equal(negatives[0].sourceType,'owner_confirmation');
  assert.equal(isPositiveEvidenceEligible(negatives[0]),false);
});

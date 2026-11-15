import assert from 'node:assert/strict';
import test from 'node:test';
import {roleFitJobFixtures} from './fixtures/roleFitJobs.mjs';
import {parseRoleRequirements} from '../src/utils/roleFitRequirements.mjs';
import {matchRoleRequirements} from '../src/utils/roleFitMatching.mjs';
import {buildRoleFitAssessment} from '../src/utils/roleFitAssessment.mjs';
import {getRoleFitEvidenceCatalog} from '../src/utils/roleFitEvidence.mjs';
const catalog=getRoleFitEvidenceCatalog();
assert.ok(roleFitJobFixtures.length>=20);
for(const fixture of roleFitJobFixtures) test(`corpus: ${fixture.name}`,()=>{
  const req=parseRoleRequirements(fixture.text);
  const matches=matchRoleRequirements(req,catalog);
  const result=buildRoleFitAssessment({jobText:fixture.text,requirements:req,matches,evidenceCatalog:catalog});
  assert.equal(matches.length,req.length);
  for(let i=0;i<matches.length;i++) assert.equal(matches[i].requirementId,req[i].id);
  const rows=result.details;
  if(fixture.direct) assert.ok(rows.some(row=>row.status==='direct' && row.requirement.options.some(x=>x.key===fixture.direct)),`missing direct ${fixture.direct}`);
  if(fixture.noDirect) assert.ok(!rows.some(row=>row.status==='direct' && row.requirement.options.some(x=>x.key===fixture.noDirect)),`false positive ${fixture.noDirect}`);
  if(fixture.coreGap) assert.ok(result.criticalGaps.some(row=>row.requirement.options.some(x=>x.key===fixture.coreGap)),`missing core gap ${fixture.coreGap}`);
  if(fixture.noCoreGap) assert.ok(!result.criticalGaps.some(row=>row.requirement.options.some(x=>x.key===fixture.noCoreGap)),`optional core gap ${fixture.noCoreGap}`);
  if(fixture.noGap) assert.ok(!result.criticalGaps.some(row=>row.requirement.options.some(x=>x.key===fixture.noGap)),`false gap ${fixture.noGap}`);
  if(fixture.insufficient) assert.equal(result.conclusion.kind,'insufficient_role_details');
  for(const row of result.highlights){
    assert.ok(row.evidence.length,'highlight missing source');
    for(const source of row.evidence) assert.ok(catalog.find(x=>x.id===source.id && x.sourceQuote===source.sourceQuote));
  }
  assert.doesNotMatch(result.conclusion.summary,/\b\d+(?:\.\d+)?%|should apply|definitely qualified/i);
});

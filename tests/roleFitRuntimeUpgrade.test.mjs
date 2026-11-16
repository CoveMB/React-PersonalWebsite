import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const lock = readFileSync(new URL('../yarn.lock', import.meta.url), 'utf8');
const ai = readFileSync(new URL('../src/utils/roleFitAI.mjs', import.meta.url), 'utf8');

test('pin WebLLM 0.2.88 and keep the yarn v1 runtime lock in sync', () => {
  assert.equal(packageJson.dependencies['@mlc-ai/web-llm'], '0.2.88');
  assert.match(lock, /^"@mlc-ai\/web-llm@0\.2\.88":$/m);
  assert.doesNotMatch(lock, /^"@mlc-ai\/web-llm@0\.2\.81":$/m);
  assert.match(lock, /web-llm-0\.2\.88\.tgz/);
  assert.match(lock, /sha512-nuLT7aGC5VEjzu03TG7CVhlesMjtBiHsj0w\/odz4XqcWlyr6tw564LTL5OyhEZ\+F\+1RugwpFbsRIRplZdgHBVw==/);
});

test('lock the published 0.2.88 WebLLM dependency graph for frozen installs', () => {
  for (const packageName of [
    '@mlc-ai/web-runtime', '@mlc-ai/web-tokenizers', '@mlc-ai/web-xgrammar',
    '@types/chrome', '@types/filesystem', '@types/filewriter',
    '@types/har-format', '@webgpu/types',
  ]) {
    assert.ok(lock.includes('"' + packageName + '@'), 'lock entry missing: ' + packageName);
  }
  assert.match(lock, /"@mlc-ai\/web-runtime@0\.28\.0-dev2":/);
  assert.match(lock, /"@mlc-ai\/web-xgrammar@0\.1\.27":/);
  assert.match(lock, /tslib@\^2\.8\.1/);
});

test('the model still produces source-checked JSON notes rather than unchecked prose', () => {
  assert.match(ai, /response_format:\s*\{\s*type:\s*'json_object',\s*schema:\s*JSON\.stringify\(roleFitAIResponseSchema\)\s*\}/);
  assert.match(ai, /interpretRoleFitAIResponse/);
});

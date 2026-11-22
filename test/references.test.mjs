import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const load = name => JSON.parse(readFileSync(new URL('../src/data/'+name+'.json', import.meta.url),'utf8'));
const refs = load('references'), entries = load('entries');
const evidence = new Set(['Scripturally Attested','Historical Source','Theological Interpretation','Extra-Biblical Tradition','Unverified Report']);
test('reference identifiers are valid and unique',()=>{assert.equal(new Set(refs.map(r=>r.id)).size,refs.length);for(const r of refs){assert.match(r.id,/^REF-\d{4}$/);assert.ok(r.title&&r.type);}});
test('entries have unique IDs and valid citations',()=>{assert.equal(new Set(entries.map(e=>e.id)).size,entries.length);for(const e of entries){assert.match(e.id,/^(DEM|DOC|HIS|TXT)-\d{4}$/);assert.ok(e.title&&e.summary&&e.reviewStatus);assert.ok(evidence.has(e.evidence));assert.ok(['high','moderate','low','disputed','unknown'].includes(e.confidence));assert.ok(e.citations.length);for(const c of e.citations){assert.ok(refs.some(r=>r.id===c.ref));assert.ok(c.locator);}}});

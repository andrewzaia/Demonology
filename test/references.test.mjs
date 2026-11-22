import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const load = name => JSON.parse(readFileSync(new URL('../src/data/'+name+'.json', import.meta.url),'utf8'));
const refs=load('references'), entries=load('entries');
const evidence=new Set(['Scripturally Attested','Historical Source','Theological Interpretation','Extra-Biblical Tradition','Unverified Report']);
test('reference identifiers are unique and complete',()=>{assert.equal(new Set(refs.map(r=>r.id)).size,refs.length);for(const r of refs){assert.match(r.id,/^REF-\d{4}$/);assert.ok(r.title&&r.type&&r.edition);}});
test('entry identifiers and slugs are unique and claims cite valid sources',()=>{for(const key of ['id','slug'])assert.equal(new Set(entries.map(e=>e[key])).size,entries.length);for(const e of entries){assert.match(e.id,/^(DEM|DOC|HIS|TXT)-\d{4}$/);assert.match(e.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);assert.ok(e.title&&e.summary&&e.reviewStatus);assert.ok(e.claims.length);for(const c of e.claims){assert.ok(c.text&&evidence.has(c.evidence));assert.ok(['high','moderate','low','disputed','unknown'].includes(c.confidence));assert.ok(c.citations.length);for(const s of c.citations){assert.ok(refs.some(r=>r.id===s.ref));assert.ok(s.locator);assert.equal(new URL(s.url).protocol,'https:');}}}});
test('related entries are valid and reciprocal',()=>{for(const e of entries){assert.equal(new Set(e.related).size,e.related.length);for(const id of e.related){assert.notEqual(id,e.id);assert.ok(entries.find(r=>r.id===id)?.related.includes(e.id));}}});

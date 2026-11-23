import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const entries=JSON.parse(readFileSync('src/data/entries.json','utf8'));
test('all generated pages exist and prohibit indexing',()=>{
  const paths=['','methodology/','about/','research/','references/','scripture/','encyclopaedia/','media/',...entries.map(e=>'research/'+e.slug+'/')];
  for(const p of paths){const html=readFileSync('dist/'+p+'index.html','utf8');assert.match(html,/<meta[^>]+name="robots"[^>]+content="noindex,nofollow"/);}
  assert.match(readFileSync('dist/_headers','utf8'),/X-Robots-Tag: noindex, nofollow/);
  assert.match(readFileSync('dist/robots.txt','utf8'),/Disallow: \//);
});
test('entry and source links resolve in built output',()=>{for(const e of entries){const html=readFileSync('dist/research/'+e.slug+'/index.html','utf8');for(const r of e.related){const target=entries.find(x=>x.id===r);assert.ok(html.includes('/research/'+target.slug+'/'));}for(const c of e.claims)for(const s of c.citations){assert.ok(html.includes('/references/#'+s.ref));assert.ok(readFileSync('dist/references/index.html','utf8').includes('id="'+s.ref+'"'));}}});

test('homepage and reading room link to every study',()=>{for(const path of ['dist/index.html','dist/research/index.html']){const html=readFileSync(path,'utf8');for(const e of entries)assert.ok(html.includes('/research/'+e.slug+'/'),path+' missing '+e.id);}});

import { createHash } from 'node:crypto';
const artwork=JSON.parse(readFileSync('src/data/artwork.json','utf8'));
test('illustrations are local, verified and visibly attributed',()=>{assert.equal(new Set(artwork.map(a=>a.entryId)).size,artwork.length);for(const a of artwork){assert.ok(entries.some(e=>e.id===a.entryId&&e.slug===a.slug));assert.match(a.src,/^\/media\/[a-z0-9-]+\.webp$/);assert.ok(a.alt&&a.caption&&a.width>0&&a.height>0);assert.equal(a.origin,'AI-generated illustration');const bytes=readFileSync('dist'+a.src);assert.equal(createHash('sha256').update(bytes).digest('hex'),a.sha256);assert.ok(bytes.length<250000);const html=readFileSync('dist/research/'+a.slug+'/index.html','utf8');assert.ok(html.includes(a.src));assert.ok(html.includes(a.origin));assert.ok(html.includes('alt="'));assert.ok(html.includes('not historical evidence'));}});

test('encyclopaedia and gallery link to their corresponding research',()=>{const catalogue=readFileSync('dist/encyclopaedia/index.html','utf8');const gallery=readFileSync('dist/media/index.html','utf8');const entities=JSON.parse(readFileSync('src/data/entities.json','utf8'));for(const p of entities){const e=entries.find(x=>x.id===p.entryId);assert.ok(catalogue.includes('/research/'+e.slug+'/'));assert.ok(readFileSync('dist/research/'+e.slug+'/index.html','utf8').includes('Profile at a glance'));}for(const a of artwork){assert.ok(gallery.includes(a.src));assert.ok(gallery.includes('/research/'+a.slug+'/'));}});

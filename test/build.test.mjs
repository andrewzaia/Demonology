import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const entries=JSON.parse(readFileSync('src/data/entries.json','utf8'));
test('all generated pages exist and prohibit indexing',()=>{
  const paths=['','methodology/','research/','references/','scripture/',...entries.map(e=>'research/'+e.slug+'/')];
  for(const p of paths){const html=readFileSync('dist/'+p+'index.html','utf8');assert.match(html,/<meta[^>]+name="robots"[^>]+content="noindex,nofollow"/);}
  assert.match(readFileSync('dist/_headers','utf8'),/X-Robots-Tag: noindex, nofollow/);
  assert.match(readFileSync('dist/robots.txt','utf8'),/Disallow: \//);
});
test('entry and source links resolve in built output',()=>{for(const e of entries){const html=readFileSync('dist/research/'+e.slug+'/index.html','utf8');for(const r of e.related){const target=entries.find(x=>x.id===r);assert.ok(html.includes('/research/'+target.slug+'/'));}for(const c of e.claims)for(const s of c.citations){assert.ok(html.includes('/references/#'+s.ref));assert.ok(readFileSync('dist/references/index.html','utf8').includes('id="'+s.ref+'"'));}}});

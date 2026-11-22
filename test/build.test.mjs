import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
test('static output includes required pages and noindex protection', {skip: !existsSync('dist')},()=>{
  for(const p of ['index.html','methodology/index.html']){
    const html=readFileSync('dist/'+p,'utf8');
    assert.match(html,/<meta[^>]+name="robots"[^>]+content="noindex,nofollow"/);
  }
  assert.match(readFileSync('dist/_headers','utf8'),/X-Robots-Tag: noindex, nofollow/);
  assert.match(readFileSync('dist/robots.txt','utf8'),/Disallow: \//);
});

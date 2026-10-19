import fs from 'node:fs/promises';
import path from 'node:path';
import {build,text,chapterCounts} from './build.mjs';
const dist=await build();let count=0;
for(let book=1;book<=8;book++)for(let chapter=1;chapter<=chapterCounts[book-1];chapter++){
 const name=`book${String(book).padStart(2,'0')}`;
 const data=JSON.parse(await fs.readFile(new URL(`../translations/${name}/${chapter}.json`,import.meta.url),'utf8'));
 const html=await fs.readFile(path.join(dist,'wars',name,String(chapter),'index.html'),'utf8');
 for(const s of data.sections){const re=new RegExp(`<section id="${s.id.replaceAll('.','\\.')}"[^>]*>[\\s\\S]*?<p class="section-japanese">([\\s\\S]*?)</p>`);const found=html.match(re);if(!found||text(found[1])!==s.ja)throw Error('表示本文と訳文が不一致: '+s.id);count++;}
}
const index=await fs.readFile(path.join(dist,'index.html'),'utf8');
if(!index.includes('https://github.com/daraskme/belisarius')||!index.includes('7,240 節'))throw Error('目次の案内が不正');
console.log(`全${count}節の表示本文を確認しました。`);

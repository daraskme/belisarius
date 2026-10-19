import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function text(html){return html.replace(/<[^>]+>/g,'').replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi,(m,e)=>e.startsWith('#x')?String.fromCodePoint(parseInt(e.slice(2),16)):e.startsWith('#')?String.fromCodePoint(Number(e.slice(1))):({amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',nbsp:'\u00a0'})[e]).trim();}
export const chapterCounts=[26,30,25,28,29,30,40,35];
export async function build(){
 const dist=path.join(root,'dist');
 await fs.rm(dist,{recursive:true,force:true});
 await fs.cp(path.join(root,'site'),dist,{recursive:true});
 let sections=0,edited=0;
 for(let book=1;book<=8;book++)for(let chapter=1;chapter<=chapterCounts[book-1];chapter++){
  const name=`book${String(book).padStart(2,'0')}`;
  const data=JSON.parse(await fs.readFile(path.join(root,'translations',name,`${chapter}.json`),'utf8'));
  if(data.book!==book||data.chapter!==chapter||!Array.isArray(data.sections))throw Error(`巻・章の指定が不正: ${name}/${chapter}`);
  const file=path.join(dist,'wars',name,String(chapter),'index.html');
  let html=await fs.readFile(file,'utf8');
  const ids=[...html.matchAll(/<section id="([0-9.]+)" class="reader-section">/g)].map(m=>m[1]);
  if(JSON.stringify(ids)!==JSON.stringify(data.sections.map(s=>s.id)))throw Error(`節の追加・削除は site/ 側の対訳と同時に修正してください: ${name}/${chapter}`);
  const entities=new Map([...html.matchAll(/<button\b[^>]*data-entity="[^"]+"[^>]*>[\s\S]*?<\/button>/g)].map(m=>[text(m[0]),m[0]]));
  const labels=[...entities.keys()].filter(Boolean).sort((a,b)=>b.length-a.length);
  const annotate=ja=>{let out='';for(let i=0;i<ja.length;){const label=labels.find(s=>ja.startsWith(s,i));if(label){out+=entities.get(label);i+=label.length;}else{out+=esc(ja[i++]);}}return out;};
  for(const [i,s]of data.sections.entries()){
   if(s.id!==`${book}.${chapter}.${i+1}`||typeof s.ja!=='string'||!s.ja.trim())throw Error('空の訳文、重複または欠番: '+s.id);
   const re=new RegExp(`(<section id="${s.id.replaceAll('.','\\.')}"[^>]*>[\\s\\S]*?<p class="section-japanese">)([\\s\\S]*?)(</p>)`);
   const match=html.match(re);if(!match)throw Error('本文が見つかりません: '+s.id);
   if(text(match[2])!==s.ja){html=html.replace(re,()=>match[1]+' '+annotate(s.ja)+' '+match[3]);edited++;}
   sections++;
  }
  await fs.writeFile(file,html);
 }
 if(sections!==7240)throw Error(`節数が不一致: ${sections}`);
 console.log(`8巻・243章・${sections}節をビルド（本文更新 ${edited} 節）`);
 return dist;
}
if(process.argv[1]===fileURLToPath(import.meta.url))await build();

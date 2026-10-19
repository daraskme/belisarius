import fs from 'node:fs/promises';
const target='https://belisarius.darask.me';
await fs.mkdir('legacy-redirect',{recursive:true});
await fs.writeFile('legacy-redirect/_redirects',`/* ${target}/:splat 301\n`);
await fs.writeFile('legacy-redirect/index.html',`<!doctype html><html lang="ja"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${target}/"><link rel="canonical" href="${target}/"><title>プロコピオス『戦史』は移転しました</title><p>プロコピオス『戦史』日本語訳は移転しました。<a href="${target}/">新しいサイトへ進む</a></p></html>\n`);
console.log(`旧サイトの全パスを ${target} へ301転送します。`);

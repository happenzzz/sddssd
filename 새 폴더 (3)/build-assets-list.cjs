// build-assets-list.cjs
// assets 폴더를 스캔해 list.json/manifest.json을 생성 (하위 폴더 포함)
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');
const OUT_LIST   = path.join(ASSETS_DIR, 'list.json');
const OUT_MAN    = path.join(ASSETS_DIR, 'manifest.json');

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(jpe?g|png|webp|gif)$/i.test(ent.name)) {
      acc.push(path.relative(ASSETS_DIR, p).replace(/\\/g, '/'));
    }
  }
  return acc;
}

if (!fs.existsSync(ASSETS_DIR)) {
  console.error('assets 폴더가 없어요.');
  process.exit(1);
}

const files = walk(ASSETS_DIR).sort();
const json = JSON.stringify({ images: files }, null, 2);
fs.writeFileSync(OUT_LIST, json, 'utf8');
fs.writeFileSync(OUT_MAN,  json, 'utf8');
console.log(`✔ 생성 완료: ${files.length}개 → assets/list.json, assets/manifest.json`);

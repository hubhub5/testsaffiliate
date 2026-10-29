// 테스트 데이터의 구조, 글자 수, 참조를 검사한다.
import { loadDocs, readJson } from './lib.mjs';

const products = readJson('products.json');
const sources = readJson('sources.json');
const CATS = ['공간과 반복', '문장과 말투', '물건과 기록', '머릿속 해석', '저항과 미루기', '관계의 간격'];
const MAX = { name: 14, line: 60, say: 40, opt: 36, q: 60, scene: 60 };

const errs = [];
const docs = loadDocs();
const ids = new Set(docs.map((d) => d.data.id));
const err = (f, m) => errs.push(`✗ ${f}: ${m}`);
const len = (f, at, s, n) => { if ([...s].length > n) err(f, `${at} ${[...s].length}자 > ${n}자 — ${s}`); };

for (const { file: f, data: t } of docs) {
  if (f !== `${t.id}.json`) err(f, `파일 이름과 id가 다름 (${t.id})`);
  if (!CATS.includes(t.cat)) err(f, `분류 없음: ${t.cat}`);
  if (!['A', 'B', 'C', 'D'].includes(t.grade)) err(f, `등급 오류: ${t.grade}`);
  len(f, 'scene', t.scene, MAX.scene);
  for (const s of t.sources) if (!sources[s]) err(f, `참고문헌 없음: ${s}`);
  for (const l of t.linked) if (!ids.has(l)) err(f, `연결 테스트 없음: ${l}`);
  const keys = Object.keys(t.types);
  if (keys.length < 4 || keys.length > 5) err(f, `유형 수 ${keys.length}`);
  if ([...t.tiebreak].sort().join() !== [...keys].sort().join()) err(f, 'tiebreak와 유형 키가 다름');
  if (t.questions.length < 8 || t.questions.length > 10) err(f, `문항 수 ${t.questions.length}`);

  const reach = Object.fromEntries(keys.map((k) => [k, 0]));
  t.questions.forEach((q, i) => {
    len(f, `Q${i + 1}`, q.q, MAX.q);
    if (q.a.length < 3 || q.a.length > 5) err(f, `Q${i + 1} 선택지 수 ${q.a.length}`);
    q.a.forEach((a, j) => {
      len(f, `Q${i + 1}-${j + 1}`, a.t, MAX.opt);
      for (const k in a.s) { if (!(k in reach)) err(f, `Q${i + 1}-${j + 1} 없는 유형 ${k}`); else reach[k] += a.s[k]; }
    });
  });
  for (const k of keys) if (reach[k] < 12) err(f, `유형 ${k}에 걸린 점수가 너무 적음 (${reach[k]})`);

  for (const k of keys) {
    const d = t.types[k];
    const at = `types.${k}`;
    len(f, `${at}.name`, d.name, MAX.name);
    len(f, `${at}.line`, d.line, MAX.line);
    d.says.forEach((s, i) => len(f, `${at}.says[${i}]`, s, MAX.say));
    if (d.says.length < 2 || d.says.length > 5) err(f, `${at}.says ${d.says.length}줄`);
    for (const x of ['trigger', 'read', 'act', 'break', 'residue']) if (!d.flow?.[x]) err(f, `${at}.flow.${x} 없음`);
    for (const x of ['today', 'week', 'month']) if (!d.small?.[x]) err(f, `${at}.small.${x} 없음`);
    for (const x of ['keeps', 'costs', 'limits']) if (!d[x]) err(f, `${at}.${x} 없음`);
    const kinds = d.picks.map((p) => products[p.id]?.kind);
    d.picks.forEach((p) => { if (!products[p.id]) err(f, `${at} 상품 없음: ${p.id}`); });
    if (kinds.join() !== '책,물건') err(f, `${at}.picks는 책 1, 물건 1 순서여야 함`);
  }
}

if (errs.length) { console.log(errs.join('\n')); console.log(`\n데이터 검사: ${errs.length}건`); process.exit(1); }
console.log(`데이터 검사: 통과 (테스트 ${docs.length})`);

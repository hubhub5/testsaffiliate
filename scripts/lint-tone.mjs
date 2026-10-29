// AI 문체로 흐르기 쉬운 표현을 잡는다. 걸리면 빌드를 멈춘다.
import { loadDocs, strings } from './lib.mjs';

const RULES = [
  [/의 모든 것/, "'~의 모든 것'"],
  [/핵심은/, "'핵심은'"],
  [/중요합니다|중요하다/, "'중요하다'"],
  [/효과적(인|으로)/, "'효과적인'"],
  [/다양한/, "'다양한'"],
  [/해보세요|하세요!|보세요!/, '권유형 명령'],
  [/!/, '느낌표'],
  [/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, '이모지'],
  [/첫째|둘째|셋째/, '서수 나열'],
  [/~/, '물결표'],
  [/당신은/, "'당신은' 단정"],
  [/놀라운|획기적|비결|꿀팁/, '과장 표현'],
  [/할 수 있습니다\.$|것입니다\.$/, '설명문 종결'],
  [/에 대해 알아보|살펴보겠/, '안내문 말투'],
];
const SKIP = new Set(['id', 'sources', 'linked', 'tiebreak', 'added', 'history']);

let bad = 0;
for (const doc of loadDocs()) {
  for (const [at, s] of strings(doc.data)) {
    if (SKIP.has(at.split(/[.[]/)[0])) continue;
    for (const [re, label] of RULES) {
      if (re.test(s)) { console.log(`✗ ${doc.file} ${at}: ${label} — ${s}`); bad++; }
    }
  }
}
if (bad) { console.log(`\n톤 린트: ${bad}건`); process.exit(1); }
console.log('톤 린트: 통과');

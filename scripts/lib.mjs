import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = new URL('../src/data/tests/', import.meta.url).pathname;

export function loadDocs() {
  return readdirSync(DIR).filter((f) => f.endsWith('.json')).sort()
    .map((f) => ({ file: f, data: JSON.parse(readFileSync(join(DIR, f), 'utf8')) }));
}
export const readJson = (rel) => JSON.parse(readFileSync(new URL(`../src/data/${rel}`, import.meta.url), 'utf8'));

// 모든 문자열을 [경로, 값]으로 펼친다
export function* strings(v, at = '') {
  if (typeof v === 'string') yield [at, v];
  else if (Array.isArray(v)) for (let i = 0; i < v.length; i++) yield* strings(v[i], `${at}[${i}]`);
  else if (v && typeof v === 'object') for (const k in v) yield* strings(v[k], at ? `${at}.${k}` : k);
}

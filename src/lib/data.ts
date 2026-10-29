import products from '../data/products.json';
import sources from '../data/sources.json';
import { categories } from '../data/categories';

export type G = 'A' | 'B' | 'C' | 'D';
export interface Pick { id: string; why: string }
export interface Type {
  name: string; line: string; says: string[];
  flow: { trigger: string; read: string; act: string; break: string; residue: string };
  keeps: string; costs: string;
  small: { today: string; week: string; month: string };
  picks: Pick[]; limits: string;
}
export interface Test {
  id: string; title: string; cat: string; scene: string; intro: string;
  concepts: string[]; tags: string[]; grade: G; minutes: number;
  added: string; rev: number; history: { date: string; note: string }[];
  sources: string[]; linked: string[];
  questions: { q: string; a: { t: string; s: Record<string, number> }[] }[];
  tiebreak: string[];
  types: Record<string, Type>;
}
export interface Product { kind: '책' | '물건'; name: string; by?: string; query: string; link: string }
export interface Source { au: string; y: string; t: string; in: string; k?: string }

const mods = import.meta.glob<{ default: Test }>('../data/tests/*.json', { eager: true });
export const tests: Test[] = Object.values(mods).map((m) => m.default).sort((a, b) => a.id.localeCompare(b.id));
export const testById = (id: string) => tests.find((t) => t.id === id);
export const typeKeys = (t: Test) => Object.keys(t.types);

export const productById = (id: string) => (products as Record<string, Product>)[id];
export const productHref = (p: Product) => p.link || `https://www.coupang.com/np/search?q=${encodeURIComponent(p.query)}`;

export const sourceList = Object.entries(sources as Record<string, Source>).sort(([a], [b]) => a.localeCompare(b));
export const sourceById = (id: string) => (sources as Record<string, Source>)[id];

export { categories };
export const catOf = (name: string) => categories.find((c) => c.name === name)!;
export const u = (p: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + p;
export const catUrl = (name: string) => u(`/분류/${catOf(name).slug}/`);
export const testsIn = (name: string) => tests.filter((t) => t.cat === name);

export const gradeLabel: Record<G, string> = {
  A: '반복 검증·메타분석',
  B: '실험·꾸준한 상관 연구',
  C: '이론·임상 관찰',
  D: '이 사전의 해석',
};

export const dot = (d: string) => d.replaceAll('-', '.');
export const stats = () => ({
  tests: tests.length,
  types: tests.reduce((n, t) => n + typeKeys(t).length, 0),
  questions: tests.reduce((n, t) => n + t.questions.length, 0),
  sources: sourceList.length,
});

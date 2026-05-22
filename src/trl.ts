export interface TRLResult {
  id: string | number;
  title?: string;
  trl: number;
  evidence: string[];
}

const KEYWORDS: { kw: string; level: number }[] = [
  { kw: 'production', level: 9 },
  { kw: 'deployed', level: 9 },
  { kw: 'commercial', level: 9 },
  { kw: 'operational', level: 9 },
  { kw: 'pilot', level: 7 },
  { kw: 'field trial', level: 7 },
  { kw: 'demonstration', level: 6 },
  { kw: 'demonstrate', level: 6 },
  { kw: 'prototype', level: 5 },
  { kw: 'prototype', level: 5 },
  { kw: 'experiment', level: 4 },
  { kw: 'simulation', level: 4 },
  { kw: 'proof-of-concept', level: 3 },
  { kw: 'proof of concept', level: 3 },
  { kw: 'paper', level: 2 },
  { kw: 'study', level: 2 },
  { kw: 'research', level: 2 },
  { kw: 'concept', level: 1 }
];

function detectKeywords(text: string): { evidence: string[]; level: number } {
  const t = text.toLowerCase();
  const evidence: string[] = [];
  let best = 0;
  for (const k of KEYWORDS) {
    if (t.includes(k.kw)) {
      evidence.push(k.kw);
      if (k.level > best) best = k.level;
    }
  }
  if (best === 0) best = 3; // varsayılan: kavramsal/proof-of-concept arası
  return { evidence, level: best };
}

export function assessTRL(docs: Array<{ id?: string | number; title?: string; content?: string }>): TRLResult[] {
  const results: TRLResult[] = [];
  for (const d of docs) {
    const text = [d.title || '', d.content || ''].join('\n');
    const { evidence, level } = detectKeywords(text);
    results.push({ id: d.id ?? 'unknown', title: d.title, trl: level, evidence });
  }
  return results;
}

export interface TRLResult {
  id: string | number;
  title?: string;
  trl: number;
  evidence: string[];
}

const KEYWORDS: { kw: string; level: number }[] = [
  // TRL 9 - Seri Üretim / Ticari / Operasyonel
  { kw: 'production', level: 9 },
  { kw: 'deployed', level: 9 },
  { kw: 'commercial', level: 9 },
  { kw: 'operational', level: 9 },
  { kw: 'seri üretim', level: 9 },
  { kw: 'ticari', level: 9 },
  { kw: 'yaygınlaştırma', level: 9 },
  { kw: 'kullanımda', level: 9 },
  { kw: 'operasyonel', level: 9 },
  { kw: 'sahada', level: 9 },

  // TRL 8 - Kalifikasyon ve Test Tamamlama
  { kw: 'qualified', level: 8 },
  { kw: 'proven system', level: 8 },
  { kw: 'kalifiye', level: 8 },
  { kw: 'sistem doğrulama', level: 8 },
  { kw: 'tamamlanmış sistem', level: 8 },

  // TRL 7 - Pilot Üretim / Saha Denemesi
  { kw: 'pilot', level: 7 },
  { kw: 'field trial', level: 7 },
  { kw: 'pilot üretim', level: 7 },
  { kw: 'saha denemesi', level: 7 },
  { kw: 'operasyonel ortam', level: 7 },

  // TRL 6 - Gösterim / Doğrulama (Relevant Env)
  { kw: 'demonstration', level: 6 },
  { kw: 'demonstrate', level: 6 },
  { kw: 'prototip gösterimi', level: 6 },
  { kw: 'gösterim', level: 6 },

  // TRL 5 - Prototip Entegrasyonu
  { kw: 'prototype', level: 5 },
  { kw: 'laboratuvar ölçekli', level: 5 },
  { kw: 'entegre prototip', level: 5 },

  // TRL 4 - Deney / Simülasyon / Laboratuvar
  { kw: 'experiment', level: 4 },
  { kw: 'simulation', level: 4 },
  { kw: 'validation', level: 4 },
  { kw: 'deney', level: 4 },
  { kw: 'simülasyon', level: 4 },
  { kw: 'laboratuvar testi', level: 4 },
  { kw: 'laboratuvar deneyi', level: 4 },

  // TRL 3 - Kavram Kanıtlama (Proof of Concept)
  { kw: 'proof-of-concept', level: 3 },
  { kw: 'proof of concept', level: 3 },
  { kw: 'kavram kanıtlama', level: 3 },
  { kw: 'kavram kanıtı', level: 3 },
  { kw: 'analitik çalışma', level: 3 },

  // TRL 2 - Araştırma / Makale / Tasarım Formülasyonu
  { kw: 'paper', level: 2 },
  { kw: 'study', level: 2 },
  { kw: 'research', level: 2 },
  { kw: 'makale', level: 2 },
  { kw: 'araştırma', level: 2 },
  { kw: 'formülasyon', level: 2 },
  { kw: 'tasarım aşaması', level: 2 },

  // TRL 1 - Kuramsal / Temel İlkeler
  { kw: 'concept', level: 1 },
  { kw: 'kuramsal', level: 1 },
  { kw: 'temel ilkeler', level: 1 },
  { kw: 'teori', level: 1 },
  { kw: 'kavram', level: 1 }
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

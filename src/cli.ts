import { readFileSync } from 'fs';
import { analyze } from './analysis';
import { assessTRL } from './trl';
import * as path from 'path';

function loadJSON(filePath: string): any {
  try {
    const raw = readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Örnek veri okunamadı:', e.message);
    return null;
  }
}

const mode = process.argv[2] || 'analysis';
if (mode === 'trl') {
  const file = path.join(__dirname, '..', 'data', 'text_samples.json');
  const docs = loadJSON(file) || [];
  const trlResults = assessTRL(docs as any[]);
  console.log('TRL Analiz Sonuçları:');
  for (const r of trlResults) {
    console.log(`- ${r.id} (${r.title ?? 'no title'}): TRL=${r.trl}; kanıt=${r.evidence.join(', ')}`);
  }
} else {
  const file = path.join(__dirname, '..', 'data', 'sample.json');
  const data = loadJSON(file) || [];
  const result = analyze(data as any[]);
  console.log('Analiz özeti:');
  console.log(result.summary);
  if (result.highlights.length) {
    console.log('Vurgular:');
    for (const h of result.highlights) console.log('-', h);
  }
}

import { assessTRL } from './trl';

export interface TagReadiness {
  tag: string;
  count: number;
  avgTRL: number;
  status: string;
}

export interface AnalysisResult {
  summary: string;
  totalItems: number;
  highlights: string[];
  tagReadiness: TagReadiness[];
}

export function analyze(dataset: any[], textSamples: any[]): AnalysisResult {
  const totalItems = dataset.length;
  const highlights: string[] = [];

  if (totalItems === 0) {
    return { summary: 'Veri kümesi boş.', totalItems, highlights, tagReadiness: [] };
  }

  // Her belgenin TRL seviyesini hesapla
  const trlResults = assessTRL(textSamples);
  const trlMap = new Map<string | number, { trl: number; evidence: string[] }>();
  for (const r of trlResults) {
    trlMap.set(r.id, { trl: r.trl, evidence: r.evidence });
  }

  // Etiketler ile TRL verilerini çapraz sorgula
  const tagCounts: Record<string, number> = {};
  const tagTrlSums: Record<string, number> = {};

  for (const item of dataset) {
    const docId = item.id;
    const tags: string[] = Array.isArray(item.tags) ? item.tags : [];
    const trlInfo = trlMap.get(docId);
    const trlValue = trlInfo ? trlInfo.trl : 3; // varsayılan TRL seviyesi

    for (const tag of tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      tagTrlSums[tag] = (tagTrlSums[tag] || 0) + trlValue;
    }
  }

  const tagReadiness: TagReadiness[] = [];
  for (const [tag, count] of Object.entries(tagCounts)) {
    const avgTRL = parseFloat((tagTrlSums[tag] / count).toFixed(1));
    let status = 'Araştırma ve Kavramsal (TRL 1-4)';
    if (avgTRL >= 8.0) {
      status = 'Ticari ve Operasyonel (TRL 8-9)';
    } else if (avgTRL >= 5.0) {
      status = 'Prototip ve Gösterim (TRL 5-7)';
    }
    tagReadiness.push({ tag, count, avgTRL, status });
  }

  // Ortalama TRL değerine göre azalan sırada sırala
  tagReadiness.sort((a, b) => b.avgTRL - a.avgTRL || b.count - a.count);

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  for (const [tag, count] of sortedTags.slice(0, 5)) {
    const avg = (tagTrlSums[tag] / count).toFixed(1);
    highlights.push(`${tag} (${count} doküman, Ort. TRL: ${avg})`);
  }

  const summary = `Toplam analiz edilen stratejik belge: ${totalItems}.`;
  return { summary, totalItems, highlights, tagReadiness };
}

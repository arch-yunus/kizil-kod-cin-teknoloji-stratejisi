export interface AnalysisResult {
  summary: string;
  totalItems: number;
  highlights: string[];
}

export function analyze(dataset: any[]): AnalysisResult {
  const totalItems = dataset.length;
  const highlights: string[] = [];

  if (totalItems === 0) {
    return { summary: 'Veri kümesi boş.', totalItems, highlights };
  }

  // Basit örnek analiz: en sık geçen `tag` değerleri
  const tagCounts: Record<string, number> = {};
  for (const item of dataset) {
    const tags: string[] = Array.isArray(item.tags) ? item.tags : [];
    for (const t of tags) tagCounts[t] = (tagCounts[t] || 0) + 1;
  }

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  for (const [tag, count] of sortedTags.slice(0, 5)) {
    highlights.push(`${tag}: ${count}`);
  }

  const summary = `Toplam kayıt: ${totalItems}. Öne çıkan etiketler: ${highlights.join(', ')}`;
  return { summary, totalItems, highlights };
}

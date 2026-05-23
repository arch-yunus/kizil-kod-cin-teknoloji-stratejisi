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

const sampleFile = path.join(__dirname, '..', 'data', 'sample.json');
const textSamplesFile = path.join(__dirname, '..', 'data', 'text_samples.json');

const dataset = loadJSON(sampleFile) || [];
const textSamples = loadJSON(textSamplesFile) || [];

const mode = process.argv[2] || 'analysis';

if (mode === 'trl') {
  console.log('\n========================================================================');
  console.log('                 BELGE TABANLI TRL DEĞERLENDİRME SONUÇLARI');
  console.log('========================================================================');
  
  const trlResults = assessTRL(textSamples);
  for (const r of trlResults) {
    console.log(`\n📄 Belge Kimliği: ${r.id}`);
    console.log(`   Başlık:       ${r.title ?? 'Başlıksız'}`);
    console.log(`   TRL Seviyesi: TRL-${r.trl}`);
    console.log(`   Kanıtlar:     ${r.evidence.length > 0 ? r.evidence.join(', ') : 'Kanıt bulunamadı (Varsayılan)'}`);
    console.log('   ---------------------------------------------------------------------');
  }
} else {
  console.log('\n========================================================================');
  console.log('          KIZIL KOD — ÇİN TEKNOLOJİ STRATEJİSİ RAPORLAMA ARACI');
  console.log('========================================================================');

  const result = analyze(dataset, textSamples);
  console.log(`\n📢 Özet: ${result.summary}\n`);

  console.log('------------------------------------------------------------------------');
  console.log('                   TEKNOLOJİK OLGUNLUK SEVİYESİ (TRL) MATRİSİ');
  console.log('------------------------------------------------------------------------');
  console.log(String('Teknoloji Alanı').padEnd(20) + ' | ' + 
              String('Belge').padEnd(6) + ' | ' + 
              String('Ort. TRL').padEnd(9) + ' | ' + 
              String('Olgunluk Durumu'));
  console.log('------------------------------------------------------------------------');
  
  for (const item of result.tagReadiness) {
    console.log(
      item.tag.padEnd(20) + ' | ' + 
      String(item.count).padStart(6) + ' | ' + 
      String(item.avgTRL).padStart(9) + ' | ' + 
      item.status
    );
  }
  console.log('------------------------------------------------------------------------\n');

  if (result.highlights.length) {
    console.log('💡 Öne Çıkan Bulgular (Sektör Dağılımları):');
    for (const h of result.highlights) {
      console.log(`   • ${h}`);
    }
    console.log('');
  }
}

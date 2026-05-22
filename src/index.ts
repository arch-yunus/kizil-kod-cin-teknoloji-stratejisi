function greet(name: string): string {
  return `Merhaba, ${name}! Kızıl Kod strateji analizine hoşgeldiniz.`;
}

export function run(): void {
  console.log(greet('Dünya'));
}

if (require.main === module) {
  run();
}

export { analyze } from './analysis';


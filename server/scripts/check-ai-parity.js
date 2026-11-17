import { readFileSync } from 'node:fs';
import { rankCategories, scoreVector } from '../src/ai/categoryClassifier.js';
import { embed, embedderStatus, loadEmbedder } from '../src/ai/embedder.js';

const fixtures = JSON.parse(
  readFileSync(new URL('../src/ai/data/fixtures.json', import.meta.url), 'utf8')
);

const dot = (a, b) => a.reduce((sum, value, i) => sum + value * b[i], 0);

console.log('Loading the model (the first run downloads it)...');
await loadEmbedder();
if (embedderStatus() !== 'ready') {
  console.error('The model did not load. See the message above.');
  process.exit(1);
}

let failures = 0;
const rows = [];

for (const item of fixtures.items) {
  const vector = await embed(item.text);
  const similarity = dot(vector, item.embedding);
  const probabilities = scoreVector(vector);
  const maxDifference = Math.max(
    ...probabilities.map((p, i) => Math.abs(p - item.probabilities[i]))
  );
  const nodeTop = rankCategories(vector)[0].slug;
  const ok = similarity >= 0.98 && nodeTop === item.top;
  if (!ok) failures += 1;

  rows.push({
    text: item.text.slice(0, 38),
    'embedding match': similarity.toFixed(4),
    'biggest probability gap': maxDifference.toFixed(4),
    'python top': item.top,
    'node top': nodeTop,
    result: ok ? 'PASS' : 'FAIL',
  });
}

console.table(rows);
console.log(failures === 0 ? 'All checks passed.' : `${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);

import { readFileSync } from 'node:fs';

export const MODEL = JSON.parse(
  readFileSync(new URL('./data/category-model.json', import.meta.url), 'utf8')
);

const dot = (a, b) => {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) sum += a[i] * b[i];
  return sum;
};

function softmax(values) {
  const max = Math.max(...values);
  const exps = values.map((value) => Math.exp(value - max));
  const total = exps.reduce((sum, value) => sum + value, 0);
  return exps.map((value) => value / total);
}

export function scoreVector(vector) {
  if (vector.length !== MODEL.embedding_dimension) {
    throw new Error(`Expected ${MODEL.embedding_dimension} numbers, got ${vector.length}`);
  }

  const { coefficients, intercepts } = MODEL.classifier;
  const trained = softmax(coefficients.map((row, k) => dot(row, vector) + intercepts[k]));

  const { category_embeddings: anchors, scale } = MODEL.zero_shot;
  const zeroShot = softmax(anchors.map((row) => dot(row, vector) * scale));

  return trained.map((p, i) => MODEL.blend_weight * p + (1 - MODEL.blend_weight) * zeroShot[i]);
}

export function rankCategories(vector) {
  const probabilities = scoreVector(vector);
  return MODEL.classes
    .map((slug, i) => ({ slug, probability: probabilities[i] }))
    .sort((a, b) => b.probability - a.probability);
}

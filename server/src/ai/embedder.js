import path from 'node:path';
import { env as hfEnv, pipeline } from '@huggingface/transformers';
import { env } from '../config/env.js';

const MODEL_ID = 'Xenova/all-MiniLM-L6-v2';

hfEnv.cacheDir = path.resolve(process.cwd(), '.ai-cache');

let state = 'idle';
let extractor = null;
let loading = null;

export const embedderStatus = () => state;

export function loadEmbedder() {
  if (!loading) {
    state = 'loading';
    loading = pipeline('feature-extraction', MODEL_ID, { dtype: env.AI_MODEL_DTYPE })
      .then((pipe) => {
        extractor = pipe;
        state = 'ready';
      })
      .catch((err) => {
        state = 'failed';
        console.error('AI model failed to load:', err.message);
      });
  }
  return loading;
}

export async function embed(text) {
  if (state !== 'ready') {
    throw new Error('The embedding model is not ready');
  }
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

import { env } from '../config/env.js';
import { MODEL, rankCategories } from '../ai/categoryClassifier.js';
import { embed, embedderStatus, loadEmbedder } from '../ai/embedder.js';
import Category from '../models/Category.js';

const MAX_SUGGESTIONS = 3;
const NOT_AVAILABLE = { available: false, suggestions: [] };

export async function suggestCategories({ kind, title, description }) {
  if (!env.AI_SUGGESTIONS_ENABLED) {
    return NOT_AVAILABLE;
  }

  if (embedderStatus() !== 'ready') {
    loadEmbedder();
    return NOT_AVAILABLE;
  }

  const text = `${title}. ${description ?? ''}`.trim().slice(0, 1000);

  let ranked;
  try {
    ranked = rankCategories(await embed(text));
  } catch (err) {
    console.error('Category suggestion failed:', err.message);
    return NOT_AVAILABLE;
  }

  const categories = await Category.find({ kind, isActive: true }).select('name slug');
  const bySlug = new Map(categories.map((category) => [category.slug, category]));

  const suggestions = ranked
    .filter((entry) => bySlug.has(entry.slug))
    .slice(0, MAX_SUGGESTIONS)
    .map((entry, index) => {
      const category = bySlug.get(entry.slug);
      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        probability: Number(entry.probability.toFixed(3)),
        recommended: index === 0 && entry.probability >= MODEL.threshold,
      };
    });

  return { available: true, suggestions };
}

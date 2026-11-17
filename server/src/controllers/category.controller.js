import * as categoryService from '../services/category.service.js';
import * as suggestionService from '../services/suggestion.service.js';

export async function list(req, res) {
  const categories = await categoryService.getCategoryTree();
  res.set('Cache-Control', 'public, max-age=300');
  res.json({ categories });
}

export async function suggest(req, res) {
  const result = await suggestionService.suggestCategories(req.validated.body);
  res.json(result);
}

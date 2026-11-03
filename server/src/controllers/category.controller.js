import * as categoryService from '../services/category.service.js';

export async function list(req, res) {
  const categories = await categoryService.getCategoryTree();
  res.set('Cache-Control', 'public, max-age=300');
  res.json({ categories });
}

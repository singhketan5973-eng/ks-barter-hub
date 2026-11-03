import Category from '../models/Category.js';

export async function getCategoryTree() {
  const docs = await Category.find({ isActive: true }).sort({ kind: 1, sortOrder: 1, name: 1 });

  const nodes = new Map(docs.map((doc) => [doc.id, { ...doc.toJSON(), children: [] }]));
  const roots = [];

  for (const node of nodes.values()) {
    const parent = node.parent ? nodes.get(String(node.parent)) : null;
    if (parent) {
      parent.children.push(node);
    } else if (!node.parent) {
      roots.push(node);
    }
  }

  return roots;
}

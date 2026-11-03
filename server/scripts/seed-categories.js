import { connectDB, disconnectDB } from '../src/config/db.js';
import Category, { CATEGORY_KINDS } from '../src/models/Category.js';
import { slugify } from '../src/utils/slugify.js';

const ITEM_CATEGORIES = [
  'Books and study',
  'Electronics',
  'Home and furniture',
  'Clothing and accessories',
  'Sports and outdoors',
  'Music and hobbies',
  'Kids and baby',
  'Other things',
];

const SERVICE_CATEGORIES = [
  'Tutoring and lessons',
  'Repairs and fixing',
  'Cooking and food',
  'Design and creative',
  'Tech and web',
  'Home help',
  'Care and wellness',
  'Other services',
];

async function ensureCategory({ name, kind, sortOrder }) {
  const slug = slugify(name);
  const existing = await Category.findOne({ slug });
  if (existing) {
    return false;
  }
  await Category.create({ name, slug, kind, sortOrder });
  return true;
}

async function run() {
  await connectDB();
  await Category.init();

  let created = 0;
  let skipped = 0;

  const groups = [
    [CATEGORY_KINDS.ITEM, ITEM_CATEGORIES],
    [CATEGORY_KINDS.SERVICE, SERVICE_CATEGORIES],
  ];

  for (const [kind, names] of groups) {
    for (const [index, name] of names.entries()) {
      const wasCreated = await ensureCategory({ name, kind, sortOrder: (index + 1) * 10 });
      if (wasCreated) created += 1;
      else skipped += 1;
    }
  }

  console.log(`Categories created: ${created}, already existed: ${skipped}`);
  await disconnectDB();
}

run().catch(async (err) => {
  console.error('Seeding failed:', err.message);
  await disconnectDB();
  process.exit(1);
});

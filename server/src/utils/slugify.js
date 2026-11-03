export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

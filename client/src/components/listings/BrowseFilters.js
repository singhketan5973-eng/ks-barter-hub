import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const KIND_OPTIONS = [
  ['', 'Things and services'],
  ['item', 'Things'],
  ['service', 'Services'],
];

const SORT_OPTIONS = [
  ['', 'Best match'],
  ['newest', 'Newest first'],
  ['oldest', 'Oldest first'],
];

function flatten(categories, depth = 0) {
  return categories.flatMap((category) => [
    { ...category, depth },
    ...flatten(category.children ?? [], depth + 1),
  ]);
}

function Field({ label, htmlFor, className, children }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function CategoryOptions({ categories }) {
  return categories.map((category) => (
    <option key={category.id} value={category.slug}>
      {'\u2014 '.repeat(category.depth)}
      {category.name}
    </option>
  ));
}

export function BrowseFilters({ values, categories }) {
  const all = flatten(categories);
  const things = all.filter((category) => category.kind === 'item');
  const services = all.filter((category) => category.kind === 'service');

  return (
    <form
      action="/browse"
      method="get"
      role="search"
      className="rounded-card border-line bg-surface grid gap-4 border p-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      <Field label="Search" htmlFor="q" className="sm:col-span-2 lg:col-span-4">
        <Input
          id="q"
          name="q"
          type="search"
          defaultValue={values.q}
          maxLength={100}
          placeholder="Guitar, tutoring, bicycle repair"
        />
      </Field>

      <Field label="Type" htmlFor="kind">
        <Select id="kind" name="kind" defaultValue={values.kind}>
          {KIND_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Category" htmlFor="category">
        <Select id="category" name="category" defaultValue={values.category}>
          <option value="">All categories</option>
          {things.length > 0 && (
            <optgroup label="Things">
              <CategoryOptions categories={things} />
            </optgroup>
          )}
          {services.length > 0 && (
            <optgroup label="Skills and services">
              <CategoryOptions categories={services} />
            </optgroup>
          )}
        </Select>
      </Field>

      <Field label="City" htmlFor="city">
        <Input id="city" name="city" defaultValue={values.city} maxLength={80} placeholder="Pune" />
      </Field>

      <Field label="Sort by" htmlFor="sort">
        <Select id="sort" name="sort" defaultValue={values.sort}>
          {SORT_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>

      <div className="flex items-center gap-4 sm:col-span-2 lg:col-span-4">
        <Button type="submit">Search</Button>
        <Link href="/browse" className="text-primary font-medium underline underline-offset-2">
          Clear filters
        </Link>
      </div>
    </form>
  );
}

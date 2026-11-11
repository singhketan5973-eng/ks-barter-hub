'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/components/auth/AuthProvider';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { SelectField } from '@/components/ui/SelectField';
import { flattenCategories } from '@/lib/categories';
import { applyApiErrors } from '@/lib/form-errors';
import { createListing, updateListing } from '@/lib/listing-api';
import { listingSchema } from '@/lib/validation';

const FIELDS = [
  'kind',
  'category',
  'title',
  'description',
  'wantedInReturn',
  'city',
  'condition',
  'serviceMode',
  'durationMinutes',
  'availability',
];

const KIND_CHOICES = [
  ['item', 'A thing', 'Something you own, such as a book, a bike or a guitar.'],
  [
    'service',
    'A skill or service',
    'Something you can do for someone, such as lessons or repairs.',
  ],
];

const CONDITIONS = [
  ['new', 'New'],
  ['like-new', 'Like new'],
  ['good', 'Good'],
  ['fair', 'Fair'],
];

const SERVICE_MODES = [
  ['remote', 'Online'],
  ['in-person', 'In person'],
  ['either', 'Online or in person'],
];

const toNumber = (value) => (value === '' || value === null ? undefined : Number(value));

function toFormValues(listing, user) {
  if (!listing) {
    return {
      kind: 'item',
      category: '',
      title: '',
      description: '',
      wantedInReturn: '',
      city: user?.city ?? '',
      condition: '',
      serviceMode: '',
      durationMinutes: undefined,
      availability: '',
    };
  }

  return {
    kind: listing.kind,
    category: listing.category?.id ?? '',
    title: listing.title,
    description: listing.description,
    wantedInReturn: listing.wantedInReturn ?? '',
    city: listing.city ?? '',
    condition: listing.condition ?? '',
    serviceMode: listing.serviceMode ?? '',
    durationMinutes: listing.durationMinutes,
    availability: listing.availability ?? '',
  };
}

function buildPayload(values, isEdit) {
  const base = {
    category: values.category,
    title: values.title,
    description: values.description,
    wantedInReturn: values.wantedInReturn,
    city: values.city,
    ...(values.kind === 'item'
      ? { condition: values.condition }
      : {
          serviceMode: values.serviceMode,
          availability: values.availability,
          ...(values.durationMinutes !== undefined && { durationMinutes: values.durationMinutes }),
        }),
  };

  if (isEdit) {
    return base;
  }

  const filled = Object.entries(base).filter(([, value]) => value !== '');
  return { kind: values.kind, ...Object.fromEntries(filled) };
}

export function ListingForm({ mode = 'create', categories, listing }) {
  const { user } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState('');
  const isEdit = mode === 'edit';

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: toFormValues(listing, user),
  });

  const kind = useWatch({ control, name: 'kind' });
  const categoryOptions = flattenCategories(categories).filter(
    (category) => category.kind === kind
  );

  async function onSubmit(values) {
    setFormError('');
    const payload = buildPayload(values, isEdit);
    try {
      const { listing: saved } = isEdit
        ? await updateListing(listing.id, payload)
        : await createListing(payload);
      router.push(`/listings/${saved.id}`);
      router.refresh();
    } catch (err) {
      if (!applyApiErrors(err, setError, FIELDS)) {
        setFormError(err.message);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-6">
      {formError && <Alert variant="danger">{formError}</Alert>}
      {categories.length === 0 && (
        <Alert variant="warning">
          Categories could not be loaded. Reload the page to try again.
        </Alert>
      )}

      {isEdit ? (
        <p className="text-foreground-muted text-sm">
          Type:{' '}
          <span className="text-foreground font-medium">
            {kind === 'item' ? 'A thing' : 'A skill or service'}
          </span>{' '}
          (this cannot be changed)
        </p>
      ) : (
        <fieldset>
          <legend className="mb-2 text-sm font-medium">What are you offering?</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {KIND_CHOICES.map(([value, label, hint]) => (
              <label
                key={value}
                className="rounded-control border-line-strong bg-surface has-[:checked]:border-primary has-[:checked]:bg-primary-soft has-[:focus-visible]:outline-primary flex cursor-pointer items-start gap-3 border p-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2"
              >
                <input
                  type="radio"
                  value={value}
                  className="accent-primary mt-1 size-4"
                  {...register('kind', { onChange: () => setValue('category', '') })}
                />
                <span>
                  <span className="block font-medium">{label}</span>
                  <span className="text-foreground-muted block text-sm">{hint}</span>
                </span>
              </label>
            ))}
          </div>
          {errors.kind && (
            <p role="alert" className="text-danger mt-1.5 text-sm">
              {errors.kind.message}
            </p>
          )}
        </fieldset>
      )}

      <SelectField
        label="Category"
        required
        error={errors.category?.message}
        {...register('category')}
      >
        <option value="">Choose a category</option>
        {categoryOptions.map((category) => (
          <option key={category.id} value={category.id}>
            {'\u2014 '.repeat(category.depth)}
            {category.name}
          </option>
        ))}
      </SelectField>

      <FormField
        label="Title"
        required
        hint="A short, clear name. For example: Acoustic guitar with a soft case."
        error={errors.title?.message}
        {...register('title')}
      />

      <FormField
        label="Description"
        required
        multiline
        rows={6}
        hint="Say what it is, its condition or your experience, and anything the other person should know."
        error={errors.description?.message}
        {...register('description')}
      />

      <FormField
        label="What would you like in return?"
        hint="Optional. Leave it empty if you are open to offers."
        error={errors.wantedInReturn?.message}
        {...register('wantedInReturn')}
      />

      <FormField
        label="City"
        autoComplete="address-level2"
        hint="A town or city is enough. Never share a full address."
        error={errors.city?.message}
        {...register('city')}
      />

      {kind === 'item' ? (
        <SelectField
          label="Condition"
          required
          error={errors.condition?.message}
          {...register('condition')}
        >
          <option value="">Choose a condition</option>
          {CONDITIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </SelectField>
      ) : (
        <>
          <SelectField
            label="How is it provided?"
            required
            error={errors.serviceMode?.message}
            {...register('serviceMode')}
          >
            <option value="">Choose one</option>
            {SERVICE_MODES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>

          <FormField
            label="Time needed (minutes)"
            type="number"
            inputMode="numeric"
            hint="Optional. For example, 60 for one hour."
            error={errors.durationMinutes?.message}
            {...register('durationMinutes', { setValueAs: toNumber })}
          />

          <FormField
            label="Availability"
            hint="Optional. For example, weekday evenings."
            error={errors.availability?.message}
            {...register('availability')}
          />
        </>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? 'Save changes' : 'Post listing'}
        </Button>
        <Link
          href={isEdit ? `/listings/${listing.id}` : '/browse'}
          className="text-primary font-medium underline underline-offset-2"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

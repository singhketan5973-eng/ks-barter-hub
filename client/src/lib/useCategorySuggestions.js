'use client';

import { useEffect, useState } from 'react';
import { suggestCategories } from '@/lib/listing-api';

const DELAY_MS = 700;

export function useCategorySuggestions({ kind, title, description, enabled }) {
  const [state, setState] = useState({ key: '', suggestions: [] });

  const cleanTitle = (title ?? '').trim().slice(0, 120);
  const cleanDescription = (description ?? '').trim().slice(0, 1000);
  const key = `${kind}|${cleanTitle}|${cleanDescription}`;
  const active = Boolean(enabled) && cleanTitle.length >= 3;

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      suggestCategories({
        kind,
        title: cleanTitle,
        ...(cleanDescription && { description: cleanDescription }),
      })
        .then((result) => {
          if (!cancelled) {
            setState({ key, suggestions: result.available ? result.suggestions : [] });
          }
        })
        .catch(() => {
          if (!cancelled) {
            setState({ key, suggestions: [] });
          }
        });
    }, DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [active, key, kind, cleanTitle, cleanDescription]);

  return {
    suggestions: active && state.key === key ? state.suggestions : [],
    loading: active && state.key !== key,
  };
}

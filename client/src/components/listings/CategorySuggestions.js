import { cn } from '@/lib/cn';

export function CategorySuggestions({ suggestions, loading, selectedId, onPick }) {
  if (!loading && suggestions.length === 0) {
    return null;
  }

  return (
    <div aria-live="polite" className="rounded-control bg-primary-soft p-3">
      <p className="text-primary text-sm font-medium">
        {loading ? 'Looking for category suggestions\u2026' : 'Suggested categories'}
      </p>

      {!loading && (
        <>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => {
              const selected = selectedId === suggestion.id;
              return (
                <button
                  key={suggestion.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onPick(suggestion)}
                  className={cn(
                    'rounded-control min-h-11 border px-3 text-left text-sm font-medium',
                    selected
                      ? 'border-primary bg-primary text-on-solid'
                      : 'border-primary bg-surface text-foreground hover:bg-surface-sunken'
                  )}
                >
                  {suggestion.name}
                  {suggestion.recommended && (
                    <span className="ml-2 text-xs font-normal">Best match</span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-foreground-muted mt-2 text-xs">
            Suggestions are automatic and can be wrong. Pick the category that fits best.
          </p>
        </>
      )}
    </div>
  );
}

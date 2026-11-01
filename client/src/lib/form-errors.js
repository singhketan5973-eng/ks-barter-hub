export function applyApiErrors(error, setError, fields) {
  const details = error?.details;
  let applied = false;

  if (details && typeof details === 'object') {
    for (const [key, message] of Object.entries(details)) {
      const field = key.replace(/^body\./, '');
      if (fields.includes(field)) {
        setError(field, { type: 'server', message });
        applied = true;
      }
    }
  }

  return applied;
}

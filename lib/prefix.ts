// src/lib/prefix.ts
export const BP =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.NODE_ENV === 'production' ? '/abuhind' : '');

export const withPrefix = (p: string) => `${BP}${p.startsWith('/') ? p : `/${p}`}`;

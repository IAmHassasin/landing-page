import { getRelativeLocaleUrl } from 'astro:i18n';
import en from './locales/en.json';
import vi from './locales/vi.json';

export const LOCALES = ['en', 'vi'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export type Dictionary = typeof en;

// Typing `vi` against the English shape makes a missing key a compile error;
// scripts/check-i18n.mjs additionally catches extra keys.
const DICTIONARIES: Record<Locale, Dictionary> = { en, vi };

export function toLocale(value: string | undefined): Locale {
  return (LOCALES as readonly string[]).includes(value ?? '') ? (value as Locale) : DEFAULT_LOCALE;
}

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

export function getHomePath(locale: Locale): string {
  return getRelativeLocaleUrl(locale, '');
}

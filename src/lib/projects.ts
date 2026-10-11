import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';

// Promo clips are dropped into public/media/projects/<slug>/ (see docs/PROMO-VIDEOS.md).
const MEDIA_DIR = join(process.cwd(), 'public', 'media', 'projects');
const MEDIA_URL = '/media/projects';

export const PROMO_FILES = {
  mp4: 'promo.mp4',
  webm: 'promo.webm',
  poster: 'poster.webp',
} as const;

export interface PromoMedia {
  mp4: string;
  webm: string | null;
  poster: string | null;
}

export interface Project {
  slug: string;
  data: CollectionEntry<'projects'>['data'];
  entry: CollectionEntry<'projects'>;
  promo: PromoMedia | null;
}

function fileUrl(slug: string, file: string): string | null {
  const path = join(MEDIA_DIR, slug, file);
  return existsSync(path) && statSync(path).size > 0 ? `${MEDIA_URL}/${slug}/${file}` : null;
}

// Resolved at build time: a project shows its clip as soon as the files exist, no code change needed.
export function findPromo(slug: string): PromoMedia | null {
  const mp4 = fileUrl(slug, PROMO_FILES.mp4);
  if (!mp4) return null;
  return { mp4, webm: fileUrl(slug, PROMO_FILES.webm), poster: fileUrl(slug, PROMO_FILES.poster) };
}

export function slugOf(entry: CollectionEntry<'projects'>): string {
  return entry.id.split('/').slice(1).join('/');
}

export async function getProjects(locale: Locale): Promise<Project[]> {
  const entries = await getCollection('projects', (entry) => entry.id.startsWith(`${locale}/`));
  return entries
    .map((entry) => {
      const slug = slugOf(entry);
      return { slug, data: entry.data, entry, promo: entry.data.promo ? findPromo(slug) : null };
    })
    .sort((a, b) => a.data.order - b.data.order);
}

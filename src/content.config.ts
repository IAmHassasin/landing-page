import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const PROJECT_CATEGORIES = ['games', 'ai', 'tools', 'media'] as const;
export const PROJECT_STATUSES = ['live', 'working', 'prototype', 'inProgress'] as const;
export const PROJECT_LINK_KINDS = ['play', 'live', 'repo'] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

// One Markdown file per project and locale: src/content/projects/<locale>/<slug>.md.
// The body is the project description; the promo clip is matched by slug (see docs/PROMO-VIDEOS.md).
const projects = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    category: z.enum(PROJECT_CATEGORIES),
    status: z.enum(PROJECT_STATUSES),
    year: z.string(),
    order: z.number().int(),
    stack: z.array(z.string()).min(1),
    highlights: z.array(z.string()).min(1),
    links: z.array(z.object({ kind: z.enum(PROJECT_LINK_KINDS), url: z.url() })).default([]),
    // false = never show a clip for this project (description only).
    promo: z.boolean().default(true),
  }),
});

export const collections = { projects };

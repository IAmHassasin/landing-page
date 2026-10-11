// Reports which projects have promo clips and flags files that break docs/PROMO-VIDEOS.md.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const PROJECTS_DIR = join(ROOT, 'src', 'content', 'projects', 'en');
const MEDIA_DIR = join(ROOT, 'public', 'media', 'projects');
const LIMITS_BYTES = { 'promo.mp4': 2 * 1024 * 1024, 'promo.webm': 1.5 * 1024 * 1024 };
const FILES = ['promo.mp4', 'promo.webm', 'poster.webp'];

function probeSize(path) {
  try {
    const output = execFileSync(
      'ffprobe',
      [
        '-v',
        'error',
        '-select_streams',
        'v:0',
        '-show_entries',
        'stream=width,height',
        '-of',
        'csv=p=0',
        path,
      ],
      { encoding: 'utf8' },
    );
    const [width, height] = output.trim().split(',').map(Number);
    return { width, height };
  } catch {
    return null;
  }
}

const slugs = readdirSync(PROJECTS_DIR)
  .filter((file) => file.endsWith('.md'))
  .map((file) => file.replace(/\.md$/, ''));
const warnings = [];

for (const slug of slugs) {
  const source = readFileSync(join(PROJECTS_DIR, `${slug}.md`), 'utf8');
  const promoDisabled = /^promo:\s*false\s*$/m.test(source);
  // Same rule as findPromo in src/lib/projects.ts: an empty file counts as missing.
  const present = FILES.filter((file) => {
    const path = join(MEDIA_DIR, slug, file);
    return existsSync(path) && statSync(path).size > 0;
  });
  const label = promoDisabled ? 'no clip (promo: false)' : present.join(', ') || 'none';
  console.log(`${slug.padEnd(24)} ${label}`);

  if (promoDisabled) continue;
  if (!present.includes('promo.mp4'))
    warnings.push(`${slug}: promo.mp4 missing (shows "No signal")`);
  for (const file of present) {
    const path = join(MEDIA_DIR, slug, file);
    const limit = LIMITS_BYTES[file];
    if (limit && statSync(path).size > limit) {
      warnings.push(
        `${slug}/${file}: ${(statSync(path).size / 1048576).toFixed(2)} MB exceeds the limit`,
      );
    }
    if (file.startsWith('promo.')) {
      const size = probeSize(path);
      if (size && size.width !== size.height) {
        warnings.push(`${slug}/${file}: ${size.width}x${size.height} is not square`);
      }
    }
  }
}

if (warnings.length > 0) console.log(`\nWarnings:\n- ${warnings.join('\n- ')}`);

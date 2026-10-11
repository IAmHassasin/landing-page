// Imports rendered promo clips into public/media/projects/<slug>/ (see docs/PROMO-VIDEOS.md).
// Usage: node scripts/import-promos.mjs <source-dir>
// Source files are named "<NN>-<slug>.mp4" (or "<slug>.mp4"); unknown slugs are skipped.
// Each clip is re-encoded to a web MP4 (H.264, faststart, no audio), a VP9 WebM and a WebP poster.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const PROJECTS_DIR = join(ROOT, 'src', 'content', 'projects', 'en');
const MEDIA_DIR = join(ROOT, 'public', 'media', 'projects');
const SIZE = 1080;
const MP4_CRF = '28';
const WEBM_CRF = '40';
// Frame used as the poster: one second in, after the title card has settled.
const POSTER_AT_SECONDS = '1';

const sourceDir = process.argv[2];
if (!sourceDir || !existsSync(sourceDir)) {
  console.error('Usage: node scripts/import-promos.mjs <source-dir>');
  process.exit(1);
}

const knownSlugs = new Set(
  readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, '')),
);

function ffmpeg(args) {
  execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
}

// Keep proportions: fill the square, then centre-crop, so a non-square render is never stretched.
const scale = `scale=${SIZE}:${SIZE}:force_original_aspect_ratio=increase:flags=lanczos,crop=${SIZE}:${SIZE},fps=30`;
const megabytes = (path) => (statSync(path).size / 1048576).toFixed(2);

for (const file of readdirSync(sourceDir).filter((name) => name.endsWith('.mp4'))) {
  const slug = basename(file, '.mp4').replace(/^\d+-/, '');
  if (!knownSlugs.has(slug)) {
    console.warn(`skip ${file}: no project "${slug}"`);
    continue;
  }
  const input = resolve(sourceDir, file);
  const outDir = join(MEDIA_DIR, slug);
  mkdirSync(outDir, { recursive: true });

  const mp4 = join(outDir, 'promo.mp4');
  const webm = join(outDir, 'promo.webm');
  const poster = join(outDir, 'poster.webp');
  ffmpeg([
    '-i',
    input,
    '-an',
    '-vf',
    scale,
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-crf',
    MP4_CRF,
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    mp4,
  ]);
  ffmpeg([
    '-i',
    input,
    '-an',
    '-vf',
    scale,
    '-c:v',
    'libvpx-vp9',
    '-b:v',
    '0',
    '-crf',
    WEBM_CRF,
    '-row-mt',
    '1',
    '-deadline',
    'good',
    '-cpu-used',
    '2',
    webm,
  ]);
  ffmpeg([
    '-ss',
    POSTER_AT_SECONDS,
    '-i',
    mp4,
    '-frames:v',
    '1',
    '-c:v',
    'libwebp',
    '-quality',
    '82',
    poster,
  ]);
  console.log(`${slug.padEnd(24)} mp4 ${megabytes(mp4)} MB · webm ${megabytes(webm)} MB`);
}

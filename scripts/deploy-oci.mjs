// Uploads dist/ to OCI Object Storage under a prefix, with content types and cache headers.
// Configuration comes from the environment or .env.deploy (see .env.deploy.example):
//   OCI_NAMESPACE, OCI_BUCKET, OCI_REGION, DEPLOY_PREFIX
// Usage: npm run deploy:oci            (upload)
//        npm run deploy:oci -- --prune (also delete objects under the prefix that are no longer built)
import { execFile } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative, sep } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const ROOT = join(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const ENV_FILE = join(ROOT, '.env.deploy');
const CONCURRENCY = 6;
const REQUIRED = ['OCI_NAMESPACE', 'OCI_BUCKET', 'OCI_REGION', 'DEPLOY_PREFIX'];

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

// HTML must revalidate so a deploy shows up at once; hashed build assets never change.
function cacheControlFor(key) {
  if (key.endsWith('.html')) return 'no-cache';
  if (key.startsWith('_astro/')) return 'public, max-age=31536000, immutable';
  if (key.startsWith('media/')) return 'public, max-age=604800';
  return 'public, max-age=3600';
}

function loadConfig() {
  const config = { ...process.env };
  if (existsSync(ENV_FILE)) {
    for (const line of readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
      // Surrounding quotes are allowed in .env files and are not part of the value.
      if (match && config[match[1]] === undefined) {
        config[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
      }
    }
  }
  const missing = REQUIRED.filter((name) => !config[name]);
  if (missing.length > 0) {
    throw new Error(`Missing ${missing.join(', ')} (set them in .env.deploy or the environment)`);
  }
  const prefix = config.DEPLOY_PREFIX.replace(/^\/+|\/+$/g, '');
  // The prefix scopes uploads and --prune; never let it widen to the bucket root or climb out.
  if (!/^[A-Za-z0-9._-]+(\/[A-Za-z0-9._-]+)*$/.test(prefix) || prefix.split('/').includes('..')) {
    throw new Error(
      `DEPLOY_PREFIX must be a folder name like "landing" (got "${config.DEPLOY_PREFIX}")`,
    );
  }
  return { ...config, DEPLOY_PREFIX: prefix };
}

function listFiles(dir) {
  // Dotfiles (.gitkeep and the like) are repository plumbing, never site content.
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith('.'))
    .flatMap((entry) => {
      const path = join(dir, entry.name);
      return entry.isDirectory() ? listFiles(path) : [path];
    });
}

// Runs `oci os <command...> <args...>` without a shell, so values with spaces stay intact.
async function oci(command, args, config) {
  // OCI_CLI may point at the executable; .cmd/.bat shims cannot run without a shell.
  const { stdout } = await run(
    config.OCI_CLI || 'oci',
    [
      'os',
      ...command,
      '--namespace-name',
      config.OCI_NAMESPACE,
      '--bucket-name',
      config.OCI_BUCKET,
      ...args,
      '--region',
      config.OCI_REGION,
    ],
    { maxBuffer: 64 * 1024 * 1024 },
  );
  return stdout;
}

async function inBatches(items, worker) {
  const queue = [...items];
  const failures = [];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      for (let item = queue.shift(); item !== undefined; item = queue.shift()) {
        try {
          await worker(item);
        } catch (error) {
          // execFile's message is only "Command failed: ..."; the cause is in stderr.
          const detail = (error.stderr || error.message).trim().split('\n').slice(-3).join(' ');
          failures.push(`${item.key ?? item}: ${detail}`);
        }
      }
    }),
  );
  return failures;
}

async function main() {
  const config = loadConfig();
  const prune = process.argv.includes('--prune');
  if (!existsSync(join(DIST, 'index.html'))) throw new Error('dist/ is missing; run npm run build');

  const files = listFiles(DIST).map((path) => {
    const key = relative(DIST, path).split(sep).join('/');
    const type = CONTENT_TYPES[extname(path).toLowerCase()];
    if (!type) throw new Error(`No content type for ${key}; add its extension to CONTENT_TYPES`);
    return { path, key, type, objectName: `${config.DEPLOY_PREFIX}/${key}` };
  });

  console.log(
    `Uploading ${files.length} files to ${config.OCI_BUCKET}/${config.DEPLOY_PREFIX}/ (${config.OCI_REGION})`,
  );
  let done = 0;
  const upload = async (file) => {
    await oci(
      ['object', 'put'],
      [
        '--name',
        file.objectName,
        '--file',
        file.path,
        '--content-type',
        file.type,
        '--cache-control',
        cacheControlFor(file.key),
        '--force',
      ],
      config,
    );
    done += 1;
    if (done % 20 === 0 || done === files.length) console.log(`  ${done}/${files.length}`);
  };
  // Assets first, HTML last: live pages never reference files that are not uploaded yet,
  // and a failed asset upload stops the deploy before any page changes.
  const assets = files.filter((file) => !file.key.endsWith('.html'));
  const pages = files.filter((file) => file.key.endsWith('.html'));
  for (const group of [assets, pages]) {
    const failures = await inBatches(group, upload);
    if (failures.length > 0) throw new Error(`Upload failed for:\n- ${failures.join('\n- ')}`);
  }

  if (prune) {
    // The CLI prints nothing at all when the prefix holds no objects.
    const output = await oci(
      ['object', 'list'],
      ['--prefix', `${config.DEPLOY_PREFIX}/`, '--all'],
      config,
    );
    const listing = output.trim() ? JSON.parse(output) : { data: [] };
    const built = new Set(files.map((file) => file.objectName));
    const stale = (listing.data ?? [])
      .map((object) => object.name)
      .filter((name) => !built.has(name));
    console.log(`Pruning ${stale.length} stale object(s)`);
    const pruneFailures = await inBatches(stale, (name) =>
      oci(['object', 'delete'], ['--object-name', name, '--force'], config),
    );
    if (pruneFailures.length > 0)
      throw new Error(`Prune failed for:\n- ${pruneFailures.join('\n- ')}`);
  }
  console.log('Upload complete.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

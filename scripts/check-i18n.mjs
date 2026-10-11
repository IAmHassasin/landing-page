// Fails when locale files do not share exactly the same keys, contain empty strings,
// or a project content file exists in one locale but not the other.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const LOCALES_DIR = join(import.meta.dirname, '..', 'src', 'i18n', 'locales');
// Keep in sync with LOCALES in src/i18n/index.ts.
const EXPECTED_LOCALES = ['en', 'vi'];
const REFERENCE_LOCALE = 'en';

function flatten(value, prefix = '') {
  if (typeof value !== 'object' || value === null) {
    return { [prefix]: value };
  }
  return Object.entries(value).reduce(
    (acc, [key, child]) => ({ ...acc, ...flatten(child, prefix ? `${prefix}.${key}` : key) }),
    {},
  );
}

const missingFiles = EXPECTED_LOCALES.filter(
  (locale) => !existsSync(join(LOCALES_DIR, `${locale}.json`)),
);
if (missingFiles.length > 0) {
  console.error(`i18n check failed: missing locale file(s): ${missingFiles.join(', ')}`);
  process.exit(1);
}

const locales = Object.fromEntries(
  EXPECTED_LOCALES.map((locale) => [
    locale,
    flatten(JSON.parse(readFileSync(join(LOCALES_DIR, `${locale}.json`), 'utf8'))),
  ]),
);

const referenceKeys = new Set(Object.keys(locales[REFERENCE_LOCALE]));
const problems = [];

for (const [locale, entries] of Object.entries(locales)) {
  const keys = new Set(Object.keys(entries));
  for (const key of referenceKeys) {
    if (!keys.has(key)) problems.push(`${locale}: missing key "${key}"`);
  }
  for (const key of keys) {
    if (!referenceKeys.has(key)) problems.push(`${locale}: extra key "${key}"`);
    if (typeof entries[key] !== 'string' || entries[key].trim() === '') {
      problems.push(`${locale}: key "${key}" must be a non-empty string`);
    }
  }
}

// Every project needs a content file in each locale.
const PROJECTS_DIR = join(import.meta.dirname, '..', 'src', 'content', 'projects');
const projectSlugs = Object.fromEntries(
  EXPECTED_LOCALES.map((locale) => {
    const dir = join(PROJECTS_DIR, locale);
    return [locale, existsSync(dir) ? readdirSync(dir).filter((file) => file.endsWith('.md')) : []];
  }),
);
for (const [locale, files] of Object.entries(projectSlugs)) {
  for (const other of EXPECTED_LOCALES) {
    for (const file of projectSlugs[other]) {
      if (!files.includes(file))
        problems.push(`projects/${locale}: missing ${file} (exists in ${other})`);
    }
  }
}

if (problems.length > 0) {
  console.error(`i18n check failed:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}

console.log(
  `i18n check passed: ${Object.keys(locales).join(', ')} (${referenceKeys.size} keys, ${projectSlugs[REFERENCE_LOCALE].length} projects)`,
);

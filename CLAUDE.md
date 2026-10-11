# hassasin.com landing page

Personal portfolio landing page for Kha Pham (aka Hassasin), served at the apex `hassasin.com`.
Plan and accepted requirements: [docs/PLAN.md](docs/PLAN.md).

## Stack

- Astro 7 (static output) + TypeScript strict
- Plain CSS with design tokens in `src/styles/tokens.css` (no CSS framework)
- Self-hosted fonts via `@fontsource/*`
- `tools/avatar/` — local Python (3.11) pipeline that produces the hero avatar images

## Commands

| Command                | Purpose                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `npm run dev`          | Dev server (use `astro dev --background` for background mode; `astro dev stop` to stop) |
| `npm run check`        | `astro check` (type-check) + i18n key parity check                                      |
| `npm run lint`         | ESLint (check only, never `--fix` in review/CI)                                         |
| `npm run format:check` | Prettier check                                                                          |
| `npm run build`        | Static build to `dist/`                                                                 |
| `npm run media:status` | Report promo clips per project and spec violations                                      |

Run `check`, `lint`, `format:check` and `build` before reporting work as done.

## Conventions

- Source code, comments, identifiers and commit messages are English only.
- **Localization exception (declared):** Vietnamese text is allowed ONLY in localization data files:
  - `src/i18n/locales/vi.json`
  - future content-collection entries under a `vi/` folder (e.g. `src/content/projects/vi/*.md`)

  Never hard-code user-visible strings in components; read them from `src/i18n`.

- Both locales must have identical keys (`npm run check` enforces this).
- Theme: follows the OS (`prefers-color-scheme`) until the visitor toggles; the choice is stored in
  `localStorage` under `hassasin-theme`. The inline script in `BaseLayout.astro` must stay inline to avoid a theme flash.
- Every animation must respect `prefers-reduced-motion`.
- Files `kebab-case` (Astro components `PascalCase.astro`), functions/variables `camelCase`, constants `SCREAMING_SNAKE`.

## Content & media

- Projects: `src/content/projects/<en|vi>/<slug>.md` (schema in `src/content.config.ts`). Every project needs both locales.
- Promo clips: `public/media/projects/<slug>/promo.mp4` (+ optional `promo.webm`, `poster.webp`), picked up at build time.
  Spec and slugs: [docs/PROMO-VIDEOS.md](docs/PROMO-VIDEOS.md). Check with `npm run media:status`.
- Avatar: real photo per theme, built by `tools/avatar/process_avatar.py` into `src/assets/avatar/`.
- Cover: `src/assets/cover/cover-light.*` / `cover-dark.*`, optional.

## Content boundaries

- Do not read company projects under `D:\DevSamurai` (see docs/PLAN.md). Work experience stays at the level of the public CV.
- Unfinished projects are teased only ("Locked Levels"), never described concretely.
- Easy Animation: no screenshots, GIFs or footage of the project; its promo clip is a text-only card.

## Documentation

- https://docs.astro.build — routing, components, content collections, styling, i18n guides.

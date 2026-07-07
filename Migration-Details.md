# Migration Details: Drupal → Astro Static Site

This document maps the previous Drupal 11 build (`../mysite`) to the current
Astro static site (this repo), for anyone who worked on the old site and
needs to find where things live now.

## Platform Summary

| | Old site (`mysite`) | New site (this repo) |
|---|---|---|
| Framework | Drupal 11 (PHP 8.3) | Astro 7 (static output) |
| Database | MariaDB 10.11 | None — no database |
| Local dev | DDEV (Docker) | `astro dev` (Node, no containers) |
| Hosting | Pantheon | Netlify |
| Content editing | Drupal admin UI (nodes, Views, blocks) | Directly editing `.astro`/`.css`/`.js` files in the repo |
| Config management | Drupal CMI (`config/sync/*.yml`) | N/A — no config to sync, everything is code |

There is no CMS anymore. There are no content types, no database, and no
admin login. Every page is a hand-written Astro template committed to git.
Editing site content now means editing a file and pushing a commit rather
than logging into `/user/login` and editing a node.

## Local Development Workflow

**Before (Drupal/DDEV):**
```
ddev start
ddev drush ...
```
Required Docker, DDEV, MariaDB, and a synced database/files.

**Now (Astro):**
```
astro dev --background   # see CLAUDE.md — always run in background mode
astro dev stop
astro dev status
astro dev logs
```
No Docker, no database, no `drush`. `npm install` then `astro dev` is the
entire local setup.

## Deployment Workflow

**Before:** Pantheon workflow — code pushed to a Pantheon environment (dev →
test → live), with `pantheon.yml` controlling the platform. Content lived in
the database, separately from code, and required its own migration/backup
strategy (config export/import via `config/sync/`).

**Now:** Netlify continuous deployment, configured in `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"
```
The workflow is just:
1. Commit changes
2. `git push origin main`
3. Netlify detects the push and automatically builds (`npm run build`) and
   deploys the `dist/` output — no manual "run deploy" step needed.

Because there's no database, there is nothing to sync between environments
— the git repo *is* the entire site state.

## Content Type → Page Mapping

The old site had six Drupal content types (`config/sync/node.type.*.yml`).
None of these exist anymore as structured content — each is now a static
Astro page or a section of one:

| Old Drupal content type | New location |
|---|---|
| `page` (basic pages: About, Divisions, Schedule, Stats landing) | `src/pages/about.astro`, `src/pages/divisions.astro`, `src/pages/schedule.astro`, `src/pages/stats/index.astro` |
| `article` | Not used — no blog/news listing exists on the new site |
| `team` | Hardcoded division cards in `src/pages/divisions.astro` |
| `player` | Not stored on-site; per-division stats now link out to Google Sheets (see below) |
| `esports_card` | Replaced by the `.esports-card` styling (`src/styles/cards.css`) applied to plain `<Image>` elements in `divisions.astro` |
| `team_standing` | Was previously imported from Google Sheets via the custom `rr_stats` Drush command (`ImportStandingsCommand.php`); the new site skips the import step entirely and just links directly to the public Google Sheet from each division's stats page (`src/pages/stats/titans.astro`, `legends.astro`, `challengers.astro`) |

## Theme → `src/` Mapping

The old custom theme `web/themes/custom/rocket_rivals/` (base `stable9`) is
now the entire `src/` directory of this repo. There is no theme/site
distinction anymore — this repo *is* the site.

| Old file | New file |
|---|---|
| `themes/custom/rocket_rivals/css/global.css` | `src/styles/global.css` |
| `themes/custom/rocket_rivals/css/hero.css` | `src/styles/hero.css` |
| `themes/custom/rocket_rivals/css/divisions.css` | `src/styles/divisions.css` |
| `themes/custom/rocket_rivals/css/cards.css` | `src/styles/cards.css` |
| Twig override for page/html layout | `src/layouts/Layout.astro` |
| Twig override for branding block (hero logo + gradient title) | Hardcoded markup inside `src/layouts/Layout.astro` |
| Twig override for main menu (`.hero-nav`, Discord button detection) | `navLinks` array + static Discord link, hardcoded in `src/layouts/Layout.astro` |

New CSS files with no Drupal equivalent (built for sections that didn't
exist on the old site, or that were previously inline/Views-generated
markup): `src/styles/footer.css`, `src/styles/format.css`,
`src/styles/merch.css`, `src/styles/schedule.css`.

The Drupal main menu (5 items: About, Divisions, Stats, Schedule, Join Our
Discord) is now a plain array (`navLinks`) at the top of
`src/layouts/Layout.astro` — adding/removing a nav item means editing that
array directly instead of the Drupal Menu UI.

## Custom Module → Script Mapping

`web/modules/custom/rr_background/` (particle canvas background + Twitch
embed + live badge) has been split up as follows:

| Old file | New file | Status |
|---|---|---|
| `js/rr_background.js` (particle canvas, was attached via `hook_page_attachments()` to 8 specific routes) | `src/scripts/rr_background.js` | Ported. No route allowlist needed — it's loaded directly by `Layout.astro` and runs on every page. |
| `js/rr_bg_toggle.js` | `src/scripts/rr_bg_toggle.js` | Ported as-is. |
| `TwitchEmbedBlock.php` (server-side block plugin computing `parent=` via `\Drupal::request()->getHost()`) | Lazy-load logic in `src/scripts/schedule.js` | Reimplemented client-side — `parent=` is now set from `window.location.hostname` in the browser instead of a PHP block plugin. |
| `js/rr_live_status.js` (polled a custom `/rr/stream-status` Drupal route every 60s to show a LIVE badge) | **Not migrated.** | The `#rr-live-status` placeholder `<div>` still exists in `src/layouts/Layout.astro:58`, but there is no static-site equivalent of the backend endpoint it depended on, so the badge currently never populates. Needs a replacement data source (e.g. a scheduled Netlify function hitting the Twitch API) if this feature should come back. |

`web/modules/custom/rr_stats/` (Drush command importing standings from
Google Sheets into `team_standing` nodes) has no equivalent — the new site
doesn't import data at all; it links straight to the Google Sheets
themselves from the stats pages.

## Contrib Modules/Themes With No Migration Path

These were Drupal-ecosystem tooling with no meaning on a static site, and
were simply dropped rather than replaced:

- `views_bootstrap`, `block_class`, `gin_toolbar`, `devel`, `cva`,
  `ckeditor5_plugin_pack`, `ckeditor5_premium_features` — all editorial/admin
  UI tooling, irrelevant with no CMS backend.
- `google_analytics` — was enabled in Drupal config
  (`config/sync/core.extension.yml`); no equivalent analytics snippet has
  been added anywhere in `src/`. If analytics tracking is still wanted,
  it needs to be added fresh (e.g. a `<script>` in `Layout.astro`).
- Themes `mercury`, `bootstrap`, `gin` — admin/base themes, not used since
  there's no admin UI.

## Images & Assets

Old: managed as Drupal file/media entities, referenced through Views/fields,
served from `sites/default/files/`.

New: plain files under `src/assets/images/`, imported directly in each
`.astro` file and rendered through Astro's built-in `<Image>` component
(`astro:assets`), which handles resizing/format conversion (webp) and
`width`/`height` output at build time. Files that need to be served
unprocessed and at a fixed URL (favicons, `robots.txt`, etc.) go in
`public/` instead — see the favicon files added in this repo's
`public/favicon-32.png`, `public/favicon-16.png`, `public/apple-touch-icon.png`.

## Summary of What Changes Day-to-Day

- **Adding/editing a page:** edit or add a `.astro` file under `src/pages/`
  (routing is file-based — no menu/URL alias admin UI).
- **Styling:** edit the relevant file in `src/styles/`.
- **Interactive behavior:** edit the relevant file in `src/scripts/`.
- **Updating stats/standings:** update the linked Google Sheet directly —
  there is no import step anymore.
- **Publishing:** commit and `git push origin main`; Netlify builds and
  deploys automatically. No environment promotion, no config export/import,
  no database.

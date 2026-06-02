# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Galego is a Duolingo-style PWA for learning Galician (Galego) from English. It is a **zero-build vanilla HTML/JS/CSS** app — no bundler, no framework, no package.json. All JS uses native ES modules (`<script type="module">`).

## Development

Serve locally with any static file server:
```bash
python3 -m http.server 8000
# or
npx serve .
```

The service worker (`sw.js`) uses a cache-first strategy and must be updated (bump `CACHE_NAME` version) whenever files change, or you'll serve stale content during development. Use an incognito window or disable the service worker in DevTools to avoid caching issues.

The Cloudflare Worker for cloud sync lives in `worker/`. Deploy with:
```bash
cd worker && npx wrangler deploy
```

There is no test suite, linter, or build step.

## Architecture

### Screen Navigation
Single-page app with four screens managed by `js/app.js`:
- **login** — username/password auth (auto-creates accounts on first login)
- **home** — unit list with progress rings
- **unit** — lesson dots, grammar tips, start button
- **lesson** — exercise engine with progress bar, check/continue flow

`navigate(screenId, params)` hides/shows screen elements and calls the appropriate render function. All screens are defined in `index.html` as `<main id="screen-{name}">` elements.

### State & Sync (`js/state.js`)
- All progress stored in `localStorage` under key `galego_state_v2`
- State shape: `{ lessonScores: { "unit-1/lesson-1": { score, bestScore, completedAt, attempts } }, currentLesson }`
- Cloud sync via Cloudflare Worker (`SYNC_API_URL`): debounced push on every save, pull on login/init
- Merge strategy: keeps best score, latest timestamp, highest attempts
- Clipboard-based transfer (export/import) as offline backup using base64-encoded JSON with `GALEGO:` prefix

### Exercise Engine (`js/exercises.js`)
- Exercise types: `translate` (free-text), `multipleChoice`, `fillBlank`, `matching`, `listenType`, `listenChoose`
- Answer normalization strips accents, expands English contractions, ignores punctuation
- Near-miss detection via Levenshtein distance — prompts retry instead of marking wrong
- Wrong answers get re-queued for a second attempt
- Audio uses Web Speech API with voice priority: Galician > Portuguese > Spanish

### Course Data (`js/data/`)
- `course.js` — unit definitions (12 units, A1 through B1) with metadata, grammar tips, and lesson ID lists
- `exercises.js` — master index that re-exports from chunk files
- `exercises_u{N}u{M}.js` — exercise data split into pairs of units (u1u2, u3u4, etc.)
- Each lesson ID maps to an array of exercise objects

### Cloud Sync Worker (`worker/galego-sync-worker.js`)
Cloudflare Worker with KV storage. Three endpoints:
- `POST /login` — authenticate (auto-register on first use) and return progress
- `POST /save` — save progress (requires username + passwordHash)
- `GET /health` — health check

### CSS
Design-system-first approach split across four files:
- `design-system.css` — variables, tokens, base resets
- `layout.css` — screen layouts, nav, settings panel
- `components.css` — buttons, cards, modals, progress rings
- `exercises.css` — exercise-specific styles

### Service Worker (`sw.js`)
Cache-first with a precache list. The `CACHE_NAME` version string controls cache invalidation — increment it when deploying changes.

## Key Conventions

- All lessons are always accessible (no hard locks), but non-recommended ones show a skip-ahead warning
- Lesson dots support long-press (mobile) and right-click (desktop) for mark-as-done/reset context menu
- Session stored in `localStorage` as `galego_session` with `{ username, passwordHash }` (SHA-256 client-side hash)
- The app language is English for UI, Galician for taught content

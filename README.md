# DynamicRope — Documentation Site

Public documentation site for the **DynamicRope** Unreal Engine 5.5–5.8 plugin, intended to be linked
from the Fab marketplace listing (`DocsURL`). Built with **Vite + React**.

## Develop

```sh
npm install
npm run dev      # http://localhost:5173
```

## Build & preview

```sh
npm run build    # outputs to dist/
npm run preview
```

## Structure

```
src/
  App.jsx              # routes: / (landing) and /docs/* (docs layout)
  main.jsx             # HashRouter entry (static-host friendly)
  components/          # Header, Sidebar, Footer, doc primitives (CodeBlock, Callout, PropTable)
  pages/               # Home.jsx (landing), DocPage.jsx (renders a doc by slug)
  data/
    nav.js             # PLUGIN metadata + sidebar structure + page order
    features.js        # landing feature cards
    docs.jsx           # doc page content, keyed by slug  ← edit copy here
  styles/global.css    # dark theme
```

## Editing content

- **Add / edit a doc page:** add an entry to `src/data/docs.jsx` and register its slug in
  `DOC_NAV` in `src/data/nav.js`.
- **Landing features:** `src/data/features.js`.
- **Plugin metadata / URLs:** `PLUGIN` in `src/data/nav.js`.

## Before publishing (TODO)

- [ ] Fill in `PLUGIN.fabUrl` and `PLUGIN.supportEmail` in `src/data/nav.js`.
- [ ] Replace the hero visual placeholder in `src/pages/Home.jsx` with a gameplay clip / screenshot.
- [ ] Add real screenshots to the Quick Start and Concepts pages.
- [ ] Re-check `PLUGIN.engineVersions` in `src/data/nav.js` against the versions actually shipped on Fab.
- [ ] Set `base` in `vite.config.js` if deploying under a subpath (e.g. GitHub Pages).

## Deploy

Any static host works (Vercel, Netlify, GitHub Pages, Cloudflare Pages). The app uses `HashRouter`,
so no server-side rewrite rules are needed. Point the Fab listing's **DocsURL** at the deployed site.

// Vite rewrites asset paths for `base` in index.html and in anything it bundles,
// but a path written as a plain string in a data file is invisible to it. This
// site sets base to '/DynamicRopeDocs/' for GitHub Pages, so a literal
// '/media/throw.webp' would resolve against the domain root and 404 in
// production while working fine in a root-served dev build — the worst kind of
// break, since it only appears once deployed.
//
// Every runtime reference to something in public/ goes through here instead.
// Write media paths without a leading slash ('media/throw.webp'); this adds the
// base. A leading slash is tolerated so an old-style path still resolves.
export function asset(path) {
  if (!path) return path
  // Already absolute (CDN, data URI): leave it alone.
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:')) return path
  // BASE_URL always ends in a slash, so the path must not start with one.
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}

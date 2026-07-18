import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site is served from https://<user>.github.io/<repo>/,
// so assets must be requested under that subpath.
// ▸ If your repository is NOT named "DynamicRopeDocs", change this to '/<your-repo>/'.
//   (User/org site or custom domain → set it back to '/'.)
export default defineConfig({
  plugins: [react()],
  base: '/DynamicRopeDocs/',
})

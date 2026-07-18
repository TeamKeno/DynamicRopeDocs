// Central metadata for the plugin. Fill in URLs before publishing to Fab.
export const PLUGIN = {
  name: 'DynamicRope',
  tagline: 'Throwable rope that flies, wraps around bones, and pulls.',
  version: '1.0',
  engine: 'Unreal Engine 5.7',
  author: 'Team Keno',
  fabUrl: '#', // TODO: Fab listing URL
  supportEmail: 'support@example.com', // TODO
}

// Sidebar structure for the /docs section. Each `slug` maps to a doc page.
export const DOC_NAV = [
  {
    group: 'Getting Started',
    items: [
      { slug: 'overview', title: 'Overview' },
      { slug: 'installation', title: 'Installation' },
      { slug: 'quick-start', title: 'Quick Start' },
    ],
  },
  {
    group: 'Concepts',
    items: [
      { slug: 'phase-model', title: 'Phase State Machine' },
      { slug: 'collision', title: 'Collision & Wrapping' },
      { slug: 'gpu-solver', title: 'GPU Solver' },
    ],
  },
  {
    group: 'Reference',
    items: [
      { slug: 'components', title: 'Components' },
      { slug: 'settings', title: 'Settings & Config' },
      { slug: 'faq', title: 'FAQ & Troubleshooting' },
    ],
  },
]

// Flat lookup + ordered list for prev/next navigation.
export const DOC_ORDER = DOC_NAV.flatMap((g) => g.items.map((i) => i.slug))

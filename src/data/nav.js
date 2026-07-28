// Central metadata for the plugin. Fill in URLs before publishing to Fab.
export const PLUGIN = {
  name: 'DynamicRope',
  tagline: 'Throwable rope that flies, wraps around bones, and pulls.',
  version: '1.0',
  engine: 'UE 5.5 – 5.8',
  engineVersions: ['5.5', '5.6', '5.7', '5.8'],
  platforms: 'Windows (Win64)',
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
      { slug: 'resolve-modes', title: 'Wrap Resolve Modes' },
      { slug: 'phase-model', title: 'Phase State Machine' },
      { slug: 'collision', title: 'Collision & Wrapping' },
      { slug: 'hold-pull', title: 'Hold, Pull & Tether' },
      { slug: 'gpu-solver', title: 'GPU Solver' },
    ],
  },
  {
    group: 'Guides',
    items: [
      { slug: 'aiming', title: 'Aiming, Preview & Tip' },
      { slug: 'presets', title: 'Presets' },
      { slug: 'ragdoll', title: 'Ragdoll Response' },
      { slug: 'sdf-authoring', title: 'SDF Authoring' },
      { slug: 'debugging', title: 'Debugging & Profiling' },
    ],
  },
  {
    group: 'Reference',
    items: [
      { slug: 'components', title: 'Components' },
      { slug: 'settings', title: 'Configuration Reference' },
      { slug: 'blueprint-api', title: 'Blueprint API & Events' },
      { slug: 'extending', title: 'Extending in C++' },
      { slug: 'faq', title: 'FAQ & Troubleshooting' },
    ],
  },
]

// Flat lookup + ordered list for prev/next navigation.
export const DOC_ORDER = DOC_NAV.flatMap((g) => g.items.map((i) => i.slug))

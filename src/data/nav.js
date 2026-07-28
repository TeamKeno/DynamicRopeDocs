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
  supportEmail: 'teamkeno0824@gmail.com',
}

// A placeholder address is worse than no address: it publishes a contact route
// that silently goes nowhere. Anything still pointing at example.com counts as
// unset, and the support section and footer link stay hidden until it is real.
export const hasSupportEmail = () =>
  Boolean(PLUGIN.supportEmail) && !PLUGIN.supportEmail.includes('example.com')

// Sidebar structure for the /docs section. Each `slug` maps to a doc page.
export const DOC_NAV = [
  {
    group: 'Getting Started',
    items: [
      { slug: 'overview', title: 'Overview' },
      { slug: 'requirements', title: 'Requirements & Compatibility' },
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
      { slug: 'performance', title: 'Performance & Budgeting' },
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

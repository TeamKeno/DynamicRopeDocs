// Landing-page feature cards. Pulled from the plugin's actual capabilities.
export const FEATURES = [
  {
    icon: '🪢',
    title: 'Throw, Wrap & Hold',
    body: 'A single Throw() call sends the rope flying. On contact it wraps around a skeletal character’s bones, then holds, pulls, or releases — a full gameplay loop out of the box.',
  },
  {
    icon: '⚡',
    title: 'GPU XPBD Solver',
    body: 'Position-based dynamics run on the GPU (RDG compute) for both solve+detect and tube rendering, with an automatic CPU fallback for cook, -nullrhi, and oversized ropes.',
  },
  {
    icon: '🦴',
    title: 'Per-Bone SDF Collision',
    body: 'Collide against analytic bone capsules or baked per-bone signed-distance fields behind one collider interface. The solver is identical either way.',
  },
  {
    icon: '🎯',
    title: 'Cross-Actor Wrapping',
    body: 'A rope owned by actor A can wrap and follow a bone on actor B — pin a rope to a static prop and tether a moving character. Handles mid-wrap mesh destruction safely.',
  },
  {
    icon: '🎮',
    title: 'Enhanced Input Ready',
    body: 'A ready-made wielder component with Enhanced Input bindings and an AnimNotify for throw timing. Drop it on your character and go.',
  },
  {
    icon: '🛠️',
    title: 'Editor Authoring Tools',
    body: 'A dedicated SDF authoring panel, baker, and component visualizers, plus a Gameplay Debugger category to inspect rope state live.',
  },
]

// Landing-page feature cards. Pulled from the plugin's actual capabilities.
export const FEATURES = [
  {
    icon: '🪢',
    title: 'Throw, Wrap & Hold',
    body: 'One component and one Throw() call. The rope flies, wraps around a skeletal character’s bones — or a static prop — then holds, pulls, reels, or releases. A full gameplay loop out of the box.',
  },
  {
    icon: '🎚️',
    title: 'Three Wrap Modes',
    body: 'Pick the contract per rope: Full Simulation guarantees nothing, Assisted guarantees the hit and judges the bind, Guaranteed binds the aimed target without fail. Everything after the wrap is shared.',
  },
  {
    icon: '⚡',
    title: 'GPU XPBD Solver',
    body: 'Position-based dynamics on RDG compute for solve, contact detection and tube building, with rope state resident on the GPU and an automatic CPU fallback for cook, -nullrhi and servers.',
  },
  {
    icon: '🦴',
    title: 'Four Collision Sources, One Interface',
    body: 'Analytic bone capsules, baked per-bone SDFs, swept static world bodies, and the engine Global Distance Field. The solver never knows the difference — and moving surfaces drag the rope with them.',
  },
  {
    icon: '🎯',
    title: 'Cross-Actor & Multi-Bone Wrapping',
    body: 'A rope owned by actor A can wrap and follow a bone on actor B, and a single wrap can span several bones. Mid-wrap destruction of the target releases cleanly instead of crashing.',
  },
  {
    icon: '🎮',
    title: 'Gameplay Ready',
    body: 'Enhanced Input wielder with throw / pull / reel / release, aim HUD and pull gauge widgets, anim notifies for throw and pull windows, and a ragdoll response component for caught characters.',
  },
  {
    icon: '🪝',
    title: 'Constraint-Based Hold',
    body: 'A hard material-length boundary the wielder and the target both respect, an authoritative tension readout for gameplay, armed pull with climb-in when the target is too heavy, and runtime reeling.',
  },
  {
    icon: '🛠️',
    title: 'Authoring & Debugging',
    body: 'An SDF baking panel, preset assets that restamp a whole rope configuration, two Gameplay Debugger categories with per-rope solve-path classification, and C++ automation tests.',
  },
]

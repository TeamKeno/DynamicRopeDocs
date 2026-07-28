// Landing-page feature cards. Pulled from the plugin's actual capabilities.
// One line each — the card grid is for scanning, not for reading. Anything
// that needs a paragraph belongs in SHOWCASE below, next to a clip.
export const FEATURES = [
  {
    icon: '🪢',
    title: 'Throw, Wrap & Hold',
    body: 'One Throw() call runs the whole loop: fly, wrap, hold, pull, release.',
  },
  {
    icon: '🎚️',
    title: 'Three Wrap Modes',
    body: 'Full Simulation, Assisted, or Guaranteed — pick how much the rope may miss.',
  },
  {
    icon: '⚡',
    title: 'GPU XPBD Solver',
    body: 'Position-based dynamics on RDG compute, with an automatic CPU fallback.',
  },
  {
    icon: '🦴',
    title: 'Four Collision Sources',
    body: 'Bone capsules, baked SDFs, swept world bodies, and the Global Distance Field.',
  },
  {
    icon: '🎯',
    title: 'Cross-Actor Wrapping',
    body: 'A rope on actor A follows a bone on actor B, across several bones at once.',
  },
  {
    icon: '🎮',
    title: 'Gameplay Ready',
    body: 'Enhanced Input wielder, HUD widgets, anim notifies, ragdoll response.',
  },
  {
    icon: '🪝',
    title: 'Constraint-Based Hold',
    body: 'A hard length boundary both ends respect, with a tension readout for gameplay.',
  },
  {
    icon: '🛠️',
    title: 'Authoring & Debugging',
    body: 'SDF baking panel, preset assets, Gameplay Debugger categories, automation tests.',
  },
]

/**
 * Full-width showcase rows: prose on one side, a clip on the other, alternating.
 * Grouped two-per-reel-panel so each group gets one scroll gesture.
 *
 * `media` is null until the footage exists — the row then renders a dashed
 * placeholder carrying `mediaHint`, so an empty slot reads as a shot list
 * rather than as a broken image. To fill one in:
 *
 *   media: {
 *     type: 'video',              // 3-6s silent loop, 1280x720, ~1-2MB
 *     webm: '/media/throw.webm',  // VP9
 *     mp4:  '/media/throw.mp4',   // H.264, for Safari
 *     poster: '/media/throw.webp',
 *     alt: 'A rope thrown at a running character wraps its torso.',
 *   }
 *
 *   media: { type: 'image', src: '/media/modes.webp', alt: '...' }
 *
 * Files go in `public/media/`. Please do not use GIF: the same three seconds
 * of gameplay is ~20MB as a GIF and ~1.5MB as VP9.
 */
export const SHOWCASE = [
  {
    id: 'throw-wrap',
    title: 'Throw & wrap',
    items: [
      {
        id: 'core-loop',
        eyebrow: 'The core loop',
        heading: 'Throw it. It wraps. It holds.',
        body:
          'Add one component, call Throw(), and the rope flies, wraps around a skeletal character’s bones — or a static prop — then holds, pulls, reels, or releases.',
        points: ['No rig setup on the target', 'Release is always clean, even mid-wrap'],
        media: null,
        mediaHint: 'Throw → wrap → hold, one continuous take',
      },
      {
        id: 'wrap-modes',
        eyebrow: 'Wrap contracts',
        heading: 'Three modes, one shared aftermath',
        body:
          'Full Simulation guarantees nothing. Assisted guarantees the hit and judges the bind. Guaranteed binds the aimed target without fail. Everything after the wrap is identical.',
        points: ['Set per rope, not per project', 'Swap at runtime for difficulty tuning'],
        media: null,
        mediaHint: 'Same throw in all three modes, side by side',
      },
    ],
  },
  {
    id: 'collide-hold',
    title: 'Collide & hold',
    items: [
      {
        id: 'collision',
        eyebrow: 'Collision',
        heading: 'Four sources, one interface',
        body:
          'Analytic bone capsules, baked per-bone SDFs, swept static world bodies, and the engine Global Distance Field. The solver never knows the difference — and moving surfaces drag the rope with them.',
        points: ['Mix sources on a single rope', 'Swept bodies mean no tunnelling at speed'],
        media: null,
        mediaHint: 'Rope dragged across a moving platform and a bone capsule',
      },
      {
        id: 'hold-pull',
        eyebrow: 'Hold & pull',
        heading: 'A boundary both ends respect',
        body:
          'A hard material-length limit the wielder and the target both obey, an authoritative tension readout for gameplay, armed pull with climb-in when the target is too heavy, and runtime reeling.',
        points: ['Tension drives your own gameplay logic', 'Climb-in when you are outmatched'],
        media: null,
        mediaHint: 'Pull gauge filling, then climb-in on a heavy target',
      },
    ],
  },
  {
    id: 'play-ship',
    title: 'Play & ship',
    items: [
      {
        id: 'gameplay',
        eyebrow: 'Gameplay',
        heading: 'Wired for a real game, not a demo',
        body:
          'An Enhanced Input wielder with throw, pull, reel and release, aim HUD and pull gauge widgets, anim notifies for the throw and pull windows, and a ragdoll response component for caught characters.',
        points: ['Drop-in wielder component', 'Notifies mark the throw and pull windows'],
        media: null,
        mediaHint: 'Full input loop from a player camera, HUD visible',
      },
      {
        id: 'authoring',
        eyebrow: 'Authoring & debugging',
        heading: 'Tune it without guessing',
        body:
          'An SDF baking panel, preset assets that restamp a whole rope configuration in one click, two Gameplay Debugger categories with per-rope solve-path classification, and C++ automation tests.',
        points: ['Presets restamp a whole rope at once', 'Debugger names the solve path per rope'],
        media: null,
        mediaHint: 'Editor capture: baking panel, then the debugger overlay',
      },
    ],
  },
]

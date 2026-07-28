// Landing-page feature cards. Pulled from the plugin's actual capabilities.
// One line each — the card grid is for scanning, not for reading. Anything
// that needs a paragraph belongs in SHOWCASE below, next to a clip.
//
// House rule for both lists: say what the reader gets first, and let the
// machinery follow as evidence. A term like XPBD earns its place by backing a
// claim already made in plain words — it must never be the thing carrying the
// meaning on its own, because a noun list tells a newcomer nothing. Keep the
// terms, though: the buyer here is a UE developer, and they read XPBD or SDF as
// proof there is something real underneath. Their full explanations live in
// /docs, which is where a reader who wants them is heading anyway.
//
// No performance figures. Nothing here has been measured, so "runs on the
// graphics card, off your game thread" is as far as a speed claim may go.
export const FEATURES = [
  {
    icon: '🪢',
    title: 'Throw, Wrap & Hold',
    body: 'One component on the rope, one on what it grabs. Throw() runs the rest.',
  },
  {
    icon: '🎚️',
    title: 'Three Wrap Modes',
    body: 'Decide whether a throw can miss — full physics, assisted, or never fails.',
  },
  {
    icon: '⚡',
    title: 'Solved on the GPU',
    body: 'Simulation runs on the graphics card, off your game thread. XPBD, CPU fallback.',
  },
  {
    icon: '🦴',
    title: 'Wraps Onto Anything',
    body: 'Characters, props, moving platforms — and moving surfaces drag the rope along.',
  },
  {
    icon: '🎯',
    title: 'Cross-Actor Wrapping',
    body: 'Pin a rope to a pillar and it still follows a bone on a running character.',
  },
  {
    icon: '🎮',
    title: 'Input to Ragdoll, Wired',
    body: 'Bind throw and pull to keys, draw an aim reticle, let caught characters go limp.',
  },
  {
    icon: '🪝',
    title: 'A Line That Fights Back',
    body: 'A real length both ends respect, and a number telling you how hard it pulls.',
  },
  {
    icon: '🛠️',
    title: 'See What It’s Doing',
    body: 'An on-screen readout names each rope’s state; presets restamp a whole setup.',
  },
]

/**
 * Full-width showcase blocks: prose on one side, a clip on the other, alternating.
 * One group per reel panel, so a group is what a single scroll gesture reveals.
 * Two blocks is the comfortable size and what the height budget is drawn from;
 * a group may hold one, which simply centres in its panel. Three would overflow.
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
          'Add a component to the rope and one to whatever should be grabbable, then call Throw(). It flies, catches a character’s bones or a prop, and holds — pull it, reel it in, or let go.',
        points: ['No rig work — just mark a target grabbable', 'Let go mid-wrap and it unwinds cleanly'],
        media: null,
        mediaHint: 'Throw → wrap → hold, one continuous take',
      },
      {
        id: 'wrap-modes',
        eyebrow: 'Wrap contracts',
        heading: 'Decide how much a throw can miss',
        body:
          'Full Simulation lets physics decide, and it can whiff. Assisted always connects but judges whether the bind takes. Guaranteed catches what you aimed at. After the catch, all three behave the same.',
        points: ['Set per rope — a boss grapple can differ', 'Swap at runtime to tune difficulty'],
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
        heading: 'It wraps onto whatever you throw it at',
        body:
          'Characters, static props, elevators — the rope treats them all alike, and a moving surface drags it along. That is four collision techniques underneath, picked per rope; the simulation never knows the difference.',
        points: ['Mix techniques on a single rope', 'Nothing tunnels through at speed'],
        media: null,
        mediaHint: 'Rope dragged across a moving platform and a bone capsule',
      },
      {
        id: 'hold-pull',
        eyebrow: 'Hold & pull',
        heading: 'The line goes taut, and both ends feel it',
        body:
          'The rope has a real length. When it runs out neither end can walk through it, and the rope reports how hard it is being pulled. Haul something too heavy and it hauls you in instead.',
        points: ['Tension is a number you can build on', 'Climb in when you are outmatched'],
        media: null,
        mediaHint: 'Pull gauge filling, then climb-in on a heavy target',
      },
    ],
  },
  // Baking sits here rather than with the runtime blocks: it is how the
  // collision in the group above gets made, so it reads as the next step.
  // A group of one is fine — rows are a fixed height, so this block matches
  // every other block and simply centres in its panel.
  {
    id: 'authoring',
    title: 'Author your collision',
    items: [
      {
        id: 'authoring',
        eyebrow: 'Authoring',
        heading: 'Bake collision to the fidelity you want',
        body:
          'Voxel size, precision, detection band, how thin a bone must be before it is skipped — every knob is exposed with its trade-off spelled out. Adjust, hit Bake, and the preview updates. Sharper surface or smaller asset is your call.',
        points: ['One button, with progress you can cancel', 'The asset remembers your last settings'],
        media: null,
        mediaHint: 'Editor: nudge voxel size, hit Bake, preview sharpens',
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
          'Throw and pull are already on input, the aim reticle and pull gauge are already drawn, and the animation windows for the throw and the pull are already marked. Caught characters can go limp on contact.',
        points: ['Drop-in wielder component', 'Notifies mark the throw and pull windows'],
        media: null,
        mediaHint: 'Full input loop from a player camera, HUD visible',
      },
      {
        id: 'debugging',
        eyebrow: 'Debugging',
        heading: 'See why it did that',
        body:
          'When a rope does something you did not expect, an on-screen readout names the state it is in and how it is being solved. Presets restamp an entire rope setup onto another in one click.',
        points: ['Presets restamp a whole rope at once', 'The debugger names how each rope solves'],
        media: null,
        mediaHint: 'Gameplay Debugger overlay during a live throw',
      },
    ],
  },
]

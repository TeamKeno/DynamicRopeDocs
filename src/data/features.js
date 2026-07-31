// Landing-page content. There was a grid of one-line feature cards above this
// list; it was removed because the showcase says the same eight things better,
// beside a clip, and reading both meant the same pitch twice. The two points
// the cards had that the showcase did not — the GPU solver, and a wrap that
// crosses actors — were folded in rather than dropped.
//
// House rule: say what the reader gets first, and let the machinery follow as
// evidence. A term like XPBD earns its place by backing a claim already made in
// plain words — it must never be the thing carrying the meaning on its own,
// because a noun list tells a newcomer nothing. Keep the terms, though: the
// buyer here is a UE developer, and they read XPBD or SDF as proof there is
// something real underneath. Their full explanations live in /docs, which is
// where a reader who wants them is heading anyway.
//
// No performance figures. Nothing here has been measured, so "runs on the
// graphics card, off your game thread" is as far as a speed claim may go.

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
    title: 'Throw & Wrap',
    items: [
      {
        id: 'core-loop',
        eyebrow: 'The core loop',
        heading: 'Throw it. It wraps. It holds.',
        body:
          'Add a component to the rope and one to whatever should be grabbable, then call Throw(). It flies, catches a character’s bones or a prop, and holds — pull it, reel it in, or let go.',
        // "mid-wrap" is a real phase name (see the Presets doc), but it means
        // nothing to someone who has not read the phase model yet, and this is
        // the first panel they see. The docs keep the term; the landing spends
        // four plain words instead.
        points: [
          'Works with your existing skeleton',
          'Let go while it is still wrapping and it unwinds — no snag, no jolt',
        ],
        media: null,
        mediaHint: 'Throw → wrap → hold, one continuous take',
      },
      {
        id: 'wrap-modes',
        eyebrow: 'Resolve modes',
        heading: 'Decide how much a throw can miss',
        body:
          'Full Simulation lets physics decide, and the throw can miss. Assisted always reaches the target but decides whether the wrap holds. Guaranteed catches what you aimed at. After the catch, all three behave the same.',
        points: ['Set per rope — a boss grapple can differ', 'Swap at runtime to tune difficulty'],
        media: null,
        mediaHint: 'Same throw in all three modes, side by side',
      },
    ],
  },
  {
    id: 'collide-hold',
    title: 'Collide & Hold',
    items: [
      {
        id: 'collision',
        eyebrow: 'Collision',
        heading: 'It wraps onto whatever you throw it at',
        body:
          'Characters, static props, elevators — the rope treats them all alike, and a moving surface drags it along. It can even be owned by one actor and wrap a bone on another. Four collision techniques underneath, picked per rope.',
        points: ['A single wrap can span several bones', 'Nothing tunnels through at speed'],
        media: null,
        mediaHint: 'Rope dragged across a moving platform and a bone capsule',
      },
      {
        id: 'hold-pull',
        eyebrow: 'Hold & pull',
        heading: 'The line goes tight, and both ends feel it',
        body:
          'The rope has a real length. When it runs out neither end can walk through it, and the rope reports how hard it is being pulled. Pull something too heavy and it pulls you in instead.',
        points: ['Tension is a number you can build on', 'Climb in when the target is too heavy'],
        media: null,
        mediaHint: 'Pull gauge filling, then climb-in on a heavy target',
      },
    ],
  },
  // Grouped by where the reader is standing, not by how deep the machinery is.
  // Baking and the debugger are both things you open the editor to do; the GPU
  // path and the gameplay wiring are both things that happen while the game is
  // running. An earlier cut paired the GPU solver with baking under "Under the
  // hood" — they are not the same kind of thing, and the title described only
  // one of them, since a bake panel is a tool in your hands rather than
  // something hidden underneath.
  {
    id: 'in-the-editor',
    title: 'In The Editor',
    items: [
      {
        id: 'authoring',
        eyebrow: 'Authoring',
        heading: 'Bake collision to the fidelity you want',
        body:
          'Voxel size, precision, detection band, how thin a bone must be before it is skipped — every knob is exposed with its trade-off spelled out. Adjust, hit Bake, and the preview updates. Sharper surface or smaller asset — you decide.',
        points: ['One button, with progress you can cancel', 'The asset remembers your last settings'],
        media: null,
        mediaHint: 'Editor: nudge voxel size, hit Bake, preview sharpens',
      },
      {
        id: 'debugging',
        eyebrow: 'Debugging',
        heading: 'See why it did that',
        body:
          'When a rope does something you did not expect, an on-screen readout names the state it is in and how it is being solved. Presets copy an entire rope setup onto another in one click.',
        // Bullets carry what the body does not. They used to restate it — the
        // body already says presets copy a setup and that the readout names how
        // a rope solves, so repeating both here bought the reader nothing.
        points: [
          'Six sub-views on hotkeys — flight, wrap, colliders, aim',
          'A second view flags any rope that fell back to the CPU',
        ],
        media: null,
        mediaHint: 'Gameplay Debugger overlay during a live throw',
      },
    ],
  },
  {
    id: 'play-ship',
    title: 'Play & Ship',
    items: [
      {
        id: 'gameplay',
        eyebrow: 'Gameplay',
        heading: 'Wired for a real game, not a demo',
        body:
          'Throw and pull are already on input, the aim crosshair and pull gauge are already drawn, and the throw and the pull are already marked on the animation timeline. Caught characters can go ragdoll on contact.',
        points: [
          'One component on the character that holds the rope',
          'Anim notifies fire the throw and open the pull window',
        ],
        media: null,
        mediaHint: 'Full input loop from a player camera, HUD visible',
      },
      {
        id: 'gpu',
        eyebrow: 'Performance',
        heading: 'The whole simulation runs on the GPU',
        body:
          'Solving, contact detection and tube building all happen on the graphics card, and the rope state stays there between frames — so your ropes are not spending game-thread time. Cooking, servers and -nullrhi fall back to CPU on their own.',
        points: ['XPBD solver and tube builder on RDG compute', 'The fallback needs no configuration'],
        media: null,
        mediaHint: 'A crowd of ropes running at once',
      },
    ],
  },
]

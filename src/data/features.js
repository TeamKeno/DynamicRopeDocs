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
 *     type: 'video',             // 3-6s silent loop, 1280x720, ~1-2MB
 *     webm: 'media/throw.webm',  // VP9
 *     mp4:  'media/throw.mp4',   // H.264, for Safari
 *     poster: 'media/throw.webp',
 *     alt: 'A rope thrown at a running character wraps its torso.',
 *   }
 *
 *   media: { type: 'image', src: 'media/modes.webp', alt: '...' }
 *
 * Files go in `public/media/`, and paths here are written **without a leading
 * slash**. The site is served from a subpath (vite.config.js sets base to
 * '/DynamicRopeDocs/'), and Vite cannot rewrite a path that is just a string in
 * a data file — '/media/throw.webp' would resolve against the domain root and
 * 404 once deployed. src/lib/asset.js prepends the base at render time.
 *
 * Please do not use GIF: the same three seconds of gameplay is ~20MB as a GIF
 * and ~1.5MB as VP9. For stills prefer WebP over PNG — a 1280x720 game
 * screenshot is ~1.7MB as PNG and ~120KB as WebP, and there are nine of these.
 * Screenshots carrying small text (the bake panel, the debugger overlay) want
 * quality 90+; lossy WebP smears fine glyphs first.
 */
/**
 * The hero visual, in the same shape as a showcase `media` (see above). Null
 * renders the dashed placeholder carrying HERO_MEDIA_HINT.
 *
 * Keep this to the one arresting moment. The full throw -> wrap -> hold
 * sequence is the core-loop block's job one panel down, and showing it twice
 * spends the hero on something the reader is about to see anyway.
 */
export const HERO_MEDIA = null
export const HERO_MEDIA_HINT = 'A wrapped character being dragged, 3/4 angle'

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
        eyebrow: 'Wrap modes',
        heading: 'Decide how much a throw can miss',
        body:
          'Full Simulation lets physics decide, and the throw can miss. Assisted always reaches the target but decides whether the wrap holds. Guaranteed catches what you aimed at. After the catch, all three behave the same.',
        // "a boss grapple can differ" left the comparison dangling — differ from
        // what? — and "grapple" appears nowhere else here, while the plugin's
        // only use of the word is an elevator cable biting a ceiling anchor.
        // The rule (ResolveMode is a per-component UPROPERTY) is the part a
        // buyer needs, so the bullet states it and lets the body's three modes
        // supply the example.
        points: ['Set per rope, so one game can mix all three', 'Swap at runtime to tune difficulty'],
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
          'Characters, static props, elevators — the rope treats them all alike, and a moving surface drags it along. It can even be owned by one actor and wrap a bone on another. Four collision techniques underneath, picked per target.',
        // "per rope" was wrong: the capsule and SDF providers are components on
        // the target, so the technique is chosen per thing being wrapped, not
        // per rope. "Nothing tunnels" was an absolute guarantee; the mechanism
        // is substep swept CCD, so it says that instead.
        points: [
          'A single wrap can span several bones',
          'Swept contact keeps a fast rope from passing through',
        ],
        media: null,
        mediaHint: 'Rope dragged across a moving platform and a bone capsule',
      },
      {
        id: 'hold-pull',
        eyebrow: 'Hold & pull',
        heading: 'The line goes tight, and both ends feel it',
        body:
          'The rope has a real length. When it runs out neither end can walk through it, and the rope reports how hard it is being pulled. Pull something too heavy and it pulls you in instead.',
        // The second bullet used to be "Climb in when the target is too heavy",
        // which is the body's last sentence said twice. Auto-release is a real
        // setting (TensionReleaseForce / TensionReleaseTime) and is new here.
        points: [
          'Tension is a number you can build on',
          'Set a tension limit and the rope lets go on its own',
        ],
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
        // The notify bullet repeated the body's "marked on the animation
        // timeline". The wrap camera is a shipped opt-in feature the landing
        // never mentioned, so it takes the slot.
        points: [
          'One component on the character that holds the rope',
          'An opt-in camera cuts to the catch for a beat',
        ],
        media: null,
        mediaHint: 'Full input loop from a player camera, HUD visible',
      },
      {
        id: 'gpu',
        eyebrow: 'Performance',
        heading: 'The whole simulation runs on the GPU',
        body:
          'Solving, contact detection and tube building all happen on the graphics card, and the rope state stays there between frames — so your ropes are not spending game-thread time. Cooking, servers, -nullrhi and ropes over the node cap fall back to the CPU on their own.',
        // The node cap belongs in that list. It is the only CPU case that can
        // happen during normal play, and leaving it out let the sentence read
        // as "the CPU path is for cooks and servers" when a big enough rope
        // takes it too. "The fallback needs no configuration" then said "on
        // their own" a second time, so the slot went to the force-CPU toggle.
        points: [
          'XPBD solver and tube builder on RDG compute',
          'One console command forces the CPU path for comparison',
        ],
        media: null,
        mediaHint: 'A crowd of ropes running at once',
      },
    ],
  },
]

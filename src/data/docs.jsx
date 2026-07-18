// Doc page content, keyed by slug. Kept as JSX so code blocks and callouts
// render richly. This is a DRAFT — replace placeholder specifics (exact class
// members, screenshots, video links) with final copy before publishing.
import { CodeBlock, Callout } from '../components/DocPrimitives.jsx'

export const DOCS = {
  overview: {
    title: 'Overview',
    body: (
      <>
        <p>
          <strong>DynamicRope</strong> is a throwable rope for Unreal Engine 5.7. You attach a
          component to an actor and call <code>Throw()</code>; the rope flies, collides, <em>wraps</em>{' '}
          around a skeletal character’s bones, and then holds, pulls, or releases.
        </p>
        <p>
          The design splits behavior in two: <strong>during the wrap the rope is physics-driven</strong>{' '}
          (a position-based XPBD solver), and <strong>after the wrap it becomes data + constraints</strong>{' '}
          driven by lightweight logic classes. That split is the performance core — it keeps a wrapped
          rope cheap even while it follows animation.
        </p>
        <Callout type="info" title="At a glance">
          <ul>
            <li>Engine: Unreal Engine 5.7 (Windows)</li>
            <li>GPU XPBD solver with automatic CPU fallback</li>
            <li>Per-bone capsule or SDF collision behind one interface</li>
            <li>Enhanced Input wielder component included</li>
          </ul>
        </Callout>
      </>
    ),
  },

  installation: {
    title: 'Installation',
    body: (
      <>
        <h2>From Fab</h2>
        <ol>
          <li>Add DynamicRope to your library on Fab and install it to Unreal Engine 5.7.</li>
          <li>
            Open your project, go to <strong>Edit → Plugins</strong>, find <strong>DynamicRope</strong>,
            enable it, and restart the editor.
          </li>
          <li>
            The plugin ships three modules — <code>DynamicRope</code> (runtime),{' '}
            <code>DynamicRopeShaders</code> (GPU path), and <code>DynamicRopeEditor</code> (authoring) —
            and depends on <strong>Enhanced Input</strong>, which the enable step turns on for you.
          </li>
        </ol>
        <h2>Into a C++ project</h2>
        <p>
          To reference the API from C++, add the runtime module to your build dependencies:
        </p>
        <CodeBlock language="csharp" code={`PublicDependencyModuleNames.AddRange(new[]
{
    "DynamicRope",
});`} />
        <Callout type="warn" title="Blueprint-only projects">
          The plugin works from Blueprints without any C++. The wielder component, throw, and pull
          actions are all exposed as Blueprint-callable nodes.
        </Callout>
      </>
    ),
  },

  'quick-start': {
    title: 'Quick Start',
    body: (
      <>
        <p>Get a working throw-and-wrap in a few minutes.</p>
        <ol>
          <li>
            Add a <code>URopeComponent</code> to the actor that owns the rope (a hand socket, a grappling
            device, etc.).
          </li>
          <li>
            Add a <code>URopeWielderComponent</code> to your player character for ready-made Enhanced
            Input bindings (throw / pull / release).
          </li>
          <li>
            Register your target’s bones with a collider provider (<code>URopeBoneCapsuleProvider</code>{' '}
            for analytic capsules, or <code>URopeSDFProvider</code> for baked SDFs).
          </li>
          <li>Call throw and aim at the target.</li>
        </ol>
        <CodeBlock language="cpp" code={`// Minimal C++ throw
URopeComponent* Rope = GetComponentByClass<URopeComponent>();
FRopeThrowParams Params;
Params.Direction = GetActorForwardVector();
Params.Speed = 2200.f; // cm/s
Rope->Throw(Params);`} />
        <Callout type="info" title="Prefer Blueprints?">
          Drop a <strong>Rope Wielder</strong> component on your character, bind the Throw input action,
          and call <strong>Throw</strong> from the graph — no C++ required.
        </Callout>
      </>
    ),
  },

  'phase-model': {
    title: 'Phase State Machine',
    body: (
      <>
        <p>
          Every rope moves through a fixed set of phases. All transitions go through a single{' '}
          <code>SetPhase()</code> path (uniform logging), and the per-throw transient state is dropped
          together on reset.
        </p>
        <CodeBlock language="text" code={`Free → Flight → Contacting → Wrapping → Wrapped → Releasing → Free
└─ physics (solver) ─┘ └────────── logic (data + constraints) ──────────┘`} />
        <ul>
          <li><strong>Free / Flight</strong> — the solver runs; the rope is fully physical.</li>
          <li><strong>Contacting</strong> — contact candidates are scored to decide a capture.</li>
          <li><strong>Wrapping</strong> — a progressive wrap path is built along the bone surface.</li>
          <li><strong>Wrapped</strong> — nodes are frozen in bone-local space and re-placed each frame to follow animation.</li>
          <li><strong>Releasing</strong> — nodes are handed back to the solver.</li>
        </ul>
        <p>
          The rope never ticks itself. A central subsystem drives every registered rope each frame
          (<code>prepare → solve → finalize</code>, solved in parallel across ropes) and gathers all
          colliders once per frame.
        </p>
      </>
    ),
  },

  collision: {
    title: 'Collision & Wrapping',
    body: (
      <>
        <p>
          The solver only ever calls a single collider interface — it never knows whether the collider
          is a capsule, a per-bone SDF, or a world distance field. Providers supply colliders per frame,
          where broad-phase happens.
        </p>
        <h2>The wrap decision</h2>
        <p>
          A wrap is committed only when enough nodes stay in sustained contact with <em>one</em> bone
          for a configured decision time. On commit, contact nodes are frozen into bone-local space and
          re-placed on the skinned bone every frame — so the wrap follows the character’s animation.
        </p>
        <h2>Cross-actor wrap</h2>
        <p>
          Because the contacted skeletal mesh is carried through the contact data, a rope owned by actor
          A can wrap and follow a bone on actor B. If B is destroyed mid-wrap, the rope detects the loss
          and releases instead of dereferencing a dangling mesh.
        </p>
        <Callout type="info" title="Pull response">
          A wrapped rope produces a pull on the hand-side anchor as pure data. The component consumes it
          two ways: a convergent <em>tether</em> that recovers overshoot past the available rope length,
          and an <em>active pull</em> — a constant user-driven force applied while the rope is taut.
        </Callout>
      </>
    ),
  },

  'gpu-solver': {
    title: 'GPU Solver',
    body: (
      <>
        <p>
          GPU is the single runtime path for both solve+detect and tube rendering. It is auto-selected
          whenever a renderable RHI exists (and, for the tube, the ring count is within budget). Otherwise
          the CPU path runs — during cook, under <code>-nullrhi</code>, on a server, or for oversized ropes.
        </p>
        <ul>
          <li>XPBD solve and contact detection run on RDG compute shaders.</li>
          <li>The GPU tube builder emits position, tangent basis, and UVs directly.</li>
          <li>The CPU solver + tube builder are retained as the fallback and as a parity / unit-test reference.</li>
        </ul>
        <Callout type="warn" title="No manual toggles">
          There are no <code>r.DynamicRope.GPUSolver</code> / <code>.GPUTube</code> console variables. Path
          selection is automatic based on the runtime environment.
        </Callout>
      </>
    ),
  },

  components: {
    title: 'Components',
    body: (
      <>
        <p>The public surface you’ll work with most:</p>
        <h2>URopeComponent</h2>
        <p>
          The facade and single integration point. Attach it, call <code>Throw()</code>. It owns the sim
          state, the solver, the per-phase logic, and the phase state machine.
        </p>
        <h2>URopeWielderComponent</h2>
        <p>
          A gameplay wielder with Enhanced Input bindings (throw / pull / release). Add it to a character
          for an out-of-the-box control scheme.
        </p>
        <h2>Collider providers</h2>
        <ul>
          <li><code>URopeBoneCapsuleProvider</code> — one analytic capsule per listed bone each frame (v1 provider).</li>
          <li><code>URopeSDFProvider</code> — serves colliders sampling a baked SDF volume authored in the editor.</li>
        </ul>
        <h2>UAnimNotify_RopeThrow</h2>
        <p>An anim notify to fire the throw at the right animation frame.</p>
        <Callout type="info" title="Draft note">
          Confirm exact public method signatures and Blueprint-exposed properties against the shipping
          headers before publishing this page.
        </Callout>
      </>
    ),
  },

  settings: {
    title: 'Settings & Config',
    body: (
      <>
        <p>
          Project-wide defaults live under <strong>Project Settings → Plugins → Dynamic Rope</strong> and
          persist to <code>DefaultGame.ini</code>. Per-rope config is exposed as Blueprint-editable
          structs on the component:
        </p>
        <ul>
          <li><code>FRopeSolverConfig</code> — substeps, distance / bending / collision constraints.</li>
          <li><code>FRopeWrapConfig</code> — wrap decision thresholds and timing.</li>
          <li><code>FRopeThrowParams</code> — direction, speed, and throw-time presentation.</li>
        </ul>
        <Callout type="info" title="Tether response">
          Set <code>TetherResponse = 0</code> to disable the overshoot-recovery tether while keeping active
          pull.
        </Callout>
      </>
    ),
  },

  faq: {
    title: 'FAQ & Troubleshooting',
    body: (
      <>
        <h2>The rope falls through the character.</h2>
        <p>
          Make sure a collider provider is registered for the target and lists the bones you expect to
          hit. Contact normals must point outward (collider → node); an inverted setup pulls the rope in.
        </p>
        <h2>The rope wraps but doesn’t follow animation.</h2>
        <p>
          The wrap must commit (enough nodes in sustained contact with one bone for the decision time).
          If it releases immediately, loosen the wrap thresholds in <code>FRopeWrapConfig</code>.
        </p>
        <h2>Performance dips with many ropes.</h2>
        <p>
          Ropes solve in parallel and share one collider gather per frame. Keep ring counts within the GPU
          tube budget so ropes stay on the GPU path, and reduce solver substeps if needed.
        </p>
        <h2>Does it work in packaged / dedicated-server builds?</h2>
        <p>
          Yes. The CPU fallback covers cook, <code>-nullrhi</code>, and server contexts where no renderable
          RHI exists.
        </p>
        <Callout type="warn" title="Still stuck?">
          Reach out via the support channel listed on the Fab page.
        </Callout>
      </>
    ),
  },
}

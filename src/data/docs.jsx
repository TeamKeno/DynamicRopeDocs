// Doc page content, keyed by slug. Kept as JSX so code blocks, tables and
// callouts render richly. Content is written against the shipping plugin
// headers (URopeComponent, URopeWielderComponent, the Core/ config structs).
// Still to replace before publishing: screenshots, video links, the Fab URL
// and the support address in nav.js.
import {
  CodeBlock,
  Callout,
  PropTable,
  Names,
  VideoEmbed,
  Figure,
} from '../components/DocPrimitives.jsx'
import { Link } from 'react-router-dom'
import { PLUGIN, hasSupportEmail } from './nav.js'

export const DOCS = {
  overview: {
    title: 'Overview',
    body: (
      <>
        <p>
          <strong>DynamicRope</strong> is a throwable rope for Unreal Engine. You attach a component
          to an actor and throw it; the rope flies, collides, <em>wraps</em> around a skeletal
          character’s bones — or a static prop — and then holds, pulls, reels, or releases.
        </p>
        <p>
          The design splits behavior in two: <strong>during the wrap the rope is physics-driven</strong>{' '}
          (a position-based XPBD solver), and <strong>after the wrap it becomes data + constraints</strong>{' '}
          driven by lightweight logic classes. That split is the performance core — it keeps a wrapped
          rope cheap even while it follows animation every frame.
        </p>

        <h2>Three contracts, one component</h2>
        <p>
          The most important setting on a rope is its <strong>Wrap Mode</strong>. It decides what the
          rope guarantees between the throw and the bind, and everything else — aiming, preview, the
          judgement gates, whether a throw can even start — is derived from it.
        </p>
        <PropTable
          columns={['Mode', 'Guarantees', 'Use for']}
          rows={[
            ['Full Simulation', 'Nothing. Missing is a normal outcome.', 'Sandboxes, physics research'],
            ['Assisted (Judged)', 'The hit is guaranteed, the bind is judged.', 'Combat, skills'],
            ['Guaranteed', 'Binds the aimed target without fail.', 'Demos, scripted sequences, traversal'],
          ]}
        />
        <p>
          Everything <em>after</em> a wrap is established — hold, pull, tether, reel, release — is
          common to all three modes. See <Link to="/docs/resolve-modes">Wrap Resolve Modes</Link>.
        </p>

        <Callout type="info" title="At a glance">
          <ul>
            <li>Engine: Unreal Engine {PLUGIN.engineVersions.join(' / ')} — {PLUGIN.platforms}</li>
            <li>GPU XPBD solver and tube builder on RDG, with automatic CPU fallback</li>
            <li>Up to 512 simulated nodes per rope</li>
            <li>Per-bone capsules, baked per-bone SDFs and static world bodies behind one collider contract, plus the engine Global Distance Field on the GPU path</li>
            <li>Cross-actor wrapping, multi-bone wraps, moving-surface friction</li>
            <li>Enhanced Input wielder component, aim HUD, pull and reel gauges, an opt-in wrap camera, anim notifies</li>
            <li>Preset assets, an SDF authoring panel, and two Gameplay Debugger categories</li>
          </ul>
        </Callout>

        <h2>What ships in the plugin</h2>
        <ul>
          <li>
            <code>DynamicRope</code> (Runtime) — the solver, wrap logic, collision, rendering, the
            component, the central sim subsystem, the gameplay wielder, anim notifies, demo actors and
            the Gameplay Debugger categories.
          </li>
          <li>
            <code>DynamicRopeShaders</code> (Runtime, loads at <code>PostConfigInit</code>) — the GPU
            compute path: the XPBD solver, contact detection and the tube builder on RDG.
          </li>
          <li>
            <code>DynamicRopeEditor</code> (Editor) — SDF authoring: a nomad tab, the{' '}
            <code>URopeSDFData</code> baker, factory and asset definition, plus the preset asset
            tooling and detail customizations.
          </li>
        </ul>
      </>
    ),
  },

  requirements: {
    title: 'Requirements & Compatibility',
    body: (
      <>
        <p>
          Everything on this page is what you would want to know before buying rather than after. Where
          something is not supported it says so plainly.
        </p>

        <h2>Engine</h2>
        <p>
          Unreal Engine {PLUGIN.engineVersions.join(', ')} — built and tested on all four, not only the
          newest.
        </p>

        <h2>Platform</h2>
        <p>
          Developed and tested on <strong>{PLUGIN.platforms}</strong>, and the modules carry a Win64
          platform allow list, so the plugin as shipped builds for Windows only. Nothing in the code is
          inherently Windows-bound — the GPU path is ordinary RDG compute with a CPU fallback behind it
          — but other platforms are untested and excluded from the build as it stands.
        </p>

        <h2>Blueprint or C++</h2>
        <p>
          A rope can be built, thrown, tuned and reacted to entirely from Blueprint. The rope component
          exposes 35 callable functions and five assignable events, the wielder another 33 with six
          events of its own, and the ragdoll response component five more — the throw, the wrap, the
          tension readout, pull, reel and release are all on that surface. See{' '}
          <Link to="/docs/blueprint-api">Blueprint API &amp; Events</Link>.
        </p>
        <p>
          C++ is for extending rather than for using: a new collider source, a new collider provider, or
          hooking the solver directly. That is covered in{' '}
          <Link to="/docs/extending">Extending in C++</Link>.
        </p>

        <h2>Multiplayer</h2>
        <Callout type="warn" title="Single-player only">
          The plugin does not replicate. Rope and wrap state are local to the machine simulating them,
          and on a replicated pawn the wielder’s length constraint deliberately skips simulated proxies
          rather than fighting network smoothing with a locally guessed rope. A remote client will not
          see a correct rope. Plan for single-player, or for a mode where only the local player throws and
          others never need to see it accurately.
        </Callout>

        <h2>What’s included</h2>
        <PropTable
          columns={['Content', 'What it is']}
          rows={[
            ['Demo map', 'A playable level wiring the whole loop to input — throw, wrap, pull, release.'],
            [
              'Stress-test map',
              'A second level for putting many ropes on screen at once. This is the one to measure with — see Performance & Budgeting.',
            ],
            [
              'Sample Blueprints',
              'Worked examples rather than a single showcase actor — a snare, a lever, a pressure plate, an elevator, a helicopter winch, a basket goal and an AI character among them, plus the HUD and level pieces the demo map is assembled from.',
            ],
            ['A baked SDF asset', 'The third-person mannequin, already baked, so the SDF path runs without authoring anything first.'],
            ['Third-person template + throw animations', 'A character to throw from on the first launch.'],
          ]}
        />

        <h2>Automation tests</h2>
        <p>
          The plugin ships its C++ automation tests rather than stripping them — solver, wrap
          controller, SDF sampler, GPU solver, length constraint, traction, wielder lifecycle and
          presets. You can run them against your own engine build to check the plugin before trusting
          it. See <Link to="/docs/debugging">Debugging &amp; Profiling</Link>.
        </p>

        {hasSupportEmail() ? (
          <>
            <h2>Support</h2>
            <p>
              Questions, bugs and feature requests: <a href={`mailto:${PLUGIN.supportEmail}`}>{PLUGIN.supportEmail}</a>.
              A repro — the wrap mode, the phase the rope was in, and what the Gameplay Debugger showed —
              turns most reports around much faster.
            </p>
          </>
        ) : null}
      </>
    ),
  },

  installation: {
    title: 'Installation',
    body: (
      <>
        <h2>Requirements</h2>
        <PropTable
          columns={['Requirement', 'Value']}
          rows={[
            ['Engine', `Unreal Engine ${PLUGIN.engineVersions.join(', ')}`],
            ['Platform', PLUGIN.platforms],
            ['Plugin dependency', 'Enhanced Input (enabled automatically)'],
            ['Project type', 'Blueprint or C++ — both are supported'],
          ]}
        />

        <h2>From Fab</h2>
        <ol>
          <li>
            Add DynamicRope to your library on Fab and install it to your engine version. Each
            supported engine version ({PLUGIN.engineVersions.join(' / ')}) has its own build — install
            the one matching your project.
          </li>
          <li>
            Open your project, go to <strong>Edit → Plugins</strong>, find <strong>DynamicRope</strong>,
            enable it, and restart the editor.
          </li>
          <li>
            Enabling it turns on <strong>Enhanced Input</strong> as well, which the wielder component
            depends on.
          </li>
        </ol>

        <Callout type="info" title="Distance-field collision is opt-in at the project level">
          <code>URopeComponent::bUseWorldGDF</code> is on by default, but it only does anything when the
          project has <strong>Generate Mesh Distance Fields</strong> enabled (Project Settings →
          Rendering). Without it the global-distance-field push-out is a silent no-op; the rest of the
          collision paths are unaffected.
        </Callout>

        <h2>Into a C++ project</h2>
        <p>To reference the API from C++, add the runtime module to your build dependencies:</p>
        <CodeBlock
          language="csharp"
          code={`PublicDependencyModuleNames.AddRange(new[]
{
    "DynamicRope",
});`}
        />
        <p>
          <code>DynamicRope</code> publicly depends on <code>DynamicRopeShaders</code>, so you do not
          need to list the GPU module yourself. Public headers live under{' '}
          <code>DynamicRope/Public/</code>:
        </p>
        <CodeBlock
          language="cpp"
          code={`#include "RopeComponent.h"                       // the facade
#include "Gameplay/RopeWielderComponent.h"         // input + throw/pull/reel
#include "Collision/RopeBoneCapsuleProvider.h"     // analytic bone capsules
#include "Collision/SDF/RopeSDFProvider.h"         // baked per-bone SDF
#include "Collision/RopeWrapTargetComponent.h"     // static props as wrap targets
#include "Preset/RopePreset.h"                     // preset asset
#include "Subsystem/RopeSimSubsystem.h"            // central tick + world-wide events`}
        />

        <Callout type="warn" title="Blueprint-only projects">
          The plugin works from Blueprints without any C++. Throw, pull, reel, release, presets, all
          config structs and every event are exposed as Blueprint nodes.
        </Callout>
      </>
    ),
  },

  'quick-start': {
    title: 'Quick Start',
    body: (
      <>
        <VideoEmbed
          id="HnpPGl45S0U"
          title="DynamicRope quick start walkthrough"
          caption="The same setup as below, start to finish."
        />
        <p>Get a working throw-and-wrap in a few minutes.</p>

        <h2>1. Put a rope on the thrower</h2>
        <ol>
          <li>
            Add a <code>URopeComponent</code> (<em>Rope Component</em>) to your character or actor.
          </li>
          <li>
            Set <strong>Wrap Mode</strong>. Start with <strong>Assisted (Judged)</strong> — it aims for
            you but still judges the bind, which is the most game-like default.
          </li>
          <li>
            Optionally tune <strong>Node Count</strong> (64 by default, max 512) and{' '}
            <strong>Rope Length</strong> (600&nbsp;cm by default).
          </li>
        </ol>

        <h2>2. Add the wielder for input</h2>
        <ol>
          <li>
            Add a <code>URopeWielderComponent</code> to the same character.
          </li>
          <li>
            Point <strong>Rope</strong> at the rope component, <strong>Attach Mesh</strong> at the
            character mesh, and set <strong>Hand Socket</strong> (defaults to <code>hand_r</code>).
          </li>
          <li>
            Assign a <strong>Mapping Context</strong> and the input actions you want:{' '}
            <code>ThrowAction</code>, <code>ReleaseAction</code>, <code>PullAction</code>,{' '}
            <code>ReelInAction</code>, <code>ReelOutAction</code>, <code>ReloadAction</code>. With{' '}
            <strong>Auto Bind Input</strong> on (the default) the component binds them for the local
            player itself.
          </li>
        </ol>

        <h2>3. Make the target wrappable</h2>
        <p>Register a collider provider on whatever the rope should be able to catch:</p>
        <ul>
          <li>
            <strong>Skeletal characters</strong> — add <code>URopeBoneCapsuleProvider</code> and list
            the bones (analytic capsules, cheapest), or <code>URopeSDFProvider</code> with a baked{' '}
            <code>URopeSDFData</code> asset for surface-accurate wraps.
          </li>
          <li>
            <strong>Static props</strong> (poles, beams, hooks) — add{' '}
            <code>URopeWrapTargetComponent</code> so the prop can be wrapped, not just collided with.
          </li>
          <li>
            <strong>The world</strong> — nothing to do. The sim subsystem spawns an{' '}
            <code>ARopeController</code> automatically, and it hosts the static-body provider that
            feeds walls, floors and dynamic platforms into every rope.
          </li>
        </ul>

        <h2>4. Throw</h2>
        <p>
          With the wielder attached, the bound throw input is enough. From code or Blueprint, the
          simplest entry point is <code>Throw()</code> — the rope derives direction from{' '}
          <code>ThrowParams.FrameMode</code>:
        </p>
        <CodeBlock
          language="cpp"
          code={`URopeComponent* Rope = GetOwner()->FindComponentByClass<URopeComponent>();

// Throw parameters live on the component and are edited in the details panel;
// override them in code before throwing if you need to.
Rope->ThrowParams.ThrowSpeed = 2200.f;             // cm/s
Rope->Throw();`}
        />
        <p>
          To aim explicitly — a custom camera, an AI target, a Blueprint-computed direction — build a
          context instead:
        </p>
        <CodeBlock
          language="cpp"
          code={`FRopeThrowContext Ctx = FRopeThrowContext::MakeDefault(*Rope, Rope->ThrowParams);
Ctx.Origin       = HandSocketWorld;
Ctx.FrameForward = (TargetLocation - HandSocketWorld).GetSafeNormal();
Ctx.FrameUp      = FVector::UpVector;
Ctx.ThrowSpeed   = 2200.f;
Rope->ThrowWithContext(Ctx);`}
        />
        <p>
          Every throw — convenience entry point, wielder, or Blueprint — converges on the{' '}
          <code>ResolveThrowContext()</code> hook, which re-orthonormalizes the frame and applies
          fallbacks. Override it once and previews and real throws stay in agreement.
        </p>

        <Callout type="info" title="Using Guaranteed mode?">
          A <strong>Guaranteed</strong> rope can only be thrown from the <code>Loaded</code> phase. It
          enters <code>Loaded</code> automatically on BeginPlay; after a release, call{' '}
          <code>EnterLoaded()</code> (or bind the wielder’s <code>ReloadAction</code>) before throwing
          again. <code>CanThrowNow()</code> is the gate the throw entry and the aim HUD both read.
        </Callout>

        <h2>5. React to the wrap</h2>
        <CodeBlock
          language="cpp"
          code={`Rope->OnRopeWrapped.AddDynamic(this, &AMyChar::HandleWrapped);

void AMyChar::HandleWrapped(const FRopeWrappedEventInfo& Info)
{
    // Info.Bone / Info.Bones / Info.Mesh / Info.AngleDeg / Info.CoverageDeg / Info.AnchorCount
    Rope->SetActivePull(120000.f);   // pull under this tension cap while taut
}`}
        />
      </>
    ),
  },

  'resolve-modes': {
    title: 'Wrap Resolve Modes',
    body: (
      <>
        <p>
          <code>ERopeWrapResolveMode</code> is the rope’s top-level contract: what it guarantees
          between the throw and the bind. It is set per rope (and per preset) as{' '}
          <strong>Wrap Mode</strong>. The rope is the source of truth — the wielder’s aiming and
          throwing behavior is derived from this value, and a Blueprint or AI driving the rope
          directly needs nothing else.
        </p>

        <h2>Full Simulation</h2>
        <p>
          Everything from throw to bind is emergent. No aim assistance, no preview. Missing, grazing
          and falling short of the judgement gates are all normal outcomes. The rope flies through the
          physical <code>Flight</code> phase and contact is discovered by the solver.
        </p>
        <p>Use it for sandboxes, physics toys and research.</p>

        <h2>Assisted (Judged)</h2>
        <p>
          An aim ray locks the target, so <em>the hit</em> is guaranteed — but whether a bind
          establishes is still decided by the judgement gates (wrapped angle and angular coverage). A
          preview may be shown, but it is display only and does not constrain the throw. A failed wrap
          releases normally.
        </p>
        <p>Use it for combat and skills. This is the default.</p>

        <h2>Guaranteed</h2>
        <p>
          The preview committed to at the moment of the throw <em>is</em> the execution path. There is
          no failure once the throw plays out — the rope enters <code>GuidedThrow</code> instead of
          physical <code>Flight</code> and lands in <code>Wrapped</code>.
        </p>
        <ul>
          <li>
            Throwing is only valid from the <code>Loaded</code> phase — the tip is held in hand and the
            rope tube is hidden by default (<code>bShowRopeWhenLoaded</code>).
          </li>
          <li>
            If aiming does not resolve (no target, out of range) the throw is <em>not</em> refused: the
            rope arcs toward the far end of the ray, embeds in nothing, and falls to <code>Free</code>.
          </li>
          <li>
            Automatic releases from tension and distance do not apply; only an explicit release does.
          </li>
          <li>
            Wrap judgement config (<code>FRopeWrapConfig</code>) and whip tuning are greyed out — they
            are meaningless for a preview-driven path.
          </li>
          <li>
            Game rules can still break the guarantee by overriding{' '}
            <code>ShouldAbortGuaranteedThrow()</code>, which releases with{' '}
            <code>ERopeReleaseReason::ThrowAborted</code> — distinct from an internal{' '}
            <code>Broken</code> so consumers can tell a designed dodge from an engine failure.
          </li>
        </ul>
        <p>Use it for demos, scripted sequences and traversal.</p>

        <Callout type="info" title="Switching modes at runtime">
          Apply a <code>URopePreset</code> with a different <strong>Wrap Mode</strong>. The rope
          re-aligns its phase for you: a Guaranteed rope enters <code>Loaded</code>, and a rope leaving
          Guaranteed returns to <code>Free</code>. Presets only apply while the rope is in{' '}
          <code>Free</code> or <code>Loaded</code> — see <Link to="/docs/presets">Presets</Link>.
        </Callout>
      </>
    ),
  },

  'phase-model': {
    title: 'Phase State Machine',
    body: (
      <>
        <p>
          Every rope moves through a fixed set of phases (<code>ERopePhase</code>). All transitions go
          through a single <code>SetPhase()</code> path, giving a uniform transition log, and the
          per-throw transient state (tracker, seed, wrapping state, timers) is dropped together on
          reset.
        </p>
        <CodeBlock
          language="text"
          code={`Free -> Flight -> Contacting -> Wrapping -> Wrapped -> Releasing -> Free
|- physics (solver) -|  |------- logic (data + constraints) -------|

Loaded -> GuidedThrow -> Wrapped        (Guaranteed mode only)`}
        />

        <PropTable
          columns={['Phase', 'Driven by', 'What happens']}
          rows={[
            ['Free', 'Solver', 'The rope hangs and swings. Sleeps when it stops moving.'],
            ['Flight', 'Solver', 'The thrown rope flies; the whip guide shapes the swing; contact candidates are collected.'],
            ['Contacting', 'Logic', 'Candidates are re-collected every frame; wrapping starts as soon as the contacts produce a valid wrap seed.'],
            ['Wrapping', 'Logic + solver', 'A surface path is built progressively, the front moves along it, and mass is masked as nodes latch.'],
            ['Wrapped', 'Logic + solver', 'Latched nodes are frozen in bone-local space and re-placed on the skinned bone each frame; free stretches still solve.'],
            ['GuidedThrow', 'Logic', 'Guaranteed mode only. Follows the committed preview path (or an arc into open space).'],
            ['Releasing', 'Logic', 'Nodes are handed back to the solver.'],
            ['Loaded', 'Logic', 'Guaranteed mode only. Tip held in hand, ready to throw.'],
          ]}
        />

        <h2>The rope never ticks itself</h2>
        <p>
          <code>URopeSimSubsystem</code> (a world subsystem) drives every registered rope each frame
          and gathers all colliders once per frame for all of them:
        </p>
        <ul>
          <li>
            <strong>Prepare</strong> (game thread) — produces solve <em>inputs</em>: pin targets, whip
            targets, the logic phases, node overrides, and the decision of whether to solve at all.
          </li>
          <li>
            <strong>Solve</strong> (parallel across ropes, or one GPU dispatch) — touches only POD sim
            state and const colliders. No UObject access, no events, no transitions.
          </li>
          <li>
            <strong>Finalize</strong> (game thread) — consumes solve <em>outputs</em>: flight contact
            detection (which needs the node movement path), transitions, event broadcasts, the render
            push and debug capture.
          </li>
        </ul>

        <h2>Release reasons</h2>
        <p>
          <code>OnRopeReleased</code> carries an <code>ERopeReleaseReason</code>. It fires for aborts
          before a wrap was established too, in which case the bone can be <code>None</code>.
        </p>
        <PropTable
          columns={['Reason', 'Cause']}
          rows={[
            ['Manual', 'Gameplay called ReleaseWrap().'],
            ['Distance', 'Hand-to-anchor distance exceeded the available length plus DistanceReleaseSlack.'],
            ['Tension', 'The constraint tension (GetConstraintTension) stayed above TensionReleaseForce for TensionReleaseTime.'],
            ['Broken', 'Internal cause — target lost, wrap failed, aborted during contact or wrapping.'],
            ['Cut', 'Gameplay called CutRope().'],
            ['ThrowAborted', 'A game rule broke a Guaranteed throw via ShouldAbortGuaranteedThrow().'],
          ]}
        />
      </>
    ),
  },

  collision: {
    title: 'Collision & Wrapping',
    body: (
      <>
        <p>
          Colliders all speak one contract: providers (<code>IRopeColliderProvider</code>) supply{' '}
          <code>IRopeCollider</code> objects per frame — bone capsules, per-bone SDFs, world boxes,
          convex hulls — which is where broad phase happens. The CPU fallback queries that interface
          directly; the GPU path decomposes the same colliders into typed buffers and loops them in the
          kernel. The engine’s Global Distance Field is not a collider at all — it joins the GPU solve
          as a shader permutation.
        </p>

        <h2>Providers</h2>
        <PropTable
          columns={['Provider', 'Serves', 'Notes']}
          rows={[
            [
              <code key="a">URopeBoneCapsuleProvider</code>,
              'One analytic capsule per bone, rebuilt each frame',
              'Cheapest path. Leave Bones empty to build capsules from the physics asset automatically, or list Bones explicitly with CapsuleRadius.',
            ],
            [
              <code key="b">URopeSDFProvider</code>,
              'Baked per-bone signed distance fields',
              'Surface-accurate. Needs a URopeSDFData asset; optional bone filtering via Bone Filter Mode + Bone Filter.',
            ],
            [
              <code key="c">URopeStaticBodyProvider</code>,
              'World boxes, capsules and convex hulls swept from the level',
              'Auto-spawned on an ARopeController. Optionally includes WorldDynamic bodies.',
            ],
            [
              <code key="d">URopeWrapTargetComponent</code>,
              'A static prop as a real wrap target',
              'Auto mode (the default) serves every authored simple-collision shape with a derived axis and radius; manual Shape, Axis and Radius are the escape hatches, and WrapBoneName makes the hold follow a socket.',
            ],
          ]}
        />
        <p>
          Providers register with the sim subsystem on BeginPlay and unregister on EndPlay. Pick the
          provider per target; the solver is identical either way.
        </p>

        <h2>Who collides with whom</h2>
        <p>
          A rope collides with <em>every</em> registered provider <strong>except its own owner’s</strong> —
          so a thrown rope does not tangle on the thrower’s own limbs. The exclusion works two ways:
          skeletal and wrap-target providers are skipped whole, while the static world provider excludes
          per <em>body</em> (tether proxies, tip meshes and held weapons drop out; other actors’ floors
          and pillars stay).
        </p>
        <Callout type="warn" title="Rope mounted on a prop?">
          If you put a <code>URopeComponent</code> on a pillar, crane or anchor actor, turn on{' '}
          <strong>Collide With Owner</strong> (<code>bIncludeOwnerColliders</code>). Otherwise the mount’s
          own collision is excluded as owner-owned and the rope falls straight through it.
        </Callout>

        <h2>Cross-actor wrapping</h2>
        <p>
          The contacted component travels with the contact data, so a rope owned by actor A can wrap and
          follow a bone on actor B — pin a rope to a static prop and tether a moving character. The
          wrapped component is held weakly; if B is destroyed mid-wrap the rope detects the loss and
          releases instead of dereferencing a dangling pointer.
        </p>

        <h2>The wrap decision</h2>
        <p>
          A capture commits as soon as at least <code>MinLatchNodes</code> nodes make real contact with
          one bone and produce a valid wrap seed — there is no dwell timer. From there the wrapping phase
          builds a surface path — an analytic helix, or a surface vector field when the target geometry
          demands it; the geometry picks the strategy, while <code>WrappingAxisSource</code> only says
          where the axis and its measurement frame come from — moves the wrap front along it, and masks
          node mass as anchors latch. On commit, those nodes are frozen into bone-local space and
          re-placed on the skinned bone every frame — so the wrap follows animation.
        </p>
        <p>Two optional quality gates decide whether a commit is accepted at all:</p>
        <ul>
          <li>
            <code>CommitMinWrapAngleDeg</code> — the accumulated wrapped angle must reach this.
          </li>
          <li>
            <code>CommitMinWrapCoverageDeg</code> — the angular coverage about the axis must reach this,
            which answers “is there still a gap to escape through?”
          </li>
        </ul>
        <p>
          Both are 0 (off) by default and both are reported on the wrap event as{' '}
          <code>AngleDeg</code> / <code>CoverageDeg</code>, so you can measure real throws before turning
          the gates on. One gate <em>is</em> on by default: <code>FailedWrapMinAngleDeg</code> (120°)
          releases a wrap whose path build failed below that angle instead of committing it. Multi-bone
          wraps (catching both legs) are enabled by default —{' '}
          <code>bEnableMultiBoneWrapping</code> — and every spanned bone is listed in{' '}
          <code>FRopeWrappedEventInfo::Bones</code>.
        </p>

        <h2>Moving surfaces</h2>
        <p>
          Contacts carry the collider surface’s world velocity at the contact point, and the solver uses
          it for <em>relative</em> tangential friction — a moving body drags and sweeps the rope aside
          rather than letting it stick in world space. Static colliders leave it at zero. With{' '}
          <strong>Include World Dynamic</strong> on (the default), elevators, doors and platforms take
          part, with substep continuous collision preventing tunnelling.
        </p>

        <h2>Global Distance Field</h2>
        <p>
          <code>bUseWorldGDF</code> (on by default) pushes the rope out of static world geometry using the
          engine’s Global Distance Field on the GPU path. It is a broad safety net, not a replacement for
          per-bone SDFs — no bone attribution, no surface velocity. It silently no-ops if the project has
          no mesh distance fields.
        </p>

        <h2>Collider budgets</h2>
        <p>
          The static body provider is bounded so dense scenes cannot blow up the solve. Skeleton colliders
          are always included and ignore these budgets.
        </p>
        <PropTable
          columns={['Project setting', 'Default', 'Meaning']}
          rows={[
            ['Static Body Max Colliders', '256', 'Global per-frame extraction limit — a safety valve, not a normal ceiling.'],
            ['Static Body Max Colliders Per Rope', '32', 'How many world colliders one rope carries into its solve; excess is dropped furthest-first.'],
            ['Static Body Max Convex Planes', '32', 'Convexes above this fall back to the element box OBB.'],
            ['Include World Dynamic', 'On', 'Also collect WorldDynamic bodies (platforms, doors, elevators).'],
            ['Include Physics Bodies', 'Off', 'Also collect simulating physics props as one-way push-out colliders.'],
          ]}
        />
      </>
    ),
  },

  'hold-pull': {
    title: 'Hold, Pull & Tether',
    body: (
      <>
        <p>
          Once a wrap is established, the rope stops being a simulation problem and becomes a{' '}
          <strong>constraint</strong> problem. This page covers everything in{' '}
          <code>FRopeHoldConfig</code> — the post-wrap domain, common to all three wrap modes.
        </p>

        <h2>The length constraint</h2>
        <p>
          The rope enforces a hard material-length boundary between the hand-side anchor and the wrapped
          pivot. It is authoritative from <code>Wrapping</code> through <code>Wrapped</code>, independent
          of tension and of GPU readback.
        </p>
        <ul>
          <li>
            <code>bEnforceWielderLengthConstraint</code> — the wielder cannot walk past the rope’s length.
          </li>
          <li>
            <code>bEnforceTargetLengthConstraint</code> — the wrapped target cannot either. It applies
            only to a CMC-driven kinematic target on a rope whose wielder end is anchored; when both ends
            can move, the constraint already distributes the correction by inverse mass. Ragdoll targets
            are a different mechanism again — an engine physics constraint solved by Chaos alongside the
            joints, rather than a per-frame impulse.
          </li>
          <li>
            <code>TetherCompliance</code> (<em>Rope Elasticity</em>) — 0 is rigid; raise it for a rope
            that gives. Above 0 the hard projections on both ends hand over to the elastic solve.
          </li>
        </ul>
        <p>
          Custom Pawn or Mover implementations can project their own proposed move into the boundary
          right before applying it:
        </p>
        <CodeBlock
          language="cpp"
          code={`FVector Constrained, Normal;
bool bWasConstrained = false;
if (Rope->ConstrainWielderLocation(DesiredPinWorld, Constrained, Normal, bWasConstrained))
{
    DesiredPinWorld = Constrained;   // clamped to the rope's hard length boundary
}`}
        />

        <h2>Tension</h2>
        <p>
          There are two different numbers and they are not interchangeable:
        </p>
        <PropTable
          columns={['Getter', 'What it is', 'Use for']}
          rows={[
            [
              <code key="a">GetConstraintTension()</code>,
              'The gameplay-authoritative material constraint force (λ/dt, kg·cm/s²).',
              'Gameplay load, pull engagement, automatic release.',
            ],
            [
              <code key="b">GetSegmentTension()</code> ,
              'Per-segment XPBD distance λ from the visual solver.',
              'Diagnostics, debug draw, visual effects only.',
            ],
            [
              <code key="c">GetMaxTension()</code>,
              'The maximum segment tension across the chain.',
              'Diagnostics only.',
            ],
          ]}
        />

        <h2>Taut</h2>
        <p>
          <code>IsChainTaut()</code> reports whether the whole chain is geometrically taut this frame;{' '}
          <code>IsPullTaut()</code> is the gate active pull actually uses. A single{' '}
          <strong>Taut Sensitivity</strong> knob [0..1] interpolates both the slack ratio and the maximum
          allowed sag — 0 is forgiving, 1 is strict, 0.5 is the tuned default. Set{' '}
          <code>ActivePullTautTension</code> above 0 to additionally require a load, not just geometry.
        </p>

        <h2>Active pull</h2>
        <p>
          <code>SetActivePull(Force)</code> drives the wrapped target while the rope is taut. For a
          physics body it is a <em>tension-capped velocity drive</em>: the target is driven toward{' '}
          <strong>Pull Speed</strong> along the pull direction, with each frame’s impulse clamped by the
          tension cap — which is what removes the judder and drift a constant force produces. 0 stops it.
        </p>
        <ul>
          <li>
            <code>PullForce</code> (<em>Pull Strength</em>, 100000 by default) is the tension cap.
            Together with the target speed it gives realistic mass dependence: a light target reaches
            Pull Speed at once, one too heavy for the cap lags behind. A character target still takes it
            as a plain force through CharacterMovement.
          </li>
          <li>
            If the target is too heavy or anchored, the pull reverses and drags the <em>wielder</em>{' '}
            toward the anchor instead — climb-in. The decision is a pure, unit-testable function,{' '}
            <code>DecideTargetPullable()</code>, with a hysteresis margin so it cannot flap at the
            boundary.
          </li>
          <li>
            <code>ActivePullMaxLinearSpeed</code> (<em>Pull Speed</em>, 300 cm/s) is the speed the drive
            aims for — at 0 a physics-body pull does nothing at all — and{' '}
            <code>ActivePullMaxAngularSpeed</code> caps residual spin.
          </li>
          <li>
            The wielder’s <code>PullAction</code> is an <strong>armed toggle</strong>: pressing arms it,
            and it engages the moment tension first crosses <code>PullEngageTension</code>, optionally
            playing <code>PullMontage</code> once. <code>GetPullEngageProgress()</code> drives the built-in
            pull gauge widget.
          </li>
          <li>
            <code>UAnimNotifyState_RopePull</code> gives you an animation-driven pull window, with{' '}
            <code>bIgnoreTautGate</code> to force the pull through regardless of slack.
          </li>
        </ul>

        <h2>Reeling</h2>
        <p>
          <code>SetRopeLength(cm)</code> is the immediate form and <code>SetReelRate(cmPerSecond)</code>{' '}
          the held-input form (positive reels in, negative pays out, 0 stops). Length is clamped to{' '}
          <code>[MinRopeLength, RopeLength]</code>; node count stays the same and segment rest lengths
          change uniformly, so both CPU and GPU pick it up the next frame with no reseed. Reeling is
          suspended during <code>Contacting</code>, <code>Wrapping</code> and <code>Releasing</code>,
          because path construction depends on segment length.
        </p>

        <h2>Automatic release</h2>
        <ul>
          <li>
            <code>TensionReleaseForce</code> + <code>TensionReleaseTime</code> — release when the load
            stays above a threshold. 0 disables it.
          </li>
          <li>
            <code>DistanceReleaseSlack</code> — release when overstretched past the available length by
            this much. 0 disables it.
          </li>
        </ul>
        <Callout type="info" title="Guaranteed mode">
          Automatic tension and distance releases do not apply to a <strong>Guaranteed</strong> rope.
          Only an explicit <code>ReleaseWrap()</code> or <code>CutRope()</code> ends it.
        </Callout>

        <h2>Movement feel</h2>
        <p>
          The wielder adds two quality-of-life behaviors on top:{' '}
          <strong>Leave Ground On Upward Pull</strong> (the character leaves the floor when the rope pulls
          it up hard enough) and <strong>Boost Air Control While Swinging</strong>, so a rope swing does not
          feel like a locked ragdoll arc.
        </p>
      </>
    ),
  },

  'gpu-solver': {
    title: 'GPU Solver',
    body: (
      <>
        <p>
          GPU is the single runtime path for solve, contact detection and tube rendering. It is
          auto-selected whenever a renderable RHI at Shader Model 5 or above exists. Otherwise the CPU
          path runs — during cook, under <code>-nullrhi</code>, on a dedicated server, or on a platform
          below SM5.
        </p>
        <ul>
          <li>XPBD solve and contact detection run as RDG compute shaders, with rope state resident on the GPU across frames.</li>
          <li>The GPU tube builder emits position, tangent basis and UVs directly.</li>
          <li>The CPU solver and tube builder are retained as the fallback, and as the parity / unit-test reference.</li>
          <li>The engine Global Distance Field push-out is GPU-path only.</li>
        </ul>

        <h2>Budgets</h2>
        <PropTable
          columns={['Limit', 'Value', 'What happens past it']}
          rows={[
            ['Nodes per rope', '512', 'The editor clamps Node Count; code and Blueprint paths hard-clamp on init.'],
            ['Tube rings', '512', 'The scene proxy automatically lowers Smoothing Subdivisions to fit — a long rope keeps the GPU tube and only loses render smoothing gradually.'],
            ['World colliders per rope', '32 (configurable)', 'Furthest colliders are dropped. The GPU kernel loops colliders per node per substep, so this bounds cost directly.'],
          ]}
        />
        <p>
          Rings are <code>(NodeCount - 1) × SmoothingSubdivisions + 1</code>. Smoothing is render-only
          Catmull-Rom subdivision of the centerline — it never touches the simulation. The knot parameter{' '}
          <code>TubeSmoothingAlpha</code> (0 uniform, 0.5 centripetal, 1 chordal) controls how much the
          interpolated rings can bulge outside the node polyline on sharp corners; CPU and GPU smoothing use
          the same value, so the look is consistent across paths.
        </p>

        <h2>Forcing the CPU path</h2>
        <CodeBlock language="text" code={`r.DynamicRope.ForceCPUSolve 1`} />
        <p>
          This exists for parity checking and for isolating GPU issues — it is not a shipping toggle. There
          are no per-feature <code>GPUSolver</code> / <code>GPUTube</code> switches; path selection is
          otherwise automatic.
        </p>

        <h2>Checking which path a rope took</h2>
        <p>Three C++ getters classify the frame:</p>
        <CodeBlock
          language="cpp"
          code={`Rope->IsGpuSteppedThisFrame();      // dispatched to the GPU (solve OR logic override)
Rope->WasSolvedThisFrame();         // actually took a physics solve step (CPU or GPU)
Rope->HadLogicOverrideThisFrame();  // a logic phase produced node overrides

// CPU fallback solve == WasSolvedThisFrame() && !IsGpuSteppedThisFrame()`}
        />
        <Callout type="warn" title="IsGpuSteppedThisFrame() is not “GPU solving”">
          The subsystem uploads override-only frames (Wrapping / Releasing / GuidedThrow) to the GPU too.
          Read that getter together with the other two, or use the <strong>Rope</strong> Gameplay Debugger
          category, whose <code>solve=</code> line already folds all three into one of SLEEP / GPU_SOLVE /
          GPU_OVERRIDE / CPU_SOLVE / CPU_OVERRIDE / IDLE. <strong>RopePerf</strong> does not draw this
          distinction — it reports only <code>gpu</code> or <code>cpu</code> per rope.
        </Callout>

        <h2>Scaling knobs</h2>
        <p>
          Ropes sleep when they stop moving (<code>bAllowSleep</code>, <code>SleepVelocityThreshold</code>,{' '}
          <code>SleepDelay</code>), and distance LOD scales solver iterations down between{' '}
          <code>LODStartDistance</code> and <code>LODEndDistance</code>, bottoming out at{' '}
          <code>LODMinIterationScale</code>. <code>GetSolverLODScale()</code> and <code>IsSleeping()</code>{' '}
          expose the current state.
        </p>
      </>
    ),
  },

  performance: {
    title: 'Performance & Budgeting',
    body: (
      <>
        <p>
          This page is about where a rope’s cost goes and which dials move it. It closes with one
          measured figure from the stress-test map, spelled out with the machine and the settings that
          produced it — a frame time quoted without those is not something you can plan against, since
          the answer moves with your hardware, your node counts and how many ropes are awake.
        </p>

        <h2>Where the time goes</h2>
        <p>
          In normal play the whole simulation is on the GPU — solve, contact detection and tube building
          — and the rope state stays resident there between frames rather than being uploaded each time.
          The CPU side per rope is the orchestration: gathering colliders once per frame for every rope,
          and the post-wrap logic, which is deliberately data and constraints rather than a solve. A
          wrapped rope following animation is the cheap case by design.
        </p>

        <h2>When it falls back to the CPU</h2>
        <p>
          The fallback is automatic and needs no configuration, but a rope on it costs very differently
          from one on the GPU — so the useful thing is knowing you are on it.
        </p>
        <PropTable
          columns={['Condition', 'What falls back']}
          rows={[
            ['No renderable RHI — cook, -nullrhi, dedicated server', 'Everything. The CPU solver and CPU tube builder take over.'],
            ['Feature level below SM5', 'Everything — the compute path needs Shader Model 5.'],
          ]}
        />
        <p>
          Node and ring counts never trigger a fallback: node count is clamped to 512 at init, and the
          tube automatically steps its smoothing subdivision down — from roughly 170 nodes at a
          subdivision of 3 — so its rings always fit the shader’s 512-ring budget.
        </p>
        <p>
          Do not guess at which path a rope took. The <strong>RopePerf</strong> Gameplay Debugger
          category counts how many ropes are on each path and marks per rope whether it solved on the GPU
          or the CPU, which is the fastest way to catch one that quietly dropped. When you need the exact
          path a single frame took, the <strong>Rope</strong> category names it: SLEEP / GPU_SOLVE /
          GPU_OVERRIDE / CPU_SOLVE / CPU_OVERRIDE / IDLE.{' '}
          <Link to="/docs/debugging">Debugging &amp; Profiling</Link> covers it.
        </p>

        <h2>The dials</h2>
        <PropTable
          columns={['Setting', 'Default', 'What it trades']}
          rows={[
            ['Substeps', '12', 'The main cost multiplier — the number of fixed substeps in one 60 fps frame, so a low frame rate runs more of them to cover the elapsed time (capped at ×1.5). Fewer is cheaper and lets a fast rope stretch or tunnel.'],
            ['Iterations', '4', 'Constraint passes per substep. Fewer is cheaper and softer — the rope holds its length less exactly.'],
            [
              'Node count',
              '64 per rope',
              'Typed in directly (max 512); segment length derives from it as length ÷ (N − 1). It scales everything, and past ~170 nodes the tube starts stepping its smoothing subdivision down to keep rings within budget.',
            ],
            [
              'Allow Sleep',
              'on',
              'An idle Free rope stops solving entirely once every node has stayed under 3 cm/s for half a second; a Wrapped one keeps its hold logic and pauses only the free span’s solve. The single biggest saving in a scene full of ropes that are mostly hanging still.',
            ],
            [
              'Distance LOD',
              'on',
              'Past 3000 cm from the camera, iterations fall off linearly to a quarter of their count by 8000 cm. Convergence error is invisible at that range. With no camera — a dedicated server — iterations stay full.',
            ],
          ]}
        />
        <Callout type="info" title="Contact Solve Interval is not a general dial">
          It appears in the solver config, but it only affects the CPU fallback — the GPU is the single
          runtime path in normal play — and it is not exposed to the Details panel. Useful when you are
          deliberately profiling the fallback with expensive SDF colliders; irrelevant otherwise.
        </Callout>

        <h2>What it costs, measured</h2>
        <p>
          The plugin ships <strong>01_StressTest</strong> for putting a number on this. Below is that
          map with 30 ropes awake at once, every one of them colliding against baked SDFs rather than
          analytic capsules — the expensive collider, chosen deliberately. The rope work costs{' '}
          <strong>1–3 ms of frame time</strong>.
        </p>
        <Figure
          src="media/StressTest.webp"
          width={800}
          height={636}
          alt="Seven seconds of the stress-test map: a character runs through a field of thirty ropes that swing, drag along the floor and settle, with the input legend and a live frame-time readout overlaid."
          caption="01_StressTest — 30 ropes, SDF collision, all of them on the GPU path. The readout in the corner is the whole frame, not the rope work."
        />
        <PropTable
          columns={['Test environment', 'Value']}
          rows={[
            ['Scene', '30 ropes awake, SDF collision, the shipped 01_StressTest map'],
            ['Per rope', '72 nodes — 2,160 simulated nodes across the scene'],
            ['Solver', '12 substeps × 4 iterations, both defaults'],
            ['Engine', 'UE 5.7, Development Editor'],
            ['CPU', 'Intel Core i7-14700'],
            ['GPU', 'NVIDIA GeForce RTX 5060'],
          ]}
        />
        <Callout type="info" title="One machine, one map">
          Take this as a reference point rather than a budget. It is an editor build, not a packaged
          one, and your own scene will differ on all three of the things that matter most — node count,
          how many ropes are awake at once, and whether they collide against SDFs or capsules. Re-run
          the map at your own numbers and hold yourself to what it says there.
        </Callout>

        <h2>Low frame-rate targets</h2>
        <p>
          If your game runs at — or dips to — roughly <strong>40 fps or below</strong>, enable
          fixed-tick physics: <strong>Project Settings → Physics → Framerate → Tick Physics Async</strong>,
          with <strong>Async Fixed Time Step Size = 0.01667</strong> (60&nbsp;Hz).
        </p>
        <p>
          The reason is the ragdoll tether. A ragdolled target is held by a hard Chaos distance
          constraint (see <Link to="/docs/ragdoll">Ragdoll Response</Link>), and at large variable
          physics ticks that constraint oscillates instead of holding — the rope jitters and cannot
          reel the ragdoll in. A fixed 60&nbsp;Hz step keeps tether behavior identical across frame
          rates. The standard async-physics trade-offs apply: physics interactions see about one step
          of extra latency.
        </p>
        <p>
          To see the tether numerically while tuning, use the non-shipping console variable{' '}
          <code>dr.Rope.LiftDebug</code> — see{' '}
          <Link to="/docs/debugging">Debugging &amp; Profiling</Link>.
        </p>
      </>
    ),
  },

  aiming: {
    title: 'Aiming, Preview & Tip',
    body: (
      <>
        <p>
          In <strong>Assisted</strong> and <strong>Guaranteed</strong> modes an aim ray resolves the target
          before the throw. This page covers the aim pipeline, the preview, and the tip attachment that
          makes a rope read as a spear, harpoon or weighted end.
        </p>

        <h2>The aim ray</h2>
        <p>
          The wielder sweeps a ray from a configurable origin and reports the first wrappable bone it
          enters. Results are resolved right after the subsystem’s normal collider gather — no extra
          re-gather — which means the HUD result is at most one frame behind, by design.
        </p>
        <PropTable
          columns={['Ray Origin mode', 'Where the ray starts']}
          rows={[
            ['Attach Mesh Bounds Center', 'Center of the held skeletal mesh bounds — near the torso, no hardcoded bone. (Default)'],
            ['Attach Socket Or Bone', 'A named socket or bone, set in Origin Socket.'],
            ['Owner Actor Location', 'The owning actor’s location — on a Character, roughly the capsule center.'],
            ['View Location', 'Pawn eye height, or the camera when ThrowParams.FrameMode is OwnerCamera.'],
          ]}
        />

        <h2>The aim HUD</h2>
        <p>
          With <strong>Show Aim HUD</strong> on, the wielder adds a crosshair plus a highlight ring on the
          wrappable bone to the local player viewport. The widget class comes from{' '}
          <strong>Project Settings → Plugins → Dynamic Rope → Aim Hud Widget Class</strong> and defaults to
          the built-in <code>URopeAimWidget</code>, which needs no assets. Point it at a Blueprint subclass
          to restyle it, or clear it to show nothing. The same pattern applies to{' '}
          <code>URopePullGaugeWidget</code> for pull arming and engagement. The sample also reports blocked
          aims: the widget shows its blocked colour only for a refused wrap target, and keeps a neutral
          crosshair on bare walls and floors.
        </p>

        <h2>The preview</h2>
        <p>
          <code>URopePreviewComponent</code> renders the candidate wrap path as a tube before the throw —
          in <strong>Guaranteed</strong> mode only, where it is authoritative:{' '}
          <code>BuildPreparedWrappingPreview()</code> produces the contacts and anchors that{' '}
          <code>ThrowWithPreparedPreview()</code> then executes, which is exactly why what you see is what
          you get. <strong>Assisted</strong> and <strong>Full Simulation</strong> have no preview — their
          wrap is judged or emergent, so there is no path to commit to before the throw; Assisted aiming
          feedback comes from the aim ray HUD.
        </p>
        <Callout type="warn" title="Keep throw-context overrides pure">
          A Guaranteed throw resolves its context once at preview time and reuses it. If your{' '}
          <code>ResolveThrowContext()</code> override introduces randomness (aim spread, for example), the
          preview and the actual throw diverge. Same input, same output, no state changes.
        </Callout>

        <h2>Tip attachments</h2>
        <p>
          Turn on <strong>Use Tip Mesh</strong> to attach a display-only static mesh — a spear head, a
          harpoon, a weight — to the rope’s free end. It has no mass and no effect on the solver.
        </p>
        <PropTable
          columns={['Setting', 'Default', 'Notes']}
          rows={[
            ['Mesh', 'None', 'Spawned at the free end.'],
            ['Component Tag', 'None', 'Reuse a tagged StaticMeshComponent already on the owner instead of spawning. Never destroyed by the rope.'],
            ['Relative Transform', 'Identity', 'Placement offset in the tip node’s frame.'],
            ['Loaded Relative Transform', 'Identity', 'Separate offset composed onto the hand socket frame while Loaded.'],
            ['Enable Collision', 'Off', 'Off by design — a display-only tip with collision fights the rope and the character capsule.'],
            ['Sync While Free', 'On', 'Turn off to drive Free-phase placement yourself via GetTipMeshComponent().'],
            ['Loaded Hand Socket', 'None', 'The socket the tip is held at while Loaded.'],
            ['Use Sockets', 'Off', 'Guaranteed mode only: place the tip precisely with Tip Socket (the point that embeds) and Rope Socket (where the rope attaches).'],
          ]}
        />
        <p>
          Without socket placement the mesh origin sits at the end node and its X axis follows the last
          segment — the tip may visually sink into the target, which is the intended un-corrected fallback.
          With sockets on, the pose is solved so the head lands at the aim hit point, then frozen in
          bone-local space so it keeps following the target’s animation.
        </p>

        <h2>Animation integration</h2>
        <ul>
          <li>
            <code>UAnimNotify_RopeThrow</code> (“Rope Throw”) — fire the throw at the right animation
            frame. With a <code>ThrowMontage</code> assigned, the wielder queues the aim result and the
            notify releases it.
          </li>
          <li>
            <code>UAnimNotifyState_RopePull</code> (“Rope Pull Window”) — an animation-scoped pull window.
          </li>
        </ul>
      </>
    ),
  },

  presets: {
    title: 'Presets',
    body: (
      <>
        <p>
          A <code>URopePreset</code> asset is a complete rope configuration — wrap mode, node count and
          length, solver, throw, whip, wrap, hold, tip and render settings, plus the collision switches
          Collide With Owner and Use World Distance Field — applied to a component as one stamp.
        </p>
        <p>
          Make one from the Content Browser’s <strong>Add</strong> menu, under{' '}
          <strong>Dynamic Rope → Rope Preset</strong>. The same submenu is where{' '}
          <code>URopeSDFData</code> comes from — see <Link to="/docs/sdf-authoring">SDF Authoring</Link>.
        </p>
        <Figure
          src="media/Preset_Make.webp"
          width={368}
          height={874}
          alt="The Content Browser Add menu with the Dynamic Rope submenu open, offering Rope Preset and Rope SDF Data."
          caption="Add → Dynamic Rope. Both of the plugin’s asset types are created here."
        />
        <CodeBlock
          language="cpp"
          code={`if (Rope->ApplyPreset(MyPreset))
{
    // Sim reseeded, render/MID rebuilt, tip re-acquired, phase aligned to the new mode.
}`}
        />

        <h2>Rules</h2>
        <ul>
          <li>
            Values are <strong>copied</strong>. There is no live link back to the asset — editing the
            preset later does not change ropes already stamped with it.
          </li>
          <li>
            It only applies in <code>Free</code> or <code>Loaded</code>. Any other phase (mid-flight,
            mid-wrap) returns <code>false</code> and changes nothing.
          </li>
          <li>
            Applying reinitializes the rope: sim reseed, render state and material instance rebuild, tip
            re-acquisition, and phase alignment to the new wrap mode (Guaranteed enters{' '}
            <code>Loaded</code>; leaving Guaranteed returns to <code>Free</code>).
          </li>
          <li>
            Instance-level wiring stays put — <code>TipMeshComponentTag</code> and similar are outside the
            preset, so a preset with <code>bUseTipMesh = false</code> will not hide a tip you found by tag.
            The one exception is <code>LoadedHandSocket</code>, which a preset overwrites only when its{' '}
            <code>bOverrideLoadedHandSocket</code> is enabled (off by default).
          </li>
          <li>No replication. It is a local stamp.</li>
          <li>
            <code>OnPresetApplied</code> fires on success only. The wielder subscribes to it to resync its
            mode-derived state, and game code can use it to refresh UI.
          </li>
        </ul>

        <h2>Trying presets in the editor</h2>
        <p>
          Register presets under <strong>Project Settings → Plugins → Dynamic Rope → Demo → Demo
          Presets</strong>, then cycle them with the console. These commands are compiled out of Shipping builds; game code
          should call <code>ApplyPreset</code> directly.
        </p>
        <CodeBlock
          language="text"
          code={`Rope.Preset.List      // list the registered demo presets
Rope.Preset.Cycle     // apply the next one to the ropes in the world
Rope.Preset.Apply <n> // apply a specific one, by index or by a name substring`}
        />
        <p>
          <code>ARopeDemoPresetVolume</code> does the same thing spatially: walk a rope into the volume and
          the preset is applied, waiting for the rope to settle into an applicable phase first.
        </p>
      </>
    ),
  },

  ragdoll: {
    title: 'Ragdoll Response',
    body: (
      <>
        <p>
          <code>URopeRagdollResponseComponent</code> is a drop-in reaction for characters that get caught.
          Add it to the target actor and it subscribes to the subsystem’s world-wide wrap and release
          signals itself, so it reacts to any rope that binds its owner.
        </p>

        <h2>What it does</h2>
        <PropTable
          columns={['Setting', 'Default', 'Behavior']}
          rows={[
            ['Ragdoll On Wrapped', 'On', 'Go to ragdoll when a rope wraps this character.'],
            ['Delay', '0.3 s', 'Grace period before the ragdoll starts, so the wrap reads before the collapse.'],
            ['Only Below Wrapped Bone', 'Off', 'Simulate only the sub-tree under the wrapped bone. Blueprint-only, with a known limitation: while on, the tether cannot drag the target — which is why it is kept out of the details panel.'],
            ['Recover On Release', 'On', 'Return to animation when the last wrapping rope releases. Applies only to a ragdoll the rope itself started — a manually entered ragdoll is never stood up by a release.'],
            ['Follow Camera While Ragdolled', 'On', 'Retarget the view to a full ragdoll on a player-controlled pawn, with Follow Camera Lag and Recover Camera Blend to smooth it.'],
            ['Move Capsule To Mesh On Recover', 'On', 'Snap the character capsule to where the mesh ended up, using Recover Anchor Bone. Recover Ground Search (500 cm) then traces down and stands it on the ground, or recovers falling. Blueprint-only.'],
          ]}
        />

        <Callout type="info" title="Ragdoll targets get a real physics constraint">
          A ragdolled target is not held by a per-frame impulse. The rope creates an engine physics
          constraint — a kinematic corner proxy against an anchor point on the wrapped bone, with a
          spherical distance limit — so Chaos solves the rope’s length limit together with the ragdoll
          joints per substep. That is what keeps it stable instead of jittering or winching.
        </Callout>

        <Callout type="warn" title="Below ~40 fps, fix the physics tick">
          That hard distance constraint assumes a reasonably steady physics step. At large variable
          ticks it oscillates instead of holding — the rope jitters and cannot reel the ragdoll in.
          If your game runs at (or dips to) roughly 40 fps or below, enable{' '}
          <strong>Tick Physics Async</strong> with a fixed step of <strong>0.01667</strong> (60&nbsp;Hz)
          — the how and the trade-offs are in{' '}
          <Link to="/docs/performance">Performance &amp; Budgeting</Link>.
        </Callout>

        <h2>Testing it</h2>
        <CodeBlock
          language="text"
          code={`Rope.Ragdoll           // toggle a full ragdoll; add a bone name for a partial one
Rope.Ragdoll.Recover   // recover to animation
Rope.Ragdoll.Destroy   // destroy the target, to exercise the mid-wrap loss path`}
        />
        <p>
          Destroying a wrapped target mid-wrap is a supported path, not a crash: the wrapped component is
          held weakly, the hold detects the loss, and the rope releases with{' '}
          <code>ERopeReleaseReason::Broken</code>.
        </p>
      </>
    ),
  },

  'sdf-authoring': {
    title: 'SDF Authoring',
    body: (
      <>
        <p>
          Bone capsules are cheap and good enough for most throws. When you need the rope to follow the
          real silhouette — thin limbs, armor, non-cylindrical shapes — bake a{' '}
          <code>URopeSDFData</code> asset: one signed distance field per bone, sampled by{' '}
          <code>URopeSDFProvider</code> behind the same collider interface.
        </p>

        <h2>Baking</h2>
        <ol>
          <li>
            Open the <strong>Rope SDF Authoring</strong> tab from the editor’s Tools menu — double-clicking
            a <code>URopeSDFData</code> asset opens the same tab.
          </li>
          <li>
            Select (or create) the <code>URopeSDFData</code> asset in the panel’s asset picker, set its{' '}
            <strong>Source Mesh</strong> in the embedded asset details, adjust the bake settings, and bake.
          </li>
          <li>
            The bake writes into the asset in memory — press <strong>Save</strong> to commit it to disk.
          </li>
          <li>
            Add a <code>URopeSDFProvider</code> to the character, assign the baked asset, and optionally
            set <strong>Bone Filter Mode</strong> to Include or Exclude and list the bones you actually
            want wrappable in <strong>Bone Filter</strong> (the default mode, All, ignores the list).
          </li>
        </ol>
        <Figure
          src="media/Authoring.webp"
          width={1280}
          height={720}
          alt="The Rope SDF Authoring tab: bake settings and preview overlay controls down the left, and a viewport showing the mannequin with a slice heatmap drawn through its baked bone volumes."
          caption="The whole panel — bake settings above, Preview Overlay below, and the result drawn on the source mesh beside them. Both sections are covered below."
        />

        <h2>Bake settings</h2>
        <PropTable
          columns={['Setting', 'Default', 'Effect']}
          rows={[
            ['Voxel Size', '2 cm', 'Sample spacing. Smaller sharpens the surface but costs memory and bake time.'],
            ['Narrow Band (outward)', '3 cm', 'Outward detection band. The rope starts reacting from this far out; ~2–3× the collision radius is stable. The inward band is auto-sized per bone.'],
            ['Min Bone Girth', '8 cm', 'Bones thinner than this are not baked. Set it near the collision radius of the thinnest rope that will use the asset; 0 bakes everything.'],
            ['Max Resolution', '48', 'Advanced. Cap on samples per axis. A bone that would exceed it gets a coarser voxel size instead.'],
            ['Distance Precision', 'Standard (16-bit)', 'Advanced. Distance quantization. 16-bit is 256× finer than Low (8-bit) at double the size.'],
            ['Weight Threshold', '0.2', 'Advanced. Minimum average skin weight for a triangle to be assigned to a bone.'],
            ['Bounds Padding', '0 cm', 'Advanced. Expand each bone’s triangle AABB before voxelizing.'],
          ]}
        />
        <p>
          The rows marked <em>Advanced</em> sit inside the panel’s collapsed <strong>Advanced</strong>{' '}
          expander. Each bake reports to the <strong>Dynamic Rope SDF</strong> message log — bones
          coarsened to fit Max Resolution, and thin bones dropped by Min Bone Girth.
        </p>

        <Callout type="info" title="Sizing the narrow band">
          Contact happens at the solver’s collision radius, so a narrow band of roughly 2–3× that radius
          gives the rope enough runway to react without wasting memory. A rope cannot catch features finer
          than its own radius — that is what <strong>Min Bone Girth</strong> is for.
        </Callout>

        <h2>Preview overlay</h2>
        <p>
          The viewport on the right of the panel shows the source mesh in its reference pose, and the{' '}
          <strong>Preview Overlay</strong> section draws the baked volumes on top of it. These toggles are
          panel-local: they never dirty the asset, and they are separate from the runtime{' '}
          <code>URopeSDFProvider</code>’s own editor-only visualization. Until the asset has baked data the
          whole section is greyed out.
        </p>

        <p>
          The overlay draws a snapshot of the bone volumes rather than reading the asset live. Baking
          updates that snapshot for you, so the result appears immediately; <strong>Refresh</strong> is
          there for the times the asset changed from somewhere other than the Bake button.
        </p>

        <PropTable
          columns={['Overlay', 'What it draws', 'What it is good for']}
          rows={[
            [
              'Bounds (on by default)',
              'Wireframe box of each baked volume’s bone-local bounds.',
              'Coverage at a glance — which bones got baked at all, and whether Bounds Padding left enough margin beyond the skin.',
            ],
            [
              'Voxels (narrow band)',
              'Narrow-band samples as points, coloured by signed distance.',
              'Confirming the band actually hugs the silhouette. Thin limbs are where it usually does not.',
            ],
            [
              'Slice heatmap',
              'A sampled plane cutting through each volume, same colour convention.',
              'Reading the interior. Voxels only show the band; the slice shows the field as it passes through the body.',
            ],
            [
              'Gradients',
              'Green arrows along the outward distance gradient at narrow-band samples.',
              'This is the normal the solver will query. Arrows that flip or scatter mean contact will push the rope the wrong way.',
            ],
          ]}
        />

        <p>
          Voxels and the slice share one colour convention: <strong>red</strong> inside the surface
          (negative), <strong>white</strong> at it (~0), <strong>blue</strong> outside (positive).
        </p>

        <Callout type="info" title="Reading the grey">
          Samples clamped at the volume’s band limits carry no real distance, so the overlay refuses to
          dress them up as data: voxels and gradients skip them, and the slice draws them in dim grey
          instead of a heatmap colour. The boundary between grey and colour is therefore the contour of the
          narrow band itself — a direct read on how far out the rope will start reacting.
        </Callout>

        <h3>Overlay parameters</h3>
        <PropTable
          columns={['Parameter', 'Default', 'Effect']}
          rows={[
            [
              'Band Threshold (cm)',
              '3',
              'Display band for Voxels and Gradients — samples farther than this from the surface are not drawn. Capped at the asset’s baked Narrow Band, past which everything saturates and shows nothing.',
            ],
            ['Slice Axis', 'Z', 'Which axis the slice plane cuts along. X, Y or Z.'],
            ['Slice Position (0–1)', '0.5', 'Where the plane sits along that axis.'],
            ['Slice Resolution', '24', 'Samples per side of the slice grid. 2–128.'],
            [
              'Slice Color Scale (cm)',
              '2.5',
              'Distance at which the colour saturates. Lower it to bring out detail close to the surface.',
            ],
            ['Gradient Length (cm)', '4', 'Arrow length. Purely visual.'],
          ]}
        />

        <p>
          Like the analytic capsule collider, the SDF collider derives its surface velocity from the
          bone’s per-frame motion, so a swinging limb sweeps the rope aside instead of ghosting through
          it.
        </p>
      </>
    ),
  },

  debugging: {
    title: 'Debugging & Profiling',
    body: (
      <>
        <h2>Gameplay Debugger</h2>
        <p>
          The plugin registers two categories. Open the Gameplay Debugger (apostrophe by default) —{' '}
          <strong>Rope</strong> starts enabled; <strong>RopePerf</strong> starts off. Both drop out of
          Shipping builds automatically.
        </p>
        <p>
          <strong>Rope</strong> reports on the debugger’s current target actor — one block per rope
          component on it — and names the target at the head of its output
          (<code>Rope@BP_ThirdPersonCharacter_C_0</code>). So
          when you are reading the wrong rope, the target is what to change, and that is the engine’s own
          binding rather than anything the plugin adds: hold the apostrophe to pick the pawn you are
          looking at, or hold <strong>Shift + apostrophe</strong> to snap back to the local player. The
          debugger prints both across the top of the screen while it is open.{' '}
          <strong>RopePerf</strong> is world-wide and does not care which actor is selected.
        </p>
        <p>
          While the <strong>Rope</strong> category is active, these keys toggle sub-views — no console
          variables involved:
        </p>
        <PropTable
          columns={['Key', 'Sub-view']}
          rows={[
            ['P', 'Nodes — centerline nodes and indices'],
            ['U', 'Flight — contact candidates, scoring, capture decision'],
            ['I', 'Wrap — wrap path, anchors, axis'],
            ['O', 'Colliders — the colliders gathered for this rope'],
            ['J', 'Aim — the aim ray, hit and blocked hit'],
            ['K', 'Advanced — extra internals'],
          ]}
        />
        <p>
          Whatever sub-views are on, the <strong>Rope</strong> category prints a{' '}
          <code>solve=</code> line naming the path that frame took, as one of six tokens: SLEEP /
          GPU_SOLVE / GPU_OVERRIDE / CPU_SOLVE / CPU_OVERRIDE / IDLE. The OVERRIDE pair is the useful
          distinction — the rope moved because a logic phase placed its nodes, not because anything
          solved.
        </p>
        <p>
          <strong>RopePerf</strong> is the per-rope sweep rather than the detail view. Each rope reports{' '}
          <code>gpu</code>, <code>cpu</code>, <code>SLEEP</code> or <code>idle</code>, under a world
          summary counting how many ropes are on each, which is the fastest way to catch one that quietly
          dropped to the CPU path. It puts the same values as the <code>stat DynamicRope</code> group onto
          the HUD — the stat group is the option when you want them in a profile capture instead.
        </p>
        <Figure
          src="media/Debugging.webp"
          width={1280}
          height={720}
          alt="Both debugger categories drawn over a level: the Rope category showing its views line and a solve= line, and RopePerf below it counting the world's ropes and listing them one per line."
          caption="Both categories at once. Rope carries the views line and solve=GPU_SOLVE; RopePerf reports registered=34 gpu=34 cpu=0 over the per-rope list."
        />

        <h2>Console</h2>
        <CodeBlock
          language="text"
          code={`r.DynamicRope.ForceCPUSolve 1        // force the CPU path (parity checks, GPU isolation)
r.DynamicRope.Debug.LogSDFProjection 1  // log SDF projection failures (2 adds successes)
dr.Rope.LiftDebug 15                  // log tether numbers for each wrapped rope every 15 frames
dr.Rope.FlightDebug 1                 // log per-frame Flight/Contacting capture diagnostics

Rope.Preset.List / .Cycle / .Apply    // preset cycling (non-Shipping)
Rope.Ragdoll / .Recover / .Destroy    // ragdoll response testing (non-Shipping)`}
        />
        <p>
          <code>dr.Rope.LiftDebug &lt;N&gt;</code> is the numeric view of the tether while a wrap is
          held: every N frames it logs each wrapped rope’s material length, leg limit, measured span,
          violation and tension. Use it when tuning the length constraint or diagnosing tether jitter —
          for example at low frame rates, where the fix is fixed-tick physics (see{' '}
          <Link to="/docs/performance">Performance &amp; Budgeting</Link>). 0 turns it off. The debug logs
          and the <code>Rope.*</code> commands are compiled out of Shipping builds;{' '}
          <code>r.DynamicRope.ForceCPUSolve</code> alone stays available everywhere.
        </p>

        <h2>Automation tests</h2>
        <p>
          C++ automation tests cover the solver, wielder lifecycle, flight contact, wrapping, collision,
          traction, movement, pierce, presets, tip stabilizer, SDF sampler, GPU solver, ragdoll and more.
          Run them from <strong>Tools → Session Frontend → Automation</strong>, filtering on{' '}
          <code>DynamicRope.</code>.
        </p>

        <h2>Runtime introspection</h2>
        <CodeBlock
          language="cpp"
          code={`Rope->GetPhase();                    // ERopePhase
Rope->GetWrappedBoneName();          // FName, None when not wrapped
Rope->GetWrappedMesh();              // USkeletalMeshComponent*, null for static targets
Rope->GetConstraintTension();        // authoritative gameplay load
Rope->GetTetherOvershoot();          // cm past the available length
Rope->GetEffectiveTetherTargetShare(); // [0..1] — 1 = all target, 0 = all wielder
Rope->IsSleeping();
Rope->GetSolverLODScale();`}
        />

        <h2>Demo actors</h2>
        <p>
          The plugin ships Blueprintable demo actors that subscribe to the world-wide wrap and release
          signals, useful both as test scenes and as reference implementations:{' '}
          <code>ARopeDemoDoor</code>, <code>ARopeDemoElevator</code>, <code>ARopeDemoLever</code>,{' '}
          <code>ARopeDemoPressurePlate</code>, <code>ARopeDemoHelicopter</code>,{' '}
          <code>ARopeDemoSnare</code>, <code>ARopeDemoBasketGoal</code>,{' '}
          <code>ARopeDemoRespawnVolume</code> and <code>ARopeDemoPresetVolume</code>. Each exposes a
          Blueprint-assignable state delegate.
        </p>
      </>
    ),
  },

  components: {
    title: 'Components',
    body: (
      <>
        <h2>Core</h2>
        <PropTable
          columns={['Class', 'Attach to', 'Role']}
          rows={[
            [
              <code key="a">URopeComponent</code>,
              'The rope owner',
              'The facade and single integration point. Owns sim state, the solver, per-phase logic and the phase state machine. It is a UMeshComponent — it renders its own tube.',
            ],
            [
              <code key="b">URopeWielderComponent</code>,
              'The player/AI character',
              'Enhanced Input bindings, aiming, montages, pull arming, reeling, movement integration.',
            ],
            [
              <code key="c">URopeSimSubsystem</code>,
              '(world subsystem)',
              'Ticks every registered rope, gathers colliders once per frame, owns the GPU solver, and broadcasts world-wide wrap/release signals.',
            ],
            [
              <code key="d">ARopeController</code>,
              '(auto-spawned actor)',
              'Hosts the static world collider provider — exactly one per world. Collider budgets live in project settings; subclass it for per-provider wiring such as IgnoredComponents, or clear the class in project settings to place your own.',
            ],
          ]}
        />

        <h2>Collision providers</h2>
        <PropTable
          columns={['Class', 'Attach to', 'Role']}
          rows={[
            [<code key="a">URopeBoneCapsuleProvider</code>, 'A skeletal actor', 'One analytic capsule per listed bone, rebuilt each frame.'],
            [<code key="b">URopeSDFProvider</code>, 'A skeletal actor', 'Serves colliders sampling a baked URopeSDFData volume.'],
            [<code key="e">URopeSkeletalColliderProvider</code>, 'A skeletal actor', 'The abstract base both providers above derive from — subclass it to serve custom skeletal colliders.'],
            [<code key="c">URopeWrapTargetComponent</code>, 'A static prop', 'Makes a pole, beam or hook a genuine wrap target with an axis and radius.'],
            [<code key="d">URopeStaticBodyProvider</code>, '(on ARopeController)', 'Sweeps world static and dynamic bodies into boxes, capsules and convex hulls.'],
          ]}
        />

        <h2>Gameplay & presentation</h2>
        <PropTable
          columns={['Class', 'Role']}
          rows={[
            [<code key="a">URopeRagdollResponseComponent</code>, 'Ragdoll on wrap, recover on release, camera follow.'],
            [<code key="b">URopePreviewComponent</code>, 'Renders the candidate wrap path before the throw.'],
            [<code key="c">UAnimNotify_RopeThrow</code>, 'Fires the throw at an animation frame.'],
            [<code key="d">UAnimNotifyState_RopePull</code>, 'An animation-scoped pull window.'],
            [<code key="e">URopeAimWidget</code>, 'Aim crosshair and wrappable-bone highlight ring. Restyle by subclassing in a WBP.'],
            [<code key="f">URopePullGaugeWidget</code>, 'Pull arming/engagement ring.'],
            [<Names key="h">URopeReelGaugeComponent / URopeReelGaugeWidget</Names>, 'World-space reel gauge. Restyle by subclassing the widget.'],
            [<Names key="i">URopeWrapCameraComponent / URopeWrapCameraDirectorComponent / ARopeWrapCameraRig</Names>, 'Opt-in wrap camera: the director cuts to a rig while a wrap holds, with OnBegin/OnEnd events.'],
            [<Names key="g">ARopePluginInfoHUD / URopePluginInfoWidget</Names>, 'In-game key guide, capabilities and limitations panels for demo levels.'],
          ]}
        />

        <h2>Assets</h2>
        <PropTable
          columns={['Asset', 'Role']}
          rows={[
            [<code key="a">URopePreset</code>, 'A complete rope configuration applied as one stamp.'],
            [<code key="b">URopeSDFData</code>, 'Baked per-bone signed distance fields for one skeletal mesh.'],
          ]}
        />
      </>
    ),
  },

  settings: {
    title: 'Configuration Reference',
    body: (
      <>
        <p>
          Per-rope configuration is grouped into Blueprint-editable structs on{' '}
          <code>URopeComponent</code>, each inlined into the details panel so you edit fields one level
          deep. Project-wide defaults live under{' '}
          <strong>Project Settings → Plugins → Dynamic Rope</strong> and persist to{' '}
          <code>DefaultGame.ini</code>.
        </p>
        <Callout type="info" title="Auto-derived radii">
          Three radii must agree or the rope reads as jittery: the render radius, the solver’s collision
          radius and the contact query radius. Leave <code>CollisionRadius</code> and{' '}
          <code>ContactQueryRadius</code> at <strong>0 (auto)</strong> and they derive from the render{' '}
          <code>Radius</code> (×1 and ×1.5). Only override them if you know why.
        </Callout>

        <h2>Component root</h2>
        <PropTable
          rows={[
            ['Wrap Mode', 'Assisted (Judged)', 'The rope’s contract from throw to bind.'],
            ['Node Count', '64', 'Simulated particles. Max 512 (the GPU thread-group limit). Init-time only.'],
            ['Rope Length', '600 cm', 'Initial and maximum length. Init-time only; runtime changes go through SetRopeLength.'],
            ['Min Rope Length', '100 cm', 'The shortest reeling in can reach.'],
            ['Reel Speed', '300 cm/s', 'The rate the wielder’s reel inputs use.'],
            ['Rope Radius', '2 cm', 'Visual tube radius. Also the source for the auto-derived collision radii.'],
            ['Sides', '8', 'Tube cross-section sides.'],
            ['Smoothing Subdivisions', '1 (off)', 'Render-only Catmull-Rom subdivision per segment.'],
            ['Smoothing Strength', '0.5', 'Catmull-Rom knot α: 0 uniform, 0.5 centripetal, 1 chordal.'],
            ['Material', 'Engine default', 'Replace at runtime with SetMaterial(0, M), not by direct assignment.'],
            ['Collide With Owner', 'Off', 'Turn on when the rope is mounted on a prop it must collide with.'],
            ['Use World Distance Field', 'On', 'Global-distance-field push-out from static world geometry (GPU path).'],
            ['Taut Presentation', 'On', 'Render-only shaping of a taut hold: the free span straightens toward its chord and a short thrum plays when the chain snaps taut. Simulation and tension are unaffected.'],
            ['Taut Straightening', '1.0', 'How far the taut free span straightens — 0 as solved, 1 dead straight.'],
            ['Taut Thrum Amplitude', '2.5 cm', 'Peak displacement of the decaying thrum at the taut snap. 0 keeps the straightening without the thrum.'],
          ]}
        />

        <h2>Solver — <code>FRopeSolverConfig</code></h2>
        <PropTable
          rows={[
            ['Substeps', '12', 'XPBD substeps per frame ("small steps").'],
            ['Iterations', '4', 'Constraint iterations per substep.'],
            ['Stretch Softness', '0.0', 'XPBD compliance for the distance constraint. 0 is inextensible.'],
            ['Max Stretch', '1.5', 'Hard cap on segment stretch ratio.'],
            ['Bend Softness', '0.02', 'Bending compliance. Higher is limper.'],
            ['Friction', '0.5', 'Tangential friction against colliders, measured relative to the surface velocity.'],
            ['Tip Grip Falloff', '1.0', 'Scales friction toward the free end.'],
            ['Collision Radius (0 = Auto)', '0', 'Solver collision radius; auto derives from the render radius.'],
            ['Sweep Step', '2 cm', 'Sample spacing of the anti-tunnelling collision sweep along a node’s substep travel. Lower resists tunnelling better; move it together with Max Sweep Samples.'],
            ['Max Sweep Samples', '16', 'Cap on sweep samples per segment. Raise it when lowering Sweep Step alone stops helping.'],
            ['Gravity', '(0, 0, -980)', 'Per-rope gravity.'],
            ['Motion Damping', '0.02', 'Velocity damping per substep.'],
            ['Allow Sleep', 'On', 'Skip solving a settled rope. A Free rope stops entirely; a Wrapped one keeps its hold logic and pauses only the free span’s solve.'],
            ['Sleep Speed Threshold', '3.0', 'Speed below which a rope counts as settled.'],
            ['Sleep Delay', '0.5 s', 'How long it must stay settled before sleeping.'],
            ['Enable Distance LOD', 'On', 'Scale iterations down with camera distance.'],
            ['LOD Start / End', '3000 / 8000 cm', 'The distance range over which quality falls off.'],
            ['LOD Min Iterations', '0.25', 'The floor of the iteration scale.'],
          ]}
        />

        <h2>Throw — <code>FRopeThrowParams</code></h2>
        <PropTable
          rows={[
            ['Frame Mode', 'Owner', 'Where the throw direction comes from — World, Owner, OwnerCamera, Socket or Custom.'],
            ['Swing Plane', 'Aim And Frame Up', 'The plane the whip swings in.'],
            ['Throw Speed', '1000 cm/s', 'Initial tip speed.'],
            ['Return If No Contact', '0 s (off)', 'Auto-return the rope if flight makes no contact within this time.'],
            ['Tip Velocity Boost', '1.0', 'Extra speed weighting toward the tip.'],
            ['Motion Inheritance', '5.0', 'How much owner and hand-animation velocity is inherited.'],
            ['Arc Height', '0.25', 'Guaranteed mode: apex height of the guided arc as a fraction of the hand-to-target distance. 0 flies straight; capped at 0.5.'],
            ['Custom Forward / Up / Right', 'Axis defaults', 'Used when Frame Mode is Custom.'],
            ['Custom Plane Normal', '(0, 1, 0)', 'Used when Swing Plane is Custom Normal.'],
          ]}
        />

        <h2>Whip — <code>FRopeWhipConfig</code></h2>
        <p>The throw’s presentation swing during Flight. Not used in Guaranteed mode.</p>
        <PropTable
          rows={[
            ['Guided Length', '0.65', 'The fraction of the rope the guide curve drives.'],
            ['Sweep Angle', '180°', 'The angle swept from the starting angle round to the aim direction.'],
            ['Initial Curve', '0.12', 'Full Simulation only: initial one-sided C-shape amplitude as a fraction of the guide length.'],
            ['Straighten At', '0.50', 'Full Simulation only: normalized whip time at which the initial C shape becomes exactly straight.'],
            ['Tip Physics Blend', '0.25', 'Rope-length fraction that crossfades from the guide into the solver-owned tail.'],
            ['Skip Collision', 'On', 'Aim-hit flight only: keep the distance/bend/damping solves but disable collider push-out. Contact detection still runs.'],
          ]}
        />

        <h2>Wrap — <code>FRopeWrapConfig</code></h2>
        <p>Capture thresholds and wrap-path construction. Not used in Guaranteed mode.</p>
        <PropTable
          rows={[
            ['Enable Multi Bone Wrapping', 'On', 'Allow a wrap spanning several bones (both legs, for example). Blueprint-only — not in the details panel.'],
            ['Contact Query Radius (0 = Auto)', '0', 'Detection radius; auto derives from the render radius × 1.5. Blueprint-only.'],
            ['Min Latch Nodes', '1', 'Real contacts on one bone needed to seed a wrap; the commit follows as soon as the seed is valid, with no time gate. Blueprint-only.'],
            ['Predictive Contact Frames', '1.0', 'How far ahead node motion is extrapolated for predicted contacts. Blueprint-only.'],
            ['Sweep Step', '2 cm', 'Contact-side anti-tunnelling sweep spacing during Flight.'],
            ['Max Sweep Samples', '16', 'Cap on contact sweep samples per node.'],
            ['Axis Source', 'Bone-Centered Guide Plane', 'Where the wrap axis and its measurement frame come from.'],
            ['Min Wrap Duration', '0.20 s', 'Floor on the Wrapping phase — even when the front arrives early, the commit waits until this has elapsed.'],
            ['Wrap Speed', '1100 °/s', 'The front’s angular rate along the path.'],
            ['Max Wrap Seeds', '1', 'Concurrent wrap seeds considered.'],
            ['Max Gap Bridge', '0 cm (off)', 'Bridge gaps in the wrap path over open space — what makes a forked target (two legs) wrappable.'],
            ['Max Wrap Angle', '0° (off)', 'Cap on the total wrapped angle. Composite helix paths are exempt.'],
            ['Min Angle On Path Failure', '120°', 'A wrap whose path build failed is released below this angle instead of committed.'],
            ['Min Commit Angle', '0° (off)', 'Quality gate: reject a commit below this wrapped angle.'],
            ['Min Commit Coverage', '0° (off)', 'Quality gate: reject a commit below this angular coverage.'],
          ]}
        />

        <h2>Hold — <code>FRopeHoldConfig</code></h2>
        <p>
          Everything after the wrap is established. Common to all wrap modes. See{' '}
          <Link to="/docs/hold-pull">Hold, Pull &amp; Tether</Link> for how these interact.
        </p>
        <PropTable
          rows={[
            ['Enforce Rope Length', 'On', 'The wielder cannot move past the rope’s length.'],
            ['Enforce Rope Length (Target)', 'On', 'Neither can a CMC-driven kinematic target on an anchored rope.'],
            ['Rope Elasticity', '0.0', 'Length-constraint compliance. 0 is rigid.'],
            ['Taut Sensitivity', '0.5', 'One knob [0..1] driving both the slack ratio and the max allowed sag.'],
            ['Pull Strength', '100000', 'Tension cap on the active pull. With Pull Speed it gives mass dependence: a light target reaches the target speed, one too heavy for the cap lags behind.'],
            ['Pull Requires Taut', 'On', 'Gate active pull on the rope being taut.'],
            ['Pull Load Threshold', '0 (off)', 'Additionally require this much load before pull engages.'],
            ['Pull Corner Angle', '30°', 'Bend angle that counts as a corner when deriving the pull direction.'],
            ['Pull Speed / Pull Spin Limit', '300 cm/s / 720 °/s', 'Target speed the pull drives a physics body toward, and the spin cap on it.'],
            ['Tether Speed Limit', '1500 cm/s', 'Cap on tether-driven motion.'],
            ['Tether Recovery Speed', '150 cm/s', 'Cap on the positional-bias recovery rate.'],
            ['Tether Settle Time', '0.08 s', 'Time constant for recovering overshoot on an inextensible tether. Smaller is firmer.'],
            ['Tether Sideways Damping', '0.3', 'Damping perpendicular to the rope.'],
            ['Tether Tension Limit', '500000', 'Force cap in elastic mode; the debugger’s overload baseline on an inextensible rope.'],
            ['Ground Brace Factor', '1.5', 'How much a grounded wielder resists being dragged.'],
            ['Release At Tension', '0 (off)', 'Auto-release above this load.'],
            ['Release Delay', '0.05 s', 'How long it must stay above.'],
            ['Release At Overstretch', '0 cm (off)', 'Auto-release when overstretched by this much.'],
          ]}
        />

        <h2>Project settings</h2>
        <PropTable
          rows={[
            ['Static Body Controller Class', 'ARopeController', 'Auto-spawned per world to host the static collider provider. Clear to disable.'],
            ['Static Body Max Colliders', '256', 'Global per-frame extraction limit.'],
            ['Static Body Max Colliders Per Rope', '32', 'Per-rope solve budget; excess dropped furthest-first.'],
            ['Static Body Max Convex Planes', '32', 'Convexes above this fall back to an OBB.'],
            ['Include World Dynamic', 'On', 'Collect WorldDynamic bodies too.'],
            ['Include Physics Bodies', 'Off', 'Also collect simulating physics props as one-way push-out colliders.'],
            ['Aim Hud Widget Class', 'URopeAimWidget', 'Aim HUD. Point at a WBP subclass to restyle; clear to disable.'],
            ['Pull Gauge Widget Class', 'URopePullGaugeWidget', 'Pull gauge. Same pattern.'],
            ['Demo Presets', 'Empty', 'Presets for the non-Shipping Rope.Preset console commands.'],
            ['Write Velocity', 'On', 'Whether the rope tube writes motion vectors. On gives correct motion blur and avoids TSR/TAA ghosting; off excludes the rope from motion blur.'],
          ]}
        />
      </>
    ),
  },

  'blueprint-api': {
    title: 'Blueprint API & Events',
    body: (
      <>
        <h2>Events on URopeComponent</h2>
        <PropTable
          columns={['Event', 'Payload', 'When']}
          rows={[
            [<code key="a">On Rope Wrapped</code>, 'FRopeWrappedEventInfo', 'A wrap was established.'],
            [<code key="b">On Rope Captured</code>, 'FName Bone', 'Contact was captured — before the wrap is established.'],
            [<code key="c">On Rope Released</code>, 'FName Bone, ERopeReleaseReason', 'The engagement ended. Fires for pre-wrap aborts too, where Bone can be None.'],
            [<code key="d">On Rope Phase Changed</code>, 'ERopePhase Old, ERopePhase New', 'Every transition (same-phase resets excluded).'],
            [<code key="e">On Preset Applied</code>, 'const URopePreset*', 'ApplyPreset succeeded.'],
          ]}
        />
        <p>
          <code>FRopeWrappedEventInfo</code> carries the dominant <code>Bone</code>, the full{' '}
          <code>Bones</code> list, the wrapped <code>Mesh</code> (weak — it can belong to another actor),
          the <code>ResolveMode</code> at commit, the judged <code>AngleDeg</code> and{' '}
          <code>CoverageDeg</code> (both −1 for a preview-based Guaranteed wrap), <code>AnchorCount</code>,
          and a weak pointer to the <code>Rope</code> itself.
        </p>
        <Callout type="warn" title="Do not mutate the rope from On Rope Phase Changed">
          It is broadcast <em>during</em> the transition. Reacting by calling <code>ReleaseWrap()</code> or
          similar from that handler is not supported — bind <code>OnRopeWrapped</code> /{' '}
          <code>OnRopeReleased</code> instead, which fire after the transition has finished.
        </Callout>

        <h2>Rope actions</h2>
        <p>
          Every action below is an ordinary Blueprint node taking the rope component as its target, so the
          smallest working throw is two nodes and a wire:
        </p>
        <Figure
          src="media/Blueprint_Throw.webp"
          width={447}
          height={139}
          alt="A Blueprint graph: the Rope component output pin wired into the Target input of a Throw node."
          caption="The rope component into Throw. Direction comes from ThrowParams, so there is nothing else to feed it."
        />
        <PropTable
          columns={['Node', 'Notes']}
          rows={[
            [<code key="a">Throw</code>, 'Direction comes from ThrowParams.FrameMode.'],
            [<code key="b">Throw With Context</code>, 'Explicit origin, frame, speed.'],
            [<code key="c">Enter Loaded</code>, 'Guaranteed mode: ready the tip in hand. Valid from Free or Loaded.'],
            [<code key="d">Release Wrap</code>, 'Manual release.'],
            [<code key="e">Cut Rope</code>, 'Same flow, reported as ERopeReleaseReason::Cut so the game can react differently.'],
            [<code key="f">Set Active Pull</code>, 'Pull under this tension cap while taut; 0 stops. bIgnoreTautGate bypasses the gate for this call.'],
            [<Names key="g">Set Rope Length / Set Reel Rate</Names>, 'Immediate and held-input reeling.'],
            [<code key="h">Apply Preset</code>, 'Returns false outside Free/Loaded.'],
            [<Names key="i">Set / Toggle Show Rope When Loaded</Names>, 'Guaranteed-mode presentation switch.'],
          ]}
        />

        <h2>Rope queries</h2>
        <PropTable
          columns={['Node', 'Returns']}
          rows={[
            [<code key="a">Get Phase</code>, 'ERopePhase'],
            [<code key="b">Can Throw Now</code>, 'Whether the mode × phase gate allows a throw right now.'],
            [<Names key="c">Get Wrapped Bone Name / Get Wrapped Mesh</Names>, 'The current wrap target.'],
            [<code key="d">Get Constraint Tension</code>, 'The authoritative gameplay load. (Get Tether Tension is the legacy alias.)'],
            [<code key="e">Get Pull Sample</code>, 'Pull direction + tension this frame.'],
            [<Names key="f">Is Pull Taut / Is Chain Taut</Names>, 'Taut gates.'],
            [<code key="g">Get Tether Overshoot</code>, 'cm past the available rope length.'],
            [<code key="h">Get Effective Tether Target Share</code>, '[0..1] — how the correction split between target and wielder.'],
            [<Names key="i">Get Node Count / Get Node Position</Names>, 'Centerline access, for attaching effects.'],
            [<code key="j">Get Current Rope Length</code>, 'Runtime length in cm.'],
            [<Names key="k">Get Segment Tension / Get Max Tension</Names>, 'Visual solver diagnostics — not gameplay load.'],
            [<Names key="l">Is Sleeping / Get Solver LOD Scale</Names>, 'Scaling state.'],
            [<code key="m">Constrain Wielder Location</code>, 'Project a proposed move into the hard length boundary.'],
            [<Names key="n">Get Whip Elapsed / Get Reel Rate / Get Tip Mesh Component / Is Show Rope When Loaded / Is Wielder Physically Simulated</Names>, 'Flight timing, reel state and presentation queries.'],
          ]}
        />

        <h2>Wielder actions</h2>
        <PropTable
          columns={['Node', 'Notes']}
          rows={[
            [<Names key="a">Throw / Throw Now / Throw In Direction</Names>, 'Throw with the montage, immediately, or toward an explicit direction.'],
            [<code key="b">Toggle Throw</code>, 'What the throw input does when Throw Toggles Hold is on (the default) and no separate Release Action is bound.'],
            [<Names key="c">Start Pull / Stop Pull</Names>, 'Arm and disarm. Engagement waits for Pull Engage Tension.'],
            [<Names key="d">Start Pull Now / Stop Pull Now</Names>, 'Skip the arming stage.'],
            [<Names key="e">Start Reel In / Start Reel Out / Stop Reel</Names>, 'Held-input reeling at the rope’s Reel Speed.'],
            [<Names key="f">Release / Cut</Names>, 'Forwarded to the rope.'],
            [<Names key="g">Play Throw Montage / Play Pull Montage</Names>, 'Manual montage triggers.'],
            [<code key="h">Build Throw Context</code>, 'Context construction from an aim direction. Callable from Blueprint; overridable from a C++ subclass.'],
            [<Names key="i">Uses Aim Ray / Is Aim Active / Uses Locked Preview / Is Pull Armed / Is Pull Engaged / Get Pull Engage Progress</Names>, 'State queries for UI.'],
            [<Names key="j">Get Rope / Bind Input</Names>, 'The bound rope, and manual Enhanced Input binding when Auto Bind Input is off.'],
            [<Names key="k">Set / Is Rope Input Suppressed</Names>, 'Mute the wielder’s rope input handling and read it back.'],
            [<Names key="l">Set / Is Throw Preview Enabled</Names>, 'Toggle the throw preview at runtime.'],
            [<Names key="m">Is Hanging On Rope / Get Hang Anim Sample / Is Hang Socket Swapped</Names>, 'Hang-state queries for animation blueprints.'],
            [<code key="n">Get Aim Hud Sample</code>, 'Everything the aim HUD shows this frame, for a custom widget.'],
          ]}
        />

        <h2>Events on URopeWielderComponent</h2>
        <PropTable
          columns={['Event', 'Payload', 'When']}
          rows={[
            [<code key="a">On Thrown</code>, '—', 'The wielder’s throw actually fired.'],
            [<code key="b">On Throw Rejected</code>, 'ERopeThrowRejectReason', 'A throw attempt was refused; the reason says why.'],
            [<code key="c">On Aim Target Changed</code>, 'USceneComponent*, FName Bone', 'The aim settled on a new wrappable target.'],
            [<code key="d">On Aim Target Lost</code>, '—', 'No wrappable target under the aim any more.'],
            [<code key="e">On Pull Armed Changed</code>, 'bool', 'Pull arming toggled.'],
            [<code key="f">On Pull Engaged Changed</code>, 'bool, float Tension', 'Pull engagement toggled, with the tension at the flip.'],
          ]}
        />

        <h2>World-wide signals (C++)</h2>
        <p>
          For systems that react to <em>any</em> rope — HUDs, AI, demo props — subscribe on the subsystem
          instead of on each component. These are native multicast delegates, not dynamic ones. Unlike the
          per-rope <code>OnRopeReleased</code>, <code>OnAnyRopeReleased</code> fires only for committed
          wraps — pre-wrap aborts stay per-instance.
        </p>
        <CodeBlock
          language="cpp"
          code={`if (URopeSimSubsystem* Sim = URopeSimSubsystem::Get(GetWorld()))
{
    Sim->OnAnyRopeWrapped.AddRaw(this, &FMySystem::HandleAnyWrapped);
    Sim->OnAnyRopeReleased.AddRaw(this, &FMySystem::HandleAnyReleased);
}`}
        />
        <Callout type="info" title="Key your reaction by rope, not by mesh">
          Several ropes can wrap one target at once — both arms, say. <code>FRopeWrappedEventInfo::Rope</code>{' '}
          identifies which one, and <code>OnAnyRopeReleased</code> carries the same pointer. Track a set of
          active engagements keyed by rope, or one release will revert a reaction the other ropes still
          justify.
        </Callout>
      </>
    ),
  },

  extending: {
    title: 'Extending in C++',
    body: (
      <>
        <p>
          Add <code>"DynamicRope"</code> to your module’s <code>PublicDependencyModuleNames</code> (and{' '}
          <code>"DynamicRopeShaders"</code> if you touch the GPU solver or tube-builder types), then
          subclass <code>URopeComponent</code> and override the hooks below. All of them run on the game
          thread on cold paths — per frame at most, usually per transition. The parallel Solve stage has no
          hooks by design: the node-level hot loops are the POD / GPU parity reference and are not virtual
          extension points.
        </p>

        <h2>Policy hooks</h2>
        <PropTable
          columns={['Hook', 'Default', 'Override to']}
          rows={[
            [
              <code key="a">CanWrapTarget(Mesh, Bone)</code>,
              'true',
              'Restrict what can be wrapped by team, tag or game rule. Every target-selection path — flight candidates, aim ray, preview arc, prepared throw — shares this one gate, so aiming and judgement can never disagree.',
            ],
            [
              <code key="b">ResolveThrowContext(Ctx)</code>,
              'Re-orthonormalize + fallbacks',
              'Add aim assist or custom framing. Every throw converges here, so previews and real throws stay in sync. Must be pure — no randomness, no state.',
            ],
            [
              <code key="c">ShouldAbortGuaranteedThrow(Prepared)</code>,
              'false',
              'Break a Guaranteed throw on a game rule (target died, teleported). Releases as ThrowAborted, distinct from an internal Broken. Only polled for aimed throws.',
            ],
            [
              <code key="d">ApplyPullForce(Force, Pull, Dt)</code>,
              'Simulating bone → CharacterMovement → simulating root',
              'Change the active-pull policy — what gets pulled and how hard.',
            ],
            [
              <code key="e">ApplyTractionToReceiver(Request)</code>,
              'false (built-in application)',
              'The single gate every rope-generated force passes through — tether, active pull, climb-in, slack brake. Override this one and a custom movement system (Mover, vehicles) takes over all rope traction. Return true to say you handled it.',
            ],
          ]}
        />

        <p>
          The wielder has hooks of its own: subclass <code>URopeWielderComponent</code> and override{' '}
          <code>CanThrow()</code> to gate throws on a game rule, and <code>NotifyThrown()</code> /{' '}
          <code>NotifyThrowRejected(Reason)</code> to react natively without binding to the delegates.
        </p>

        <h2>Presentation hooks</h2>
        <PropTable
          columns={['Hook', 'Called', 'Notes']}
          rows={[
            [<code key="a">OnPhaseChanged(Old, New)</code>, 'Once per transition', 'Just before OnRopePhaseChanged broadcasts.'],
            [<code key="b">GetLoadedTipTransform()</code>, 'Twice per frame while Loaded', 'Where the tip sits in hand. Cache anything expensive — this is not a per-transition hook.'],
            [<code key="c">OnEnterLoaded()</code>, 'On the Loaded entry edge', 'Default toggles tube visibility from bShowRopeWhenLoaded.'],
            [<code key="d">OnDeployFromLoaded()</code>, 'Leaving Loaded', 'Default restores the tube and full length. GetPhase() is still Loaded when it runs.'],
            [<Names key="e">NotifyCaptured / NotifyWrapped / NotifyReleased / NotifyPresetApplied</Names>, 'Before each broadcast', 'Native equivalents of the dynamic delegates, so a C++ subclass need not bind to its own events.'],
          ]}
        />

        <h2>Writing a custom collider</h2>
        <p>
          Implement <code>IRopeCollider</code> — its two pure virtuals are <code>Query()</code> and{' '}
          <code>GetWorldBounds()</code> — and serve it from an <code>IRopeColliderProvider</code> via{' '}
          <code>GatherColliders()</code>. A provider that sweeps world geometry must also fill{' '}
          <code>ColliderSourceActors</code>, or its colliders will push its own rope around.{' '}
          <code>FRopeContact</code> is a <strong>frozen contract</strong> — every collider must obey it
          exactly:
        </p>
        <ul>
          <li>
            <code>Normal</code> is unit and points <em>outward</em> (collider → node). The sign is
            load-bearing; an inward normal sucks the rope into the body.
          </li>
          <li>
            <code>Penetration</code> is measured against the <em>query</em> radius, not the render radius.
          </li>
          <li>
            Skeletal colliders must report a non-<code>None</code> <code>Bone</code> — that is how the wrap
            decision attributes a wrap.
          </li>
          <li>
            <code>SurfaceVelocity</code> is the collider surface’s world velocity (cm/s) at the contact
            point, used for relative-tangential friction. Leave it zero for static colliders.
          </li>
          <li>
            <code>SourceMesh</code> carries the component that owns the contacted bone. This is what makes
            cross-actor wrapping work — do not drop it.
          </li>
        </ul>

        <h2>Unit-testable by construction</h2>
        <p>
          The solver (<code>FRopeXPBDSolver</code>) and every per-phase logic class (
          <code>FRopeWhipGuide</code>, <code>FRopeFlightContactDetector</code>,{' '}
          <code>FRopeWrappingPhase</code>, <code>FRopeWrapController</code>,{' '}
          <code>FRopeTractionSolver</code>, <code>FRopeLengthConstraintSolver</code>) have{' '}
          <strong>no UObject dependency</strong>. Context is injected per call as plain structs. If you fork
          or extend one, you can test it without a world — and it stays portable to a compute shader.
        </p>
      </>
    ),
  },

  faq: {
    title: 'FAQ & Troubleshooting',
    body: (
      <>
        <h2>Does it work in multiplayer?</h2>
        <p>
          No. The plugin does not replicate rope or wrap state, and on a replicated pawn the wielder’s
          length constraint deliberately skips simulated proxies rather than projecting a locally guessed
          rope that would fight network smoothing. A remote client will not see a correct rope. See{' '}
          <Link to="/docs/requirements">Requirements &amp; Compatibility</Link>.
        </p>

        <h2>Do I need to write C++?</h2>
        <p>
          No. Throwing, tuning, reading tension and reacting to every stage of the loop are all callable
          and bindable from Blueprint — see{' '}
          <Link to="/docs/blueprint-api">Blueprint API &amp; Events</Link>. C++ is for adding a new
          collider source or provider, or driving the solver yourself, which is{' '}
          <Link to="/docs/extending">Extending in C++</Link>.
        </p>

        <h2>The rope falls through the character.</h2>
        <p>
          Make sure a collider provider is registered on the target and lists the bones you expect to hit.
          If you wrote a custom collider, check that contact normals point outward (collider → node) — an
          inverted normal pulls the rope into the body instead of pushing it out.
        </p>

        <h2>The rope falls through the pillar it is mounted on.</h2>
        <p>
          A rope excludes its own owner’s colliders so a thrown rope does not tangle on the thrower. If the{' '}
          <code>URopeComponent</code> lives on the prop itself, turn on <strong>Collide With Owner</strong>.
        </p>

        <h2>Nothing happens when I throw.</h2>
        <p>
          Check <code>CanThrowNow()</code>. A <strong>Guaranteed</strong> rope is only throwable from the{' '}
          <code>Loaded</code> phase — call <code>EnterLoaded()</code> or bind the wielder’s{' '}
          <code>ReloadAction</code> after a release. Other modes have no phase gate.
        </p>

        <h2>The rope wraps but does not follow animation.</h2>
        <p>
          The wrap must actually commit — enough nodes in real contact with one bone to seed it. If it
          releases immediately, lower <code>MinLatchNodes</code>, tighten the contact{' '}
          <strong>Sweep Step</strong> (the anti-tunnelling value) or raise{' '}
          <strong>Predictive Contact Frames</strong>, and check whether <strong>Min Commit Angle</strong> /{' '}
          <strong>Min Commit Coverage</strong> are rejecting the commit. Both are reported on the wrap
          event, so log them from a real throw before tuning.
        </p>

        <h2>Pull does nothing.</h2>
        <p>
          Active pull is gated on the rope being taut. Verify with <code>IsPullTaut()</code>, then either
          reel in, lower <strong>Taut Sensitivity</strong>, or turn off{' '}
          <code>bActivePullRequiresTaut</code>. If the target is a physics body, remember the pull drives
          it toward <strong>Pull Speed</strong> under the <strong>Pull Strength</strong> tension cap — a
          Pull Speed of 0 does nothing at all, and a target too heavy for the cap lags behind, so raise
          Pull Strength for heavy targets and Pull Speed for a faster pull. If the target is anchored or
          very heavy, the pull intentionally reverses into climb-in and drags the wielder instead.
        </p>

        <h2>The rope quietly got slow.</h2>
        <p>
          It probably dropped to the CPU path. Enable the <strong>RopePerf</strong> Gameplay Debugger
          category — it marks each rope <code>gpu</code> or <code>cpu</code> (a settled rope reads{' '}
          <code>SLEEP</code>, an override-only frame <code>idle</code>), so a stray <code>cpu</code> row is
          the answer. Switch to the <strong>Rope</strong> category if you then need to know which kind of
          frame it was. The usual causes are no renderable RHI, a feature level below SM5, or{' '}
          <code>r.DynamicRope.ForceCPUSolve</code> left at 1 — node and ring counts can no longer exceed
          the 512 cap; they are clamped at init.
        </p>

        <h2>The rope jitters and cannot reel a ragdolled target in.</h2>
        <p>
          Check your frame rate first. Ragdoll targets are held by a hard Chaos distance constraint,
          and at large variable physics ticks — roughly 40&nbsp;fps or below — that constraint
          oscillates instead of holding. Enable <strong>Tick Physics Async</strong> with a fixed step
          of 0.01667 (60&nbsp;Hz); the details and trade-offs are in{' '}
          <Link to="/docs/performance">Performance &amp; Budgeting</Link>. To watch the tether
          numerically while you verify, use <code>dr.Rope.LiftDebug 15</code> — see{' '}
          <Link to="/docs/debugging">Debugging &amp; Profiling</Link>.
        </p>

        <h2>Performance dips with many ropes.</h2>
        <p>
          Ropes solve in parallel and share one collider gather per frame. Keep node counts modest, leave
          sleep and distance LOD on, and lower <strong>Static Body Max Colliders Per Rope</strong> in dense
          scenes — the GPU kernel loops colliders per node per substep, so that number multiplies directly
          into cost. Skeleton colliders always run and ignore that budget, so a dense-skeleton scene needs
          fewer provider bones instead.
        </p>

        <h2>The rope smears when it moves fast.</h2>
        <p>
          That is per-object motion blur. <strong>Write Velocity</strong> is on by default so TSR/TAA get
          correct motion vectors; turning it off excludes the rope from motion blur, at the price of mild
          ghosting under TSR with a fast rope and a static camera. It is read when the scene proxy is
          created, so restart PIE after changing it.
        </p>

        <h2>Does it work in packaged and dedicated-server builds?</h2>
        <p>
          Yes. The CPU fallback covers cook, <code>-nullrhi</code> and server contexts where no renderable
          RHI exists.
        </p>

        <h2>Is it replicated?</h2>
        <p>
          Not out of the box. The simulation is local, and <code>ApplyPreset</code> is a local stamp.
          Replicate your own gameplay decisions — throw, release, pull — and let each client simulate.
        </p>

        <h2>Which engine versions are supported?</h2>
        <p>
          Unreal Engine {PLUGIN.engineVersions.join(', ')} on {PLUGIN.platforms}. Install the Fab build that
          matches your engine version.
        </p>

        <Callout type="warn" title="Still stuck?">
          Reach out via the support channel listed on the Fab page.
        </Callout>
      </>
    ),
  },
}

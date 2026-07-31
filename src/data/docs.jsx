// Doc page content, keyed by slug. Kept as JSX so code blocks, tables and
// callouts render richly. Content is written against the shipping plugin
// headers (URopeComponent, URopeWielderComponent, the Core/ config structs).
// Still to replace before publishing: screenshots, video links, the Fab URL
// and the support address in nav.js.
import { CodeBlock, Callout, PropTable, Names, VideoEmbed } from '../components/DocPrimitives.jsx'
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
            <li>Per-bone capsules, baked per-bone SDFs, static world bodies and the engine Global Distance Field — all behind one collider interface</li>
            <li>Cross-actor wrapping, multi-bone wraps, moving-surface friction</li>
            <li>Enhanced Input wielder component, aim HUD, pull gauge, anim notifies</li>
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
          Developed and tested on <strong>{PLUGIN.platforms}</strong>. Worth separating two things that
          often get conflated: nothing in the plugin is gated to Windows — there is no platform allow
          list on the modules, and the GPU path is ordinary RDG compute with a CPU fallback behind it —
          but Windows is the only platform it has actually been run on. Treat anything else as
          unverified rather than as excluded.
        </p>

        <h2>Blueprint or C++</h2>
        <p>
          A rope can be built, thrown, tuned and reacted to entirely from Blueprint. The rope component
          exposes 33 callable functions and five assignable events, the wielder another 29, and the
          ragdoll response component five more — the throw, the wrap, the tension readout, pull, reel and
          release are all on that surface. See{' '}
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
          and on a replicated pawn the wielder deliberately does nothing for simulated proxies rather
          than fighting network smoothing with a locally guessed rope. A remote client will not see a
          correct rope. Plan for single-player, or for a mode where only the local player throws and
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
              '13 sample Blueprints',
              'Rope, snare, lever, pressure plate, elevator, movable target, crate, door, helicopter, basket goal and an AI character — worked examples rather than a single showcase actor.',
            ],
            ['A baked SDF asset', 'The third-person mannequin, already baked, so the SDF path runs without authoring anything first.'],
            ['Third-person template + throw / pull animations', 'A character to throw from on the first launch.'],
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
            Optionally tune <strong>Node Count</strong> (72 by default, max 512) and{' '}
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
          code={`FRopeThrowContext Ctx = FRopeThrowContext::MakeDefault(*Rope);
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
    Rope->SetActivePull(120000.f);   // constant pull force while taut
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
            ['Contacting', 'Logic', 'Candidates are re-collected every frame and the tracker’s dwell time decides whether to start wrapping.'],
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
            ['Tension', 'Max tension stayed above TensionReleaseForce for TensionReleaseTime.'],
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
          The solver only ever calls a single collider interface (<code>IRopeCollider::Query</code>) —
          it never knows whether the collider is a bone capsule, a per-bone SDF, a world box, a convex
          hull or the engine distance field. Providers (<code>IRopeColliderProvider</code>) supply
          colliders per frame, which is where broad phase happens.
        </p>

        <h2>Providers</h2>
        <PropTable
          columns={['Provider', 'Serves', 'Notes']}
          rows={[
            [
              <code key="a">URopeBoneCapsuleProvider</code>,
              'One analytic capsule per listed bone, rebuilt each frame',
              'Cheapest path. Set Bones and CapsuleRadius.',
            ],
            [
              <code key="b">URopeSDFProvider</code>,
              'Baked per-bone signed distance fields',
              'Surface-accurate. Needs a URopeSDFData asset; optional BoneFilter.',
            ],
            [
              <code key="c">URopeStaticBodyProvider</code>,
              'World boxes, capsules and convex hulls swept from the level',
              'Auto-spawned on an ARopeController. Optionally includes WorldDynamic bodies.',
            ],
            [
              <code key="d">URopeWrapTargetComponent</code>,
              'A static prop as a real wrap target',
              'Give a pole or beam a wrap axis and radius so the rope can coil it.',
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
          A capture commits only when at least <code>MinLatchNodes</code> nodes stay in sustained contact
          with one bone for <code>WrapDecisionTime</code>. From there the wrapping phase builds a surface
          path (analytic helix or surface vector field, chosen by <code>WrappingAxisSource</code>), moves
          the wrap front along it, and masks node mass as anchors latch. On commit, those nodes are frozen
          into bone-local space and re-placed on the skinned bone every frame — so the wrap follows
          animation.
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
          the gates on. Multi-bone wraps (catching both legs) are enabled by default —{' '}
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
            <code>bEnforceTargetLengthConstraint</code> — the wrapped target cannot either. Ragdoll
            targets are held by an engine physics constraint solved by Chaos alongside the joints, rather
            than by a per-frame impulse.
          </li>
          <li>
            <code>TetherCompliance</code> (<em>Rope Elasticity</em>) — 0 is rigid; raise it for a rope
            that gives.
          </li>
          <li>
            <code>LengthConstraintActivationSlop</code> — the slack, in cm, before the boundary engages.
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
          <code>SetActivePull(Force)</code> applies a <em>constant</em> force to the wrapped target every
          frame while the rope is taut. It is deliberately independent of measured tension, so there is no
          feedback runaway. 0 stops it.
        </p>
        <ul>
          <li>
            <code>PullForce</code> (100000 by default) is the wielder’s configured strength. Character
            targets divide it by mass and fight ground friction, so tens of thousands is the range you
            feel.
          </li>
          <li>
            If the target is too heavy or anchored, the same force pulls the <em>wielder</em> toward the
            anchor instead — climb-in. The decision is a pure, unit-testable function,{' '}
            <code>DecideTargetPullable()</code>, with a hysteresis margin so it cannot flap at the
            boundary.
          </li>
          <li>
            <code>ActivePullMaxLinearSpeed</code> / <code>ActivePullMaxAngularSpeed</code> cap what a
            physics body can be driven to.
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
          auto-selected whenever a renderable RHI exists (and, for the tube, the ring count is within
          budget). Otherwise the CPU path runs — during cook, under <code>-nullrhi</code>, on a dedicated
          server, or for oversized ropes.
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
            ['Tube rings', '512', 'The scene proxy automatically lowers Smoothing Subdivisions to fit; past that the tube falls back to CPU.'],
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
          This page is about where a rope’s cost goes, which dials move it, and how to measure your own
          numbers. It deliberately does not quote frame times: the answer depends on your hardware, your
          node counts and how many ropes are awake, and a figure measured on someone else’s machine
          would not be a budget you could plan against.
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
            [
              'Tube over 512 rings',
              'The tube only. That is roughly 170 nodes at a subdivision of 3 — a limit of the shader’s ring budget, so a very long or very finely subdivided rope hits it.',
            ],
          ]}
        />
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
            ['Substeps', '12', 'The main cost multiplier. Fewer substeps is cheaper and lets a fast rope stretch or tunnel.'],
            ['Iterations', '4', 'Constraint passes per substep. Fewer is cheaper and softer — the rope holds its length less exactly.'],
            [
              'Node count',
              'per rope',
              'Set by the rope’s length and segment length rather than typed in directly. It scales everything, and it is what pushes the tube past its 512-ring budget.',
            ],
            [
              'Allow Sleep',
              'on',
              'An idle rope stops solving entirely once every node has stayed under 3 cm/s for half a second. The single biggest saving in a scene full of ropes that are mostly hanging still.',
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

        <h2>Measuring your own budget</h2>
        <p>
          The plugin ships <strong>01_StressTest</strong> for exactly this. Open it, put the number of
          ropes you actually expect on screen, and read the three things that matter together:
        </p>
        <CodeBlock
          language="text"
          code={`stat unit     // game / draw / GPU — the frame budget
stat gpu      // where the GPU time actually goes
Gameplay Debugger -> RopePerf  // per-rope: is anything on the CPU path?`}
        />
        <p>
          Measure at your shipping node count and with your own collider setup — SDF colliders and
          analytic capsules are not the same cost — and record the result as a budget you can hold
          yourself to:
        </p>
        <PropTable
          columns={['Ropes on screen', 'Game thread', 'GPU', 'All on GPU path?']}
          rows={[
            ['1', '—', '—', '—'],
            ['10', '—', '—', '—'],
            ['50', '—', '—', '—'],
          ]}
        />
        <Callout type="info" title="Why this table is empty">
          We have not published figures we did not measure across a range of hardware. Fill this in from
          your own target machine — it is the only number that means anything for your project.
        </Callout>
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
          <code>URopePullGaugeWidget</code> for pull arming and engagement.
        </p>

        <h2>The preview</h2>
        <p>
          <code>URopePreviewComponent</code> renders the candidate wrap path as a tube before the throw.
          In <strong>Assisted</strong> mode it is display only. In <strong>Guaranteed</strong> mode it is
          authoritative: <code>BuildPreparedWrappingPreview()</code> produces the contacts and anchors that{' '}
          <code>ThrowWithPreparedPreview()</code> then executes, which is exactly why what you see is what
          you get.
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
            ['Relative Transform', 'Identity', 'Placement offset in the tip node’s frame; applies in every phase.'],
            ['Enable Collision', 'Off', 'Off by design — a display-only tip with collision fights the rope and the character capsule.'],
            ['Sync While Free', 'On', 'Turn off to drive Free-phase placement yourself via GetTipMeshComponent().'],
            ['Loaded Hand Socket', 'None', 'Guaranteed mode: the socket the tip is held at while Loaded.'],
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
          length, solver, throw, whip, wrap, hold, tip and render settings — applied to a component as one
          stamp.
        </p>
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
          </li>
          <li>No replication. It is a local stamp.</li>
          <li>
            <code>OnPresetApplied</code> fires on success only. The wielder subscribes to it to resync its
            mode-derived state, and game code can use it to refresh UI.
          </li>
        </ul>

        <h2>Trying presets in the editor</h2>
        <p>
          Register presets under <strong>Project Settings → Plugins → Dynamic Rope → Demo Presets</strong>,
          then cycle them with the console. These commands are compiled out of Shipping builds; game code
          should call <code>ApplyPreset</code> directly.
        </p>
        <CodeBlock
          language="text"
          code={`Rope.Preset.List      // list the registered demo presets
Rope.Preset.Cycle     // apply the next one to the ropes in the world
Rope.Preset.Apply <n> // apply a specific one`}
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
          Add it to the target actor and it subscribes to the rope’s wrap and release signals itself.
        </p>

        <h2>What it does</h2>
        <PropTable
          columns={['Setting', 'Default', 'Behavior']}
          rows={[
            ['Ragdoll On Wrapped', 'On', 'Go to ragdoll when a rope wraps this character.'],
            ['Delay', '0.3 s', 'Grace period before the ragdoll starts, so the wrap reads before the collapse.'],
            ['Only Below Wrapped Bone', 'Off', 'Simulate only the sub-tree under the wrapped bone — a caught leg without dropping the whole body.'],
            ['Recover On Release', 'On', 'Return to animation when the rope releases.'],
            ['Follow Camera While Ragdolled', 'On', 'Retarget the view to the ragdoll, with Follow Camera Lag and Recover Camera Blend to smooth it.'],
            ['Move Capsule To Mesh On Recover', 'On', 'Snap the character capsule to where the mesh ended up, using Recover Anchor Bone.'],
          ]}
        />

        <Callout type="info" title="Ragdoll targets get a real physics constraint">
          A ragdolled target is not held by a per-frame impulse. The rope creates an engine physics
          constraint — a kinematic corner proxy against an anchor point on the wrapped bone, with a
          spherical distance limit — so Chaos solves the rope’s length limit together with the ragdoll
          joints per substep. That is what keeps it stable instead of jittering or winching.
        </Callout>

        <h2>Testing it</h2>
        <CodeBlock
          language="text"
          code={`Rope.Ragdoll           // ragdoll the target
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
          <li>Open the <strong>Rope SDF Authoring</strong> tab from the editor’s Tools menu.</li>
          <li>Pick the skeletal mesh, adjust the bake settings, and bake.</li>
          <li>
            Add a <code>URopeSDFProvider</code> to the character, assign the baked asset, and optionally
            narrow <strong>Bone Filter</strong> to the bones you actually want wrappable.
          </li>
        </ol>

        <h2>Bake settings</h2>
        <PropTable
          columns={['Setting', 'Default', 'Effect']}
          rows={[
            ['Voxel Size', '2 cm', 'Sample spacing. Smaller sharpens the surface but costs memory and bake time.'],
            ['Max Resolution', '48', 'Cap on samples per axis. A bone that would exceed it gets a coarser voxel size instead.'],
            ['Precision', '16-bit', 'Distance quantization. 16-bit is 256× finer than 8-bit at double the size.'],
            ['Narrow Band', '3 cm', 'Outward detection band. The rope starts reacting from this far out; ~2–3× the collision radius is stable. The inward band is auto-sized per bone.'],
            ['Weight Threshold', '0.2', 'Minimum average skin weight for a triangle to be assigned to a bone.'],
            ['Bounds Padding', '0 cm', 'Expand each bone’s triangle AABB before voxelizing.'],
            ['Min Bone Girth', '8 cm', 'Bones thinner than this are not baked. Set it near the collision radius of the thinnest rope that will use the asset; 0 bakes everything.'],
          ]}
        />

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
          The SDF collider derives its surface velocity from the bone’s per-frame motion, so a swinging
          limb sweeps the rope aside — something the analytic capsule provider does not do.
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
          The plugin registers two categories. Open the Gameplay Debugger (apostrophe by default) and
          enable <strong>Rope</strong> or <strong>RopePerf</strong>. Both drop out of Shipping builds
          automatically.
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
          dropped to the CPU path.
        </p>

        <h2>Console</h2>
        <CodeBlock
          language="text"
          code={`r.DynamicRope.ForceCPUSolve 1        // force the CPU path (parity checks, GPU isolation)
r.DynamicRope.Debug.LogSDFProjection 1  // log SDF surface projections

Rope.Preset.List / .Cycle / .Apply    // preset cycling (non-Shipping)
Rope.Ragdoll / .Recover / .Destroy    // ragdoll response testing (non-Shipping)`}
        />

        <h2>Automation tests</h2>
        <p>
          C++ automation tests cover the solver, wrap controller, SDF sampler, GPU solver, length
          constraint, traction, wielder lifecycle and presets. Run them from{' '}
          <strong>Tools → Session Frontend → Automation</strong>, filtering on <code>Rope.</code>.
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
          <code>ARopeDemoSnare</code>, <code>ARopeDemoRespawnVolume</code> and{' '}
          <code>ARopeDemoPresetVolume</code>. Each exposes a Blueprint-assignable state delegate.
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
              'Hosts the static world collider provider — exactly one per world. Subclass it to change budgets, or clear the class in project settings to place your own.',
            ],
          ]}
        />

        <h2>Collision providers</h2>
        <PropTable
          columns={['Class', 'Attach to', 'Role']}
          rows={[
            [<code key="a">URopeBoneCapsuleProvider</code>, 'A skeletal actor', 'One analytic capsule per listed bone, rebuilt each frame.'],
            [<code key="b">URopeSDFProvider</code>, 'A skeletal actor', 'Serves colliders sampling a baked URopeSDFData volume.'],
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
            [<Names key="g">URopePluginInfoHUD / URopePluginInfoWidget</Names>, 'In-game key guide, capabilities and limitations panels for demo levels.'],
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
            ['Node Count', '72', 'Simulated particles. Max 512 (the GPU thread-group limit). Init-time only.'],
            ['Rope Length', '600 cm', 'Initial and maximum length. Init-time only; runtime changes go through SetRopeLength.'],
            ['Min Rope Length', '100 cm', 'The shortest reeling in can reach.'],
            ['Reel Speed', '150 cm/s', 'The rate the wielder’s reel inputs use.'],
            ['Rope Radius', '2 cm', 'Visual tube radius. Also the source for the auto-derived collision radii.'],
            ['Sides', '8', 'Tube cross-section sides.'],
            ['Smoothing Subdivisions', '1 (off)', 'Render-only Catmull-Rom subdivision per segment.'],
            ['Smoothing Strength', '0.5', 'Catmull-Rom knot α: 0 uniform, 0.5 centripetal, 1 chordal.'],
            ['Material', 'Engine default', 'Replace at runtime with SetMaterial(0, M), not by direct assignment.'],
            ['Collide With Owner', 'Off', 'Turn on when the rope is mounted on a prop it must collide with.'],
            ['Use World Distance Field', 'On', 'Global-distance-field push-out from static world geometry (GPU path).'],
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
            ['Gravity', '(0, 0, -980)', 'Per-rope gravity.'],
            ['Motion Damping', '0.02', 'Velocity damping per substep.'],
            ['Allow Sleep', 'On', 'Skip solving a settled Free rope.'],
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
            ['Frame Mode', 'Owner', 'Where the throw direction comes from — Owner, OwnerCamera or Custom.'],
            ['Swing Plane', 'Aim And Frame Up', 'The plane the whip swings in.'],
            ['Throw Speed', '1500 cm/s', 'Initial tip speed.'],
            ['Return If No Contact', '0 s (off)', 'Auto-return the rope if flight makes no contact within this time.'],
            ['Tip Velocity Boost', '1.0', 'Extra speed weighting toward the tip.'],
            ['Motion Inheritance', '5.0', 'How much owner and hand-animation velocity is inherited.'],
            ['Guided Throw Arc Height Ratio', '0.25', 'Guaranteed mode: arc height of the guided path.'],
            ['Custom Forward / Up / Right', 'Axis defaults', 'Used when Frame Mode is Custom.'],
          ]}
        />

        <h2>Whip — <code>FRopeWhipConfig</code></h2>
        <p>The throw’s presentation swing during Flight. Not used in Guaranteed mode.</p>
        <PropTable
          rows={[
            ['Guided Length', '0.65', 'The fraction of the rope the guide curve drives.'],
            ['Sweep Angle', '180°', 'The angle swept from the starting angle round to the aim direction.'],
          ]}
        />

        <h2>Wrap — <code>FRopeWrapConfig</code></h2>
        <p>Capture thresholds and wrap-path construction. Not used in Guaranteed mode.</p>
        <PropTable
          rows={[
            ['Enable Multi Bone Wrapping', 'On', 'Allow a wrap spanning several bones (both legs, for example).'],
            ['Contact Query Radius (0 = Auto)', '0', 'Detection radius; auto derives from the render radius × 1.5.'],
            ['Min Latch Nodes', '1', 'Nodes that must be in sustained contact with one bone to capture.'],
            ['Wrap Decision Time', '0.016 s', 'How long that contact must persist.'],
            ['Predictive Contact Frames', '1.0', 'How far ahead node motion is extrapolated for predicted contacts.'],
            ['Wrapping Axis Source', 'Bone-Centered Guide Plane', 'How the wrap axis is derived.'],
            ['Wrapping Motion Duration', '0.20 s', 'How long the wrap front takes to travel the path.'],
            ['Wrapping Angular Speed', '1100 °/s', 'The front’s angular rate along the path.'],
            ['Max Wrap Seeds', '1', 'Concurrent wrap seeds considered.'],
            ['Failed Wrap Min Angle', '120°', 'Below this accumulated angle a wrap attempt counts as failed.'],
            ['Commit Min Wrap Angle', '0° (off)', 'Quality gate: reject a commit below this wrapped angle.'],
            ['Commit Min Wrap Coverage', '0° (off)', 'Quality gate: reject a commit below this angular coverage.'],
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
            ['Enforce Rope Length (Target)', 'On', 'Neither can the wrapped target.'],
            ['Rope Elasticity', '0.0', 'Length-constraint compliance. 0 is rigid.'],
            ['Length Constraint Activation Slop', '0.5 cm', 'Slack before the boundary engages.'],
            ['Taut Sensitivity', '0.5', 'One knob [0..1] driving both the slack ratio and the max allowed sag.'],
            ['Pull Strength', '100000', 'The constant active-pull force.'],
            ['Pull Requires Taut', 'On', 'Gate active pull on the rope being taut.'],
            ['Active Pull Taut Tension', '0 (off)', 'Additionally require this much load before pull engages.'],
            ['Pull Corner Angle', '30°', 'Bend angle that counts as a corner when deriving the pull direction.'],
            ['Active Pull Max Linear / Angular Speed', '300 cm/s / 720 °/s', 'Caps on driving a physics body.'],
            ['Tether Speed Limit', '1500 cm/s', 'Cap on tether-driven motion.'],
            ['Tether Recovery Speed', '150 cm/s', 'Cap on the positional-bias recovery rate.'],
            ['Tether Sideways Damping', '0.3', 'Damping perpendicular to the rope.'],
            ['Max Tether Tension', '500000', 'Ceiling on the tether impulse.'],
            ['Ground Brace Factor', '1.5', 'How much a grounded wielder resists being dragged.'],
            ['Release At Tension', '0 (off)', 'Auto-release above this load.'],
            ['Tension Release Time', '0.05 s', 'How long it must stay above.'],
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
            ['Aim Hud Widget Class', 'URopeAimWidget', 'Aim HUD. Point at a WBP subclass to restyle; clear to disable.'],
            ['Pull Gauge Widget Class', 'URopePullGaugeWidget', 'Pull gauge. Same pattern.'],
            ['Demo Presets', 'Empty', 'Presets for the non-Shipping Rope.Preset console commands.'],
            ['Write Velocity', 'Off', 'Whether the rope tube writes to the velocity buffer. Off avoids motion-blur smearing; on trades that against TSR ghosting.'],
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
        <PropTable
          columns={['Node', 'Notes']}
          rows={[
            [<code key="a">Throw</code>, 'Direction comes from ThrowParams.FrameMode.'],
            [<code key="b">Throw With Context</code>, 'Explicit origin, frame, speed.'],
            [<code key="c">Enter Loaded</code>, 'Guaranteed mode: ready the tip in hand. Valid from Free or Loaded.'],
            [<code key="d">Release Wrap</code>, 'Manual release.'],
            [<code key="e">Cut Rope</code>, 'Same flow, reported as ERopeReleaseReason::Cut so the game can react differently.'],
            [<code key="f">Set Active Pull</code>, 'Constant pull force while taut; 0 stops. bIgnoreTautGate bypasses the gate for this call.'],
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
          ]}
        />

        <h2>Wielder actions</h2>
        <PropTable
          columns={['Node', 'Notes']}
          rows={[
            [<Names key="a">Throw / Throw Now / Throw In Direction</Names>, 'Throw with the montage, immediately, or toward an explicit direction.'],
            [<code key="b">Toggle Throw</code>, 'What the throw input does when Throw Toggles Hold is on (the default).'],
            [<Names key="c">Start Pull / Stop Pull</Names>, 'Arm and disarm. Engagement waits for Pull Engage Tension.'],
            [<Names key="d">Start Pull Now / Stop Pull Now</Names>, 'Skip the arming stage.'],
            [<Names key="e">Start Reel In / Start Reel Out / Stop Reel</Names>, 'Held-input reeling at the rope’s Reel Speed.'],
            [<Names key="f">Release / Cut</Names>, 'Forwarded to the rope.'],
            [<Names key="g">Play Throw Montage / Play Pull Montage</Names>, 'Manual montage triggers.'],
            [<code key="h">Build Throw Context</code>, 'Blueprint-overridable context construction from an aim direction.'],
            [<Names key="i">Uses Aim Ray / Is Aim Active / Uses Locked Preview / Is Pull Armed / Is Pull Engaged / Get Pull Engage Progress</Names>, 'State queries for UI.'],
          ]}
        />

        <h2>World-wide signals (C++)</h2>
        <p>
          For systems that react to <em>any</em> rope — HUDs, AI, demo props — subscribe on the subsystem
          instead of on each component. These are native multicast delegates, not dynamic ones.
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
          Subclass <code>URopeComponent</code> and override the hooks below. All of them run on the game
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
          Implement <code>IRopeCollider::Query()</code> and serve it from an{' '}
          <code>IRopeColliderProvider</code>. <code>FRopeContact</code> is a{' '}
          <strong>frozen contract</strong> — every collider must obey it exactly:
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
          No. The plugin does not replicate rope or wrap state, and on a replicated pawn the wielder
          deliberately does nothing for simulated proxies rather than projecting a locally guessed rope
          that would fight network smoothing. A remote client will not see a correct rope. See{' '}
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
          The wrap must actually commit — enough nodes in sustained contact with one bone for the decision
          time. If it releases immediately, lower <code>MinLatchNodes</code> or raise{' '}
          <code>WrapDecisionTime</code>, and check whether <code>CommitMinWrapAngleDeg</code> /{' '}
          <code>CommitMinWrapCoverageDeg</code> are rejecting the commit. Both are reported on the wrap
          event, so log them from a real throw before tuning.
        </p>

        <h2>Pull does nothing.</h2>
        <p>
          Active pull is gated on the rope being taut. Verify with <code>IsPullTaut()</code>, then either
          reel in, lower <strong>Taut Sensitivity</strong>, or turn off{' '}
          <code>bActivePullRequiresTaut</code>. If the target is a character, remember movement divides the
          force by mass and fights ground friction — the default <code>PullForce</code> of 100000 is the
          right order of magnitude, not an upper bound. If the target is anchored or very heavy, the pull
          intentionally reverses into climb-in and drags the wielder instead.
        </p>

        <h2>The rope quietly got slow.</h2>
        <p>
          It probably dropped to the CPU path. Enable the <strong>RopePerf</strong> Gameplay Debugger
          category — it marks each rope <code>gpu</code> or <code>cpu</code>, so a stray <code>cpu</code>
          row is the answer. Switch to the <strong>Rope</strong> category if you then need to know which
          kind of frame it was. The usual causes are a node count or ring count above 512, or no
          renderable RHI.
        </p>

        <h2>Performance dips with many ropes.</h2>
        <p>
          Ropes solve in parallel and share one collider gather per frame. Keep node and ring counts within
          the GPU budget, leave sleep and distance LOD on, and lower{' '}
          <strong>Static Body Max Colliders Per Rope</strong> in dense scenes — the GPU kernel loops
          colliders per node per substep, so that number multiplies directly into cost.
        </p>

        <h2>The rope smears when it moves fast.</h2>
        <p>
          That is per-object motion blur. <strong>Write Velocity</strong> is off by default to avoid it; if
          you instead see mild ghosting under TSR with a static camera and a fast rope, turn it on and
          compare. It is read when the scene proxy is created, so restart PIE after changing it.
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

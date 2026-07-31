// Encodes the originals in media-src/ into the WebP files the site serves from
// public/media/. Run it with `npm run media`.
//
// Why two directories: public/media/ is committed, because GitHub Pages serves
// the repo, but re-encoding a lossy file every run would compress it again and
// again. media-src/ holds the pristine capture and is gitignored, so the
// originals stay on disk and out of a history that cannot forget a binary.
//
// Add a shot by dropping it in media-src/ and running this. The name carries
// over: media-src/Debugging.png becomes public/media/Debugging.webp, which is
// the path features.js references (without a leading slash — see lib/asset.js).

import { readdirSync, statSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const hash = (file) => createHash('sha1').update(readFileSync(file)).digest('hex')

const SRC = 'media-src'
const OUT = 'public/media'
// Records a hash of each output this script wrote, so the next run can tell its
// own work from a file someone else put there. Lives beside the originals, so
// it is gitignored along with them.
//
// Content, not mtime: a checkout or a merge rewrites public/media/ and moves
// every mtime, which made an earlier version of this check fire on all five
// files after an ordinary `git merge`. Git restores the same bytes, so a hash
// stays put through that while still catching a genuinely different file.
const MANIFEST = join(SRC, '.manifest.json')

// Lossy WebP goes after fine glyphs before it touches anything else, and these
// two shots exist to be read: the bake panel's settings and the debugger's
// solve= line. They were lossless at first, which was the safe guess and an
// expensive one -- 370KB and 650KB against 37KB for a render. Encoded at both
// and compared at 1:1, q90 is indistinguishable from lossless on either, while
// q80 does visibly mush the low-contrast grey rows (particles=, registered=).
// So text shots get q90, and everything else -- 3D renders with no glyphs in
// them -- stays at q80.
const TEXT = new Set(['Authoring', 'Debugging', 'StressTest'])
const QUALITY = 80
const QUALITY_TEXT = 90
// StressTest is a clip rather than a still, and a lossy frame every 80ms adds up
// where a single one does not: at q90 it is 5.6MB and at q70 it is 1.8MB, over
// seven seconds in which nothing holds still long enough to be studied. The text
// in it stays legible because the crop below keeps it near its captured size.
const QUALITY_CLIP = 70

// Two things arrive wrong in a capture and are worth fixing here rather than by
// hand: a grab taken in a window rather than fullscreen is letterboxed, and a
// clip is captured at whatever the window was rather than at the width it will
// be displayed. Doing it in the script is what makes `npm run media` reproduce
// what the site serves -- prepared by hand, the next run would quietly replace
// the shot with the raw grab it was made from.
//
// `crop` is in the source's own pixels; `width` is what to scale to afterwards.
// 800 is the doc measure (.doc max-width), so the clip is served at the size it
// is drawn at and the browser scales nothing.
const PREPARE = {
  StressTest: { crop: { left: 456, top: 176, width: 996, height: 792 }, width: 800 },
}

// Frames fill with object-fit: cover, so anything off-ratio loses its edges
// rather than letterboxing. The hero frame is taller than the showcase rows.
const RATIOS = { Hero: 16 / 11 }
const DEFAULT_RATIO = 16 / 9
const RATIO_TOLERANCE = 0.01
// Doc figures are not in a frame at all -- DocPrimitives' Figure draws them at
// their own ratio, precisely so a readout cannot be cropped off the edge. The
// ratio warning does not apply to them, and firing it anyway would be the kind
// of standing false alarm that teaches people to skip the warnings that matter.
const UNFRAMED = new Set(['StressTest'])

if (!existsSync(SRC)) {
  console.error(`No ${SRC}/ directory. Put the original captures there.`)
  process.exit(1)
}
mkdirSync(OUT, { recursive: true })

const inputs = readdirSync(SRC).filter((f) => /\.(png|jpe?g|webp|tiff?)$/i.test(f))
if (!inputs.length) {
  console.error(`No images in ${SRC}/.`)
  process.exit(1)
}

// Missing on a fresh clone, which simply means the first run has nothing to
// compare against and skips the check.
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {}

// Check every output before writing any of them. A new capture dropped straight
// into public/media/ is the easy mistake: this script would overwrite it with
// the stale original and the new shot would be gone. "Output newer than source"
// cannot detect that — after any successful run every output is newer than its
// source. What does detect it is the output's contents having changed since
// *this script* last wrote them.
//
// This runs as its own pass so that bailing out really does leave everything
// alone. Checking inside the convert loop would already have rewritten whatever
// sorted earlier than the offending file.
const tampered = inputs
  .map((file) => parse(file).name)
  .filter(
    (name) =>
      existsSync(join(OUT, `${name}.webp`)) &&
      manifest[name] !== undefined &&
      hash(join(OUT, `${name}.webp`)) !== manifest[name],
  )

if (tampered.length) {
  for (const name of tampered) {
    console.error(`${join(OUT, `${name}.webp`)} has been modified since it was last generated.`)
  }
  console.error(
    `\nIf that is a new capture, move it to ${SRC}/ — it is the original, and this\n` +
      `script would have overwritten it with the older one. Nothing was written.`,
  )
  process.exit(1)
}

let totalIn = 0
let totalOut = 0
const warnings = []

for (const file of inputs.sort()) {
  const { name } = parse(file)
  const src = join(SRC, file)
  const out = join(OUT, `${name}.webp`)
  const prepare = PREPARE[name]

  // `animated` makes sharp read every frame instead of only the first, which is
  // the difference between re-encoding a clip and silently flattening it to its
  // opening frame. A still has one page, so this costs nothing to pass always.
  // It does change what metadata reports: `height` becomes the height of all the
  // frames stacked, and `pageHeight` is the one frame's height.
  const image = sharp(src, { animated: true })
  const { width, height, pageHeight, pages = 1 } = await image.metadata()
  const frameHeight = pageHeight ?? height
  const quality = pages > 1 ? QUALITY_CLIP : TEXT.has(name) ? QUALITY_TEXT : QUALITY

  // Ratio is checked on what gets served, so after the crop rather than before:
  // a letterboxed grab is the wrong shape by definition, and warning about the
  // shape of something already being fixed says nothing.
  const shownW = prepare?.crop?.width ?? width
  const shownH = prepare?.crop?.height ?? frameHeight
  const expected = RATIOS[name] ?? DEFAULT_RATIO
  const actual = shownW / shownH
  if (!UNFRAMED.has(name) && Math.abs(actual - expected) > RATIO_TOLERANCE) {
    warnings.push(
      `${name}: ${shownW}x${shownH} is ${actual.toFixed(3)}, wanted ${expected.toFixed(3)} — ` +
        `object-fit: cover will crop it`,
    )
  }

  // extract() and resize() both act per frame on an animated input, so a clip
  // comes out with its frame count and timing intact.
  let pipeline = image
  if (prepare?.crop) pipeline = pipeline.extract(prepare.crop)
  if (prepare?.width) pipeline = pipeline.resize({ width: prepare.width })
  await pipeline.webp({ quality }).toFile(out)

  const inBytes = statSync(src).size
  const outBytes = statSync(out).size
  manifest[name] = hash(out)
  totalIn += inBytes
  totalOut += outBytes
  const kb = (n) => `${(n / 1024).toFixed(0)}KB`
  console.log(
    `${name.padEnd(14)} ${`q${quality}`.padEnd(9)} ` +
      `${kb(inBytes).padStart(7)} -> ${kb(outBytes).padStart(7)}`,
  )
}

const kb = (n) => `${(n / 1024).toFixed(0)}KB`
console.log(`${''.padEnd(14)} ${''.padEnd(9)} ${kb(totalIn).padStart(7)} -> ${kb(totalOut).padStart(7)}`)

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2))

if (warnings.length) {
  console.log('')
  for (const w of warnings) console.log(`warning: ${w}`)
}

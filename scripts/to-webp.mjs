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
import { join, parse } from 'node:path'
import sharp from 'sharp'

const SRC = 'media-src'
const OUT = 'public/media'
// Records the mtime this script gave each output, so the next run can tell its
// own work from a file someone else put there. Lives beside the originals, so
// it is gitignored along with them.
const MANIFEST = join(SRC, '.manifest.json')

// Lossy WebP goes after fine glyphs before it touches anything else, and these
// two shots exist to be read: the bake panel's settings and the debugger's
// solve= line. Everything else is a 3D render with no text in it, where q80 is
// indistinguishable and roughly a quarter of the bytes.
const LOSSLESS = new Set(['Authoring', 'Debugging'])
const QUALITY = 80

// Frames fill with object-fit: cover, so anything off-ratio loses its edges
// rather than letterboxing. The hero frame is taller than the showcase rows.
const RATIOS = { Hero: 16 / 11 }
const DEFAULT_RATIO = 16 / 9
const RATIO_TOLERANCE = 0.01

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
// source. What does detect it is the output having changed since *this script*
// last wrote it.
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
      statSync(join(OUT, `${name}.webp`)).mtimeMs !== manifest[name],
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
  const lossless = LOSSLESS.has(name)

  const image = sharp(src)
  const { width, height } = await image.metadata()

  const expected = RATIOS[name] ?? DEFAULT_RATIO
  const actual = width / height
  if (Math.abs(actual - expected) > RATIO_TOLERANCE) {
    warnings.push(
      `${name}: ${width}x${height} is ${actual.toFixed(3)}, wanted ${expected.toFixed(3)} — ` +
        `object-fit: cover will crop it`,
    )
  }

  await image.webp(lossless ? { lossless: true } : { quality: QUALITY }).toFile(out)

  const inBytes = statSync(src).size
  const outBytes = statSync(out).size
  manifest[name] = statSync(out).mtimeMs
  totalIn += inBytes
  totalOut += outBytes
  const kb = (n) => `${(n / 1024).toFixed(0)}KB`
  console.log(
    `${name.padEnd(14)} ${(lossless ? 'lossless' : `q${QUALITY}`).padEnd(9)} ` +
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

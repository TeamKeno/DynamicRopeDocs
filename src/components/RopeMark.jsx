/**
 * The brand mark: a figure-eight knot, drawn after the 🪢 emoji it replaces.
 * An emoji is drawn by whichever colour font the visitor's system ships, so the
 * mark was a different picture on Windows, macOS and Android, and U+1FAA2 is
 * recent enough — Unicode 13 — that older systems drew an empty box instead.
 *
 * The same geometry is in public/favicon.svg. Edit both together or they drift.
 */

/**
 * Two loops of equal radius whose centres sit on the diagonal, overlapping so
 * their outlines cross twice — at (13.1, 13.1) and (18.9, 18.9). Each loop is
 * drawn as one long arc with a gap at a different crossing, which is what makes
 * the two weave through each other instead of merely overlapping: the upper
 * loop passes in front at the top-left crossing, the lower loop at the
 * bottom-right one. The gaps are cut rather than painted over in the page's
 * colour, so the weave survives the header's translucent background.
 *
 * The tails run on along the same diagonal, out to opposite corners.
 */
const LOOPS = [
  'M16.8 18.2A7 7 0 1 1 21.1 18.9',
  'M15.2 13.8A7 7 0 1 1 10.9 13.1',
]

// The tails begin on the loop's centreline so the rope joins solidly, which
// means their first stretch runs underneath the loop itself — the ring is
// 5.2 wide, so it covers everything out to 2.6 past that centreline.
const TAILS = ['M24.9 7.1L28.5 3.5', 'M7.1 24.9L3.5 28.5']

// Pale ticks stepping along the rope, as the emoji has them: dashes laid on
// each strand, following every curve for free, on a stroke narrower than the
// rope so they sit inset from its edges.
//
// Butt caps, and not by preference — a round cap adds half the stroke width to
// each end of every dash. Inheriting the rope's round caps grew each 1.8-long
// tick to 5.2 and closed the 3.4 gap entirely, running them into one bar.
const TWIST = {
  stroke: '#f6c79b',
  strokeWidth: 3.4,
  strokeLinecap: 'butt',
  strokeDasharray: '1.8 3.4',
  opacity: 0.7,
}

// Ticks on a tail have to clear the loop before they start, or the first one
// lands on top of the ring and reads as the ring's own. Offsetting by the 2.6
// the ring covers pushes it out to the edge; the dash period is 5.2, so each
// tail then carries exactly one.
const TAIL_TWIST_OFFSET = 2.6

export default function RopeMark({ size = 22, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      strokeLinecap="round"
      aria-hidden
    >
      <defs>
        <linearGradient
          id="rope-mark-strand"
          x1="28"
          y1="4"
          x2="4"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#d98443" />
          <stop offset="1" stopColor="#9c5220" />
        </linearGradient>
      </defs>

      <g stroke="url(#rope-mark-strand)" strokeWidth="5.2">
        {[...LOOPS, ...TAILS].map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      <g {...TWIST}>
        {LOOPS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      <g {...TWIST} strokeDashoffset={TAIL_TWIST_OFFSET}>
        {TAILS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  )
}

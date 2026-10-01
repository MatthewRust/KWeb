// Placeholder crayon lettering of "KIRSTY" (after Daria's homepage) until Kirsty's own is scanned in.
// Each stroke draws in turn, overlapping the last a little, like a hand writing it.
const STROKES = [
  ['M15 14 C16 42 13 78 16 110', 220], // K
  ['M68 12 C55 30 36 50 18 67', 180],
  ['M32 54 C44 72 56 92 72 112', 200],
  ['M99 15 C97 46 101 80 98 109', 200], // I
  ['M133 16 C132 46 135 80 132 110', 200], // R
  ['M133 17 C158 6 190 14 186 37 C183 56 160 62 137 59', 320],
  ['M151 60 C163 77 175 95 191 111', 200],
  ['M264 24 C256 9 226 6 219 24 C212 42 240 51 255 60 C272 70 268 99 246 107 C230 113 214 105 209 93', 420], // S
  ['M282 18 C305 13 334 15 357 12', 200], // T
  ['M319 15 C321 46 317 80 320 110', 200],
  ['M377 13 C388 31 398 45 408 58', 150], // Y
  ['M442 11 C430 30 418 46 408 58', 150],
  ['M408 58 C409 78 406 95 408 112', 170],
];

const TIMED = STROKES.reduce((acc, [d, ms]) => {
  const prev = acc.at(-1);
  const delay = prev ? prev.delay + prev.ms * 0.7 : 150;
  return [...acc, { d, ms, delay }];
}, []);

export default function HandName({ className = '' }) {
  return (
    <svg viewBox="0 0 460 124" aria-hidden="true" className={`overflow-visible ${className}`}>
      <g filter="url(#crayon)" fill="none" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round">
        {TIMED.map(({ d, ms, delay }) => (
          <path key={d} d={d} pathLength="1" className="draw" style={{ '--delay': `${delay}ms`, '--draw': `${ms}ms` }} />
        ))}
      </g>
    </svg>
  );
}

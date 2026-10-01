// A loose crayon line wandering across empty paper (after Daria's homepage). Decorative only: keep it off body text.
const LINE =
  'M18 8 C30 34 58 46 80 62 C104 80 92 110 116 126 C140 142 168 128 174 152 C182 182 136 196 146 228 C154 252 196 246 200 220 C204 196 166 196 164 224 C162 256 196 284 232 306';

export default function Scribble({ className = '', delay = 0 }) {
  return (
    <svg viewBox="0 0 240 320" aria-hidden="true" className={`overflow-visible ${className}`}>
      <path
        d={LINE}
        pathLength="1"
        className="draw"
        style={{ '--delay': `${delay}ms`, '--draw': '1600ms' }}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#crayon)"
      />
    </svg>
  );
}

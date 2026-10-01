// A loose hand-drawn ring around a few inline words, like WOB's pencil circle round "print fair!".
const RING = 'M18 8 C50 -2 104 2 114 18 C122 32 92 42 58 41 C22 40 2 32 6 20 C9 10 30 5 52 4';

export default function Circled({ children, className = 'text-ultramarine', delay = 0 }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 120 44"
        preserveAspectRatio="none"
        className={`pointer-events-none absolute -top-[0.3em] -left-[0.4em] h-[calc(100%+0.6em)] w-[calc(100%+0.8em)] overflow-visible ${className}`}
      >
        <path
          d={RING}
          pathLength="1"
          className="draw"
          style={{ '--delay': `${delay}ms`, '--draw': '700ms' }}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#crayon)"
        />
      </svg>
    </span>
  );
}

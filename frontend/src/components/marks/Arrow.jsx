// Hand-drawn arrow joining a note to its subject (WOB, Héloïse). Points up and to the right; rotate to aim it.
export default function Arrow({ className = '', delay = 0 }) {
  return (
    <svg viewBox="0 0 120 90" aria-hidden="true" className={`overflow-visible ${className}`}>
      <g filter="url(#crayon)" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 80 C34 76 70 58 104 18" pathLength="1" className="draw" style={{ '--delay': `${delay}ms`, '--draw': '500ms' }} />
        <path d="M87 15 L105 17 L102 36" pathLength="1" className="draw" style={{ '--delay': `${delay + 450}ms`, '--draw': '250ms' }} />
      </g>
    </svg>
  );
}

// A photograph laid on the page like a physical print (STYLE_GUIDE §8): white border, shadow, tilt, optional tape.
export default function Print({ children, caption, tilt = 0, tape = false, delay = 0, className = '' }) {
  return (
    <figure
      className={`settle paper relative bg-paper-bright p-3 ${className}`}
      style={{ '--tilt': `${tilt}deg`, '--delay': `${delay}ms` }}
    >
      {tape && <span aria-hidden="true" className="tape" />}
      {children}
      {caption && <figcaption className="px-1 pt-3 font-hand text-note text-ink-soft">{caption}</figcaption>}
    </figure>
  );
}

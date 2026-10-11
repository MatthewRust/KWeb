// A photograph laid on the page like a physical print (STYLE_GUIDE §8): white border, shadow, tilt, optional tape.
// `polaroid` gives it the deeper white strip along the bottom, always there, with any caption written small inside it.
export default function Print({ children, caption, tilt = 0, tape = false, polaroid = false, delay = 0, className = '' }) {
  return (
    <figure
      className={`settle paper relative bg-paper-bright p-3 ${polaroid ? 'pb-0' : ''} ${className}`}
      style={{ '--tilt': `${tilt}deg`, '--delay': `${delay}ms` }}
    >
      {tape && <span aria-hidden="true" className="tape" />}
      {children}
      {polaroid ? (
        <figcaption className="flex min-h-12 items-center px-0.5 py-2 font-hand text-caption leading-tight text-ink-soft">{caption}</figcaption>
      ) : (
        caption && <figcaption className="px-1 pt-3 font-hand text-note text-ink-soft">{caption}</figcaption>
      )}
    </figure>
  );
}

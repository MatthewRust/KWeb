// A scrap of pink paper with a handwritten note (April's salmon paper, WOB's diary notes).
export default function StickyNote({ children, tilt = 0, delay = 0, className = '' }) {
  return (
    <p
      className={`settle paper bg-rose px-5 py-4 font-hand text-note text-ink ${className}`}
      style={{ '--tilt': `${tilt}deg`, '--delay': `${delay}ms` }}
    >
      {children}
    </p>
  );
}

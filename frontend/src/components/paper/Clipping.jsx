// A newsprint note card taped to the page (after the article clipping in the April Archive).
export default function Clipping({ dateline, title, text, tilt = 0, delay = 0, className = '' }) {
  return (
    <article
      className={`settle paper relative bg-newsprint px-6 pt-8 pb-6 ${className}`}
      style={{ '--tilt': `${tilt}deg`, '--delay': `${delay}ms` }}
    >
      <span aria-hidden="true" className="tape" />
      <p className="font-sans text-label uppercase text-graphite">{dateline}</p>
      <h3 className="mt-5 text-h2 italic">{title}</h3>
      <p className="mt-4 text-body text-ink-soft">{text}</p>
    </article>
  );
}

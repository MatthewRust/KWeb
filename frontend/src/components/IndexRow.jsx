import { Link } from 'react-router';
import Underline from './marks/Underline.jsx';

// One line of the catalogue, set like the date | entry lists in Samson's and Héloïse's CVs (STYLE_GUIDE §11).
export default function IndexRow({ number, title, dek, theme, date, to = '/essays', delay = 0 }) {
  return (
    <li className="rise" style={{ '--delay': `${delay}ms` }}>
      <Link
        to={to}
        className="group grid grid-cols-[3.5rem_1fr] gap-x-4 gap-y-2 py-5 transition-transform active:translate-y-px md:grid-cols-[4.5rem_1fr_9rem_5rem] md:items-baseline"
      >
        <span className="pt-1 font-sans text-label uppercase text-graphite tabular-nums">Nº {number}</span>
        <span>
          <span className="relative inline-block text-h3 transition-colors group-hover:text-ultramarine">
            {title}
            <Underline />
          </span>
          {dek && <span className="mt-1.5 block text-caption italic text-ink-soft">{dek}</span>}
        </span>
        <span className="col-start-2 flex gap-4 font-sans text-label uppercase text-graphite md:contents">
          <span>{theme}</span>
          <span className="md:text-right">{date}</span>
        </span>
      </Link>
    </li>
  );
}

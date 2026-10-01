import { useLocation } from 'react-router';
import { SITE_NAME, pageFor } from '../site.js';

// Folio, as at the foot of a magazine page (Memoir): page number, then the title in sienna italic.
export default function Footer() {
  const { folio } = pageFor(useLocation().pathname);

  return (
    <footer className="mt-auto border-t border-rule">
      <div className="page-width flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-6">
        <p className="flex items-baseline gap-3">
          <span className="font-sans text-label lining-nums">{folio}</span>
          <span className="text-h3 italic text-sienna">{SITE_NAME}.</span>
        </p>
        <p className="font-sans text-label uppercase text-graphite lining-nums">Kirsty · {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}

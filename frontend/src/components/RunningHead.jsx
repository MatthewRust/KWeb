import { Link, useLocation } from 'react-router';
import { SITE_NAME, pageFor } from '../site.js';

// Magazine running head (WOB, Memoir): issue date · site name · current section.
export default function RunningHead() {
  const { section } = pageFor(useLocation().pathname);
  const now = new Date();
  const issue = `${now.toLocaleDateString('en-GB', { month: 'long' })} ’${String(now.getFullYear()).slice(-2)}`;

  return (
    <div className="grid grid-cols-1 items-baseline border-b border-rule py-3 font-sans text-label uppercase lining-nums sm:grid-cols-3">
      <span className="hidden sm:block">{issue}</span>
      <Link to="/" className="text-center">
        {SITE_NAME}
      </Link>
      <span className="hidden text-right sm:block">{section}</span>
    </div>
  );
}

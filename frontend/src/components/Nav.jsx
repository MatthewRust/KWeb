import { NavLink } from 'react-router';
import { PAGES } from '../site.js';
import Circled from './marks/Circled.jsx';

// Plain words spread across the grid (Samson Leung's nav); the current page gets a hand-drawn ring.
export default function Nav() {
  return (
    <nav aria-label="Main">
      <ul className="grid grid-cols-4 py-4 font-sans text-[1.0625rem] font-medium md:text-lg">
        {PAGES.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink to={to} end={end} className="inline-block text-ultramarine transition-colors hover:text-ultramarine-deep active:translate-y-px">
              {({ isActive }) => (isActive ? <Circled>{label}</Circled> : label)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

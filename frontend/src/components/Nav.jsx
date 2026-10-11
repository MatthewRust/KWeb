import { NavLink } from 'react-router';
import { ADMIN_PAGES, PAGES } from '../site.js';
import { useAuth } from '../auth.jsx';
import Circled from './marks/Circled.jsx';

// Plain words spread across the grid (Samson Leung's nav); the current page gets a hand-drawn ring.
// When logged in, the admin pages and a log-out button are added to the end.
export default function Nav() {
  const { user, logout } = useAuth();
  const pages = user ? [...PAGES, ...ADMIN_PAGES] : PAGES;

  return (
    <nav aria-label="Main">
      <ul
        className="grid py-4 font-sans text-[1.0625rem] font-medium md:text-lg"
        style={{ gridTemplateColumns: `repeat(${pages.length + (user ? 1 : 0)}, minmax(0, 1fr))` }}
      >
        {pages.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink to={to} end={end} className="inline-block text-ultramarine transition-colors hover:text-ultramarine-deep active:translate-y-px">
              {({ isActive }) => (isActive ? <Circled>{label}</Circled> : label)}
            </NavLink>
          </li>
        ))}
        {user && (
          <li>
            <button type="button" onClick={logout} className="cursor-pointer text-ultramarine transition-colors hover:text-ultramarine-deep active:translate-y-px">
              Log out
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

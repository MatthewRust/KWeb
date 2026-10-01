import { Link, NavLink } from 'react-router';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/essays', label: 'Essays' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
];

export default function Nav() {
  return (
    <header>
      <nav className="flex items-center justify-between p-4">
        <Link to="/">Kirsty</Link>
        <ul className="flex gap-4">
          {links.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={({ isActive }) => (isActive ? 'underline' : '')}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

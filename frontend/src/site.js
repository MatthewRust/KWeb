// Site-wide constants. The name is still undecided: change it here and it updates everywhere.
export const SITE_NAME = '[Site name]';

// Nav order. `section` labels the running head; `folio` is the page number printed in the footer.
export const PAGES = [
  { to: '/', label: 'Home', section: 'Front page', folio: '01', end: true },
  { to: '/essays', label: 'Essays', section: 'Essays', folio: '02' },
  { to: '/reviews', label: 'Reviews', section: 'Reviews', folio: '03' },
  { to: '/gallery', label: 'Gallery', section: 'Gallery', folio: '04' },
  { to: '/about', label: 'About', section: 'About', folio: '05' },
];

// Extra nav items shown only when logged in.
export const ADMIN_PAGES = [{ to: '/add', label: 'Add', section: 'Add', folio: '06' }];

// Not in any nav: reached by typing the URL.
const HIDDEN_PAGES = [{ to: '/login', section: 'Log in', folio: '00' }];

const NOT_FOUND = { section: 'Not found', folio: '404' };

// Sub-pages take their section's details, e.g. /essays/3 counts as Essays.
export function pageFor(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const pages = [...PAGES, ...ADMIN_PAGES, ...HIDDEN_PAGES];
  return pages.find(({ to }) => to === path) ?? pages.find(({ to }) => to !== '/' && path.startsWith(`${to}/`)) ?? NOT_FOUND;
}

// Essay subsections. Must match the CHECK on content.subsection (backend/src/db/migrations/005_essays_and_reviews.sql).
export const SUBSECTIONS = ['archaeology', 'fieldwork', 'art history'];

// 'YYYY-MM' → "Sep ’26", the short date shown on every essay and review.
export function formatPublished(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number);
  const name = new Date(year, month - 1).toLocaleDateString('en-GB', { month: 'short' });
  return `${name.slice(0, 3)} ’${String(year).slice(-2)}`;
}

// 3 → "003", the catalogue number shown as "Nº 003".
export function formatNumber(number) {
  return String(number).padStart(3, '0');
}

// Site-wide constants. The name is still undecided: change it here and it updates everywhere.
export const SITE_NAME = '[Site name]';

// Nav order. `section` labels the running head; `folio` is the page number printed in the footer.
export const PAGES = [
  { to: '/', label: 'Home', section: 'Front page', folio: '01', end: true },
  { to: '/essays', label: 'Essays', section: 'Essays', folio: '02' },
  { to: '/gallery', label: 'Gallery', section: 'Gallery', folio: '03' },
  { to: '/about', label: 'About', section: 'About', folio: '04' },
];

// Extra nav items shown only when logged in.
export const ADMIN_PAGES = [{ to: '/add', label: 'Add', section: 'Add', folio: '05' }];

// Not in any nav: reached by typing the URL.
const HIDDEN_PAGES = [{ to: '/login', section: 'Log in', folio: '00' }];

const NOT_FOUND = { section: 'Not found', folio: '404' };

export function pageFor(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  return [...PAGES, ...ADMIN_PAGES, ...HIDDEN_PAGES].find(({ to }) => to === path) ?? NOT_FOUND;
}

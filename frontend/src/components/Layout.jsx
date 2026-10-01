import { Outlet } from 'react-router';
import CrayonFilter from './marks/CrayonFilter.jsx';
import RunningHead from './RunningHead.jsx';
import Nav from './Nav.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <CrayonFilter />
      {/* Always in view, so the nav's hand ring draws as soon as a page changes. */}
      <header data-inview className="reveal page-width">
        <RunningHead />
        <Nav />
      </header>
      <main className="page-width">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

import { Outlet } from 'react-router';
import Nav from './Nav.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  return (
    <>
      <Nav />
      <main className="p-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

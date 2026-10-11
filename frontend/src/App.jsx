import { Navigate, Route, Routes } from 'react-router';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Essays from './pages/Essays.jsx';
import Gallery from './pages/Gallery.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Add from './pages/Add.jsx';
import NotFound from './pages/NotFound.jsx';
import RequireAuth from './components/RequireAuth.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="essays" element={<Essays />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route
          path="add"
          element={
            <RequireAuth>
              <Add />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

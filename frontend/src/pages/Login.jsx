import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../auth.jsx';

// Hidden page: not linked from the nav, reached by going to /login directly.
export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to="/add" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      await login(name, password);
      navigate('/add');
    } catch (err) {
      setError(err.message);
    }
  }

  const label = 'flex flex-col gap-1.5 font-sans text-label uppercase';
  const input = 'border border-ink bg-paper-bright px-3 py-2 font-serif text-body normal-case tracking-normal focus-visible:border-ultramarine';

  return (
    <section className="py-12">
      <h1 className="text-h2">Log in</h1>
      <form onSubmit={handleSubmit} className="mt-8 flex max-w-sm flex-col gap-5">
        <label className={label}>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="username" required className={input} />
        </label>
        <label className={label}>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required className={input} />
        </label>
        {error && (
          <p role="alert" className="font-sans text-meta text-terracotta">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="cursor-pointer self-start border border-ink px-5 py-2 font-sans text-label uppercase transition-colors hover:bg-ultramarine hover:text-paper-bright active:translate-y-px"
        >
          Log in
        </button>
      </form>
    </section>
  );
}

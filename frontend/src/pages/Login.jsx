import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../auth.jsx';
import { buttonClass, inputClass, labelClass } from '../formStyles.js';

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

  return (
    <section className="py-12">
      <h1 className="text-h2">Log in</h1>
      <form onSubmit={handleSubmit} className="mt-8 flex max-w-sm flex-col gap-5">
        <label className={labelClass}>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="username" required className={inputClass} />
        </label>
        <label className={labelClass}>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required className={inputClass} />
        </label>
        {error && (
          <p role="alert" className="font-sans text-meta text-terracotta">
            {error}
          </p>
        )}
        <button type="submit" className={buttonClass}>
          Log in
        </button>
      </form>
    </section>
  );
}

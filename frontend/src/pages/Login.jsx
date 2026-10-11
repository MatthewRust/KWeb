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

  return (
    <section>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <p>
          <label>
            Name <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="username" required />
          </label>
        </p>
        <p>
          <label>
            Password{' '}
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </label>
        </p>
        {error && <p role="alert">{error}</p>}
        <button type="submit">Log in</button>
      </form>
    </section>
  );
}

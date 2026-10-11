import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

// Who is logged in. `user` is undefined while checking, null when logged out, { name } when logged in.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetch('/api/me')
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  async function login(name, password) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setUser(data);
  }

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
  }

  return <AuthContext value={{ user, login, logout }}>{children}</AuthContext>;
}

export function useAuth() {
  return useContext(AuthContext);
}

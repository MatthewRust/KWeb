import { useEffect, useState } from 'react';

export default function Home() {
  const [apiStatus, setApiStatus] = useState('checking…');

  // Confirms the frontend → backend connection (via Vite proxy in dev, nginx in Docker).
  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => setApiStatus(data.status))
      .catch(() => setApiStatus('unreachable'));
  }, []);

  return (
    <section>
      <h1>Home</h1>
      <p>Landing page placeholder.</p>
      <p>API: {apiStatus}</p>
    </section>
  );
}

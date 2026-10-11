import { useEffect, useState } from 'react';

// Fetches JSON from the backend. `data` is undefined while loading; `error` is set if it fails (404 included).
// Pass a null url to wait (e.g. until another request has said what to fetch).
export function useApi(url) {
  const [state, setState] = useState({ data: undefined, error: null, status: null });

  useEffect(() => {
    let cancelled = false;
    setState({ data: undefined, error: null, status: null });
    if (!url) return;
    fetch(url)
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok) setState({ data: body, error: null, status: res.status });
        else setState({ data: undefined, error: body.error || 'Could not load', status: res.status });
      })
      .catch(() => !cancelled && setState({ data: undefined, error: 'Could not reach the server', status: null }));
    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}

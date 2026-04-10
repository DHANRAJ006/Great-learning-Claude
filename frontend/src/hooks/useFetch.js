// ── useFetch – generic data-fetching hook ──────────────────
import { useState, useEffect, useRef } from 'react';

/**
 * @param {string|null} url  - API URL to fetch. Pass null to skip.
 * @returns {{ data, loading, error, refetch }}
 */
export function useFetch(url) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(!!url);
  const [error,   setError]   = useState(null);
  const abortRef = useRef(null);

  const fetchData = async (fetchUrl) => {
    if (!fetchUrl) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(fetchUrl, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(url);
    return () => abortRef.current?.abort();
  }, [url]);

  return { data, loading, error, refetch: () => fetchData(url) };
}

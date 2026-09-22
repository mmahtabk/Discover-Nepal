import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Destination } from '../types';

export interface UseDestination {
  destination: Destination | null;
  loading: boolean;
  error: string | null;
}

export function useDestination(slug: string | undefined): UseDestination {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let alive = true;
    setLoading(true);
    setError(null);

    api<Destination>(`/destinations/${slug}`)
      .then((data) => {
        if (alive) setDestination(data);
      })
      .catch((err: Error) => {
        if (alive) setError(err.message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [slug]);

  return { destination, loading, error };
}
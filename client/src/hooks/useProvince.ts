import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Destination, Province } from '../types';

export interface UseProvince {
  province: Province | null;
  destinations: Destination[];
  loading: boolean;
  error: string | null;
}

export function useProvince(slug: string | undefined): UseProvince {
  const [province, setProvince] = useState<Province | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let alive = true;
    setLoading(true);
    setError(null);

    Promise.all([
      api<Province>(`/provinces/${slug}`),
      api<Destination[]>(`/provinces/${slug}/destinations`),
    ])
      .then(([prov, dests]) => {
        if (!alive) return;
        setProvince(prov);
        setDestinations(dests);
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

  return { province, destinations, loading, error };
}
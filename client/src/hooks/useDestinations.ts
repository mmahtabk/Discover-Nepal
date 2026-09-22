import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Destination } from '../types';

export interface DestinationFilters {
  tag?: string;
  province?: string;
  q?: string;
}

export interface UseDestinations {
  destinations: Destination[];
  loading: boolean;
  error: string | null;
}

export function useDestinations(filters: DestinationFilters = {}): UseDestinations {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const query = new URLSearchParams();
  if (filters.tag) query.set('tag', filters.tag);
  if (filters.province) query.set('province', filters.province);
  if (filters.q) query.set('q', filters.q);
  const qs = query.toString();
  const suffix = qs ? `?${qs}` : '';
  const key = suffix;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    api<Destination[]>(`/destinations${key}`)
      .then((data) => {
        if (alive) setDestinations(data);
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
  }, [key]);

  return { destinations, loading, error };
}
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Province } from '../types';

export interface UseProvinces {
  provinces: Province[];
  loading: boolean;
  error: string | null;
}

export function useProvinces(): UseProvinces {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    api<Province[]>('/provinces')
      .then((data) => {
        if (alive) setProvinces(data);
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
  }, []);

  return { provinces, loading, error };
}
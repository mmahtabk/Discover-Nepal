/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api } from '../lib/api';
import { useAuth } from '../auth/AuthContext';
import type { Destination } from '../types';

interface SavedContextValue {
  saved: Set<string>;
  loading: boolean;
  isSaved: (id: string) => boolean;
  toggleSave: (id: string) => Promise<boolean>;
}

const SavedContext = createContext<SavedContextValue | null>(null);

export function SavedProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!user) {
      setSaved(new Set());
      setLoading(false);
      return;
    }
    setLoading(true);
    api<Destination[]>('/users/me/saved')
      .then((items) => {
        if (alive) setSaved(new Set(items.map((d) => d._id)));
      })
      .catch(() => {
        if (alive) setSaved(new Set());
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [user?.id, user?.email, user]);

  const toggleSave = useCallback(async (id: string): Promise<boolean> => {
    let next = false;
    setSaved((prev) => {
      const copy = new Set(prev);
      next = !copy.has(id);
      if (next) copy.add(id);
      else copy.delete(id);
      return copy;
    });
    try {
      await api(`/users/me/saved/${id}`, { method: next ? 'POST' : 'DELETE' });
      return next;
    } catch (err) {
      setSaved((prev) => {
        const copy = new Set(prev);
        if (next) copy.delete(id);
        else copy.add(id);
        return copy;
      });
      throw err;
    }
  }, []);

  const isSaved = useCallback((id: string) => saved.has(id), [saved]);

  const value = useMemo(
    () => ({ saved, loading, isSaved, toggleSave }),
    [saved, loading, isSaved, toggleSave],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved(): SavedContextValue {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSaved must be used within a SavedProvider');
  return ctx;
}
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { AdminNav } from '../../admin/AdminNav';
import { Loader } from '../../components/ui/Loader';
import type { AdminStats } from '../../types';

type CardKey = keyof AdminStats;

const CARDS: { key: CardKey; label: string; to: string; tint: string }[] = [
  { key: 'destinations', label: 'Total destinations', to: '/admin/destinations', tint: 'bg-forest/10 text-forest' },
  { key: 'provinces', label: 'Total provinces', to: '/admin/provinces', tint: 'bg-gold/15 text-ink' },
  { key: 'users', label: 'Registered users', to: '/admin', tint: 'bg-sky-tint text-sky' },
  { key: 'inquiries', label: 'Total inquiries', to: '/admin/inquiries', tint: 'bg-rose/10 text-rose' },
  { key: 'inquiriesNew', label: 'New inquiries', to: '/admin/inquiries', tint: 'bg-mint text-forest' },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api<AdminStats>('/admin/stats')
      .then((data) => {
        if (alive) setStats(data);
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

  return (
    <div>
      <AdminNav />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">— Admin</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-ink">Content & inquiries</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Manage destinations and provinces, and work through the inbox of trip-planning inquiries.
        </p>

        {error && (
          <p className="mt-6 rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
            Couldn't load admin summary: {error}
          </p>
        )}

        {loading ? (
          <Loader label="Loading summary…" />
        ) : (
          stats && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CARDS.map((card) => (
                <Link
                  key={card.key}
                  to={card.to}
                  className="rounded-3xl border border-stone-2 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${card.tint}`}>
                    {card.label}
                  </div>
                  <p className="mt-4 font-serif text-4xl font-bold text-ink">{stats[card.key]}</p>
                </Link>
              ))}
            </div>
          )
        )}
      </section>
    </div>
  );
}
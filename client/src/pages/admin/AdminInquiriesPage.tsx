import { useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';
import { AdminNav } from '../../admin/AdminNav';
import { fieldCls } from '../../admin/fields';
import { Loader } from '../../components/ui/Loader';
import type { Inquiry, InquiryStatus } from '../../types';

const STATUS_OPTIONS: InquiryStatus[] = ['new', 'contacted', 'closed'];

function statusPill(status: InquiryStatus): string {
  switch (status) {
    case 'new':
      return 'bg-sky-tint text-sky';
    case 'contacted':
      return 'bg-gold/15 text-ink';
    case 'closed':
      return 'bg-stone-2 text-muted';
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<InquiryStatus | ''>('');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const query = filter ? `?status=${filter}` : '';
    api<Inquiry[]>(`/admin/inquiries${query}`)
      .then((data) => {
        if (alive) {
          setInquiries(data);
          setError(null);
        }
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
  }, [version, filter]);

  const updateStatus = async (inquiry: Inquiry, status: InquiryStatus) => {
    const optimistic = inquiries.map((i) => (i._id === inquiry._id ? { ...i, status } : i));
    setInquiries(optimistic);
    try {
      const updated = await api<Inquiry>(`/admin/inquiries/${inquiry._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setInquiries((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
    } catch (err) {
      window.alert((err as Error).message);
      setVersion((v) => v + 1);
    }
  };

  const counts = useMemo(() => {
    const total = inquiries.length;
    const open = inquiries.filter((i) => i.status === 'new').length;
    return { total, open };
  }, [inquiries]);

  return (
    <div>
      <AdminNav />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">— Admin</p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-ink">Inquiries</h1>
            <p className="mt-3 text-muted">
              {counts.total} shown · {counts.open} still new
            </p>
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value as InquiryStatus | '')} className={`${fieldCls} sm:w-44`}>
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="mt-6 rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
            Couldn't load inquiries: {error}
          </p>
        )}

        {loading ? (
          <Loader label="Loading inquiries…" />
        ) : inquiries.length === 0 ? (
          <p className="mt-12 text-center text-muted">No inquiries yet.</p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-2 bg-white">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-stone-2 text-xs uppercase tracking-widest text-muted">
                  <th className="px-4 py-3 font-semibold">Received</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Destination</th>
                  <th className="px-4 py-3 font-semibold">Message</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((i) => (
                  <tr key={i._id} className="border-b border-stone-2 align-top last:border-0 hover:bg-mint/40">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">
                      {formatDate(i.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-ink">{i.name}</td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${i.email}`} className="text-forest hover:underline">
                        {i.email}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {i.destinationInterest ? (
                        <a
                          href={`/destinations/${i.destinationInterest.slug}`}
                          className="text-forest hover:underline"
                        >
                          {i.destinationInterest.name}
                        </a>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-muted">
                      <p className="line-clamp-3" title={i.message}>
                        {i.message}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-start gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusPill(i.status)}`}>
                          {i.status}
                        </span>
                        <select
                          value={i.status}
                          onChange={(e) => void updateStatus(i, e.target.value as InquiryStatus)}
                          aria-label={`Status for inquiry from ${i.name}`}
                          className="rounded-lg border border-stone-2 bg-white px-2 py-1 text-xs text-ink outline-none focus:border-forest"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthContext';
import { api } from '../lib/api';
import { useDestinations } from '../hooks/useDestinations';
import { Loader } from '../components/ui/Loader';
import { SectionHeader } from '../components/ui/SectionHeader';
import type { Destination, Trip } from '../types';

function formatDate(iso?: string, locale = 'en-GB'): string {
  if (!iso) return 'tbd';
  return new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

function inputClass(base?: string) {
  const shared = 'w-full rounded-full border border-stone-2 bg-white px-5 py-2.5 text-sm text-ink outline-none focus:border-forest';
  return base ? `${base} ${shared}` : shared;
}

function AuthGate() {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setBusy(true);
    try {
      if (mode === 'login') await login(email, password);
      else await register(name, email, password);
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-stone-2 bg-white p-8 shadow-sm">
          <div className="flex gap-2 rounded-full border border-stone-2 bg-white p-1">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={
                  mode === m
                    ? 'flex-1 rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white'
                    : 'flex-1 rounded-full px-4 py-2 text-sm font-medium text-ink hover:bg-mint'
                }
              >
                {m === 'login' ? t('auth.signIn') : t('auth.createAccount')}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === 'register' && (
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted">
                  {t('auth.name')}
                </span>
                <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} placeholder={t('auth.namePlaceholder')} className={inputClass()} />
              </label>
            )}
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted">
                {t('auth.email')}
              </span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder={t('auth.emailPlaceholder')} className={inputClass()} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted">
                {t('auth.password')}
              </span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder={t('auth.passwordPlaceholder')} className={inputClass()} />
            </label>

            {formError && (
              <p className="rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">{formError}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink hover:brightness-95 disabled:opacity-60"
            >
              {busy ? t('auth.oneMoment') : mode === 'login' ? t('auth.signIn') : t('auth.createAccount')}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-muted">{t('auth.gateSubtitle')}</p>
      </div>
    </section>
  );
}

function NewTripForm({ onCreate }: { onCreate: (title: string, start?: string, end?: string) => Promise<void> }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setFormError(null);
    try {
      await onCreate(title.trim(), start || undefined, end || undefined);
      setTitle('');
      setStart('');
      setEnd('');
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-3xl border border-stone-2 bg-white p-6 shadow-sm">
      <p className="text-sm font-bold text-ink">{t('planTrip.newTrip')}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder={t('planTrip.tripTitlePlaceholder')} className={inputClass()} />
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)} aria-label={t('planTrip.startDate')} className={inputClass()} />
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} aria-label={t('planTrip.endDate')} className={inputClass()} />
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-ink hover:brightness-95 disabled:opacity-60"
        >
          {busy ? t('planTrip.creating') : t('planTrip.createTrip')}
        </button>
      </div>
      {formError && (
        <p className="mt-3 rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">{formError}</p>
      )}
    </form>
  );
}

function TripDetail({
  trip,
  saving,
  onAdd,
  onRemove,
}: {
  trip: Trip;
  saving: boolean;
  onAdd: (trip: Trip, dest: Destination) => void;
  onRemove: (trip: Trip, destId: string) => void;
}) {
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  const search = useDestinations(debounced.trim() ? { q: debounced.trim() } : {});
  const addedIds = new Set(trip.destinationIds.map((d) => d._id));
  const candidates = search.destinations.filter((d) => !addedIds.has(d._id)).slice(0, 6);

  return (
    <div className="border-t border-stone-2 px-5 py-5">
      {trip.destinationIds.length === 0 ? (
        <p className="mb-4 text-sm text-muted">{t('planTrip.noDestYet')}</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trip.destinationIds.map((d) => (
            <li key={d._id} className="flex items-center gap-3 rounded-xl border border-stone-2 bg-white p-2">
              <img src={d.imageUrl} alt={d.name} loading="lazy" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{d.name}</p>
                <p className="truncate text-xs text-muted">{d.slug}</p>
              </div>
              <button
                type="button"
                aria-label={t('planTrip.remove', { name: d.name })}
                disabled={saving}
                onClick={() => onRemove(trip, d._id)}
                className="shrink-0 text-sm text-muted hover:text-forest disabled:opacity-50"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('planTrip.searchAddPlaceholder')}
          className={inputClass()}
        />
        {search.loading ? (
          <p className="mt-3 text-sm text-muted">{t('planTrip.searching')}</p>
        ) : candidates.length > 0 ? (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {candidates.map((d) => (
              <li key={d._id} className="flex items-center gap-3 rounded-xl border border-stone-2 bg-white p-2">
                <img src={d.imageUrl} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{d.name}</p>
                </div>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => onAdd(trip, d)}
                  className="shrink-0 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink hover:brightness-95 disabled:opacity-50"
                >
                  {t('planTrip.add')}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          q.trim() !== '' && (
            <p className="mt-3 text-sm text-muted">{t('planTrip.nothingNew', { q })}</p>
          )
        )}
      </div>
    </div>
  );
}

function Planner() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const i18nDateLocale = i18n.language === 'ne' ? 'ne' : 'en-GB';
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    api<Trip[]>('/trips')
      .then((data) => {
        if (alive) setTrips(data);
      })
      .catch((err: Error) => {
        if (alive) setListError(err.message);
      });
    return () => {
      alive = false;
    };
  }, []);

  const createTrip = async (title: string, start?: string, end?: string) => {
    const trip = await api<Trip>('/trips', {
      method: 'POST',
      body: JSON.stringify({ title, startDate: start ?? null, endDate: end ?? null, destinationIds: [] }),
    });
    setTrips((prev) => [trip, ...prev]);
    setExpandedId(trip._id);
  };

  const deleteTrip = async (id: string) => {
    if (!window.confirm(t('planTrip.deleteConfirm'))) return;
    await api<{ id: string; deleted: boolean }>(`/trips/${id}`, { method: 'DELETE' });
    setTrips((prev) => prev.filter((t) => t._id !== id));
    setExpandedId((cur) => (cur === id ? null : cur));
  };

  const applyDestinationIds = async (trip: Trip, ids: string[]) => {
    setSaving(true);
    try {
      const body: Record<string, unknown> = { title: trip.title, destinationIds: ids };
      if (trip.startDate) body.startDate = trip.startDate;
      if (trip.endDate) body.endDate = trip.endDate;
      const updated = await api<Trip>(`/trips/${trip._id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      setTrips((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } finally {
      setSaving(false);
    }
  };

  const addDestination = (trip: Trip, dest: Destination) => {
    const ids = [...trip.destinationIds.map((d) => d._id), dest._id];
    void applyDestinationIds(trip, ids);
  };

  const removeDestination = (trip: Trip, destId: string) => {
    const ids = trip.destinationIds.filter((d) => d._id !== destId).map((d) => d._id);
    void applyDestinationIds(trip, ids);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader
          eyebrow={t('planTrip.yourTrips')}
          title={t('planTrip.namaste', { name: user?.name.split(' ')[0] })}
          subtitle={t('planTrip.subtitle2')}
        />
        <p className="text-sm text-muted">
          {trips.length === 1
            ? t('planTrip.savedTrip', { count: trips.length })
            : t('planTrip.savedTrips', { count: trips.length })}
        </p>
      </div>

      {listError && (
        <p className="mt-6 rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          {t('planTrip.loadTripsError', { error: listError })}
        </p>
      )}

      <div className="mt-8 space-y-4">
        <NewTripForm onCreate={createTrip} />

        {trips.length === 0 && !listError ? (
          <div className="rounded-2xl border border-dashed border-stone-2 bg-white p-10 text-center">
            <p className="font-serif text-xl font-bold text-ink">{t('planTrip.noTripsYet')}</p>
            <p className="mt-2 text-sm text-muted">{t('planTrip.createFirst')}</p>
          </div>
        ) : (
          trips.map((trip) => (
            <div key={trip._id} className="rounded-2xl border border-stone-2 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <h3 className="font-serif text-lg font-bold text-ink">{trip.title}</h3>
                  <p className="mt-0.5 text-sm text-muted">
                    {trip.startDate || trip.endDate
                      ? `${formatDate(trip.startDate, i18nDateLocale)} → ${formatDate(trip.endDate, i18nDateLocale)}`
                      : t('planTrip.noDatesYet')}{' '}
                    · {trip.destinationIds.length}{' '}
                    {trip.destinationIds.length === 1
                      ? t('planTrip.stop')
                      : t('planTrip.stops')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expandedId === trip._id ? null : trip._id)}
                    className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink hover:brightness-95"
                  >
                    {expandedId === trip._id ? t('planTrip.collapse') : t('planTrip.planDetails')}
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteTrip(trip._id)}
                    className="rounded-full border border-stone-2 px-4 py-2 text-sm text-muted hover:border-forest hover:text-forest"
                  >
                    {t('planTrip.delete')}
                  </button>
                </div>
              </div>
              {expandedId === trip._id && (
                <TripDetail
                  trip={trip}
                  saving={saving}
                  onAdd={addDestination}
                  onRemove={removeDestination}
                />
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default function TripPlannerPage() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  return (
    <div>
      <header className="relative overflow-hidden bg-forest text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            {t('planTrip.eyebrow')}
          </p>
          <h1 className="mt-2 max-w-xl font-serif text-4xl font-bold sm:text-5xl">
            {t('planTrip.title')}
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-white/80">{t('planTrip.subtitle')}</p>
        </div>
      </header>
      {loading ? (
        <Loader label={t('planTrip.sessionLoading')} />
      ) : user ? (
        <Planner />
      ) : (
        <AuthGate />
      )}
    </div>
  );
}
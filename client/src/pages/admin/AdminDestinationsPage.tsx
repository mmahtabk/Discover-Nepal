import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { AdminNav } from '../../admin/AdminNav';
import { Modal } from '../../admin/Modal';
import { labelCls, fieldCls, btnGold, btnGhost, btnDanger } from '../../admin/fields';
import { Loader } from '../../components/ui/Loader';
import type { Category, Destination, Difficulty, Province } from '../../types';

const CATEGORY_OPTIONS: Category[] = ['trek', 'nature', 'culture', 'hidden-gem'];
const DIFFICULTY_OPTIONS: Difficulty[] = ['easy', 'moderate', 'hard'];

interface DestForm {
  name: string;
  provinceId: string;
  category: Category;
  difficulty: Difficulty | '';
  bestSeason: string;
  costEstimate: string;
  overview: string;
  imageUrl: string;
}

function emptyForm(provinces: Province[]): DestForm {
  return {
    name: '',
    provinceId: provinces[0]?._id ?? '',
    category: 'trek',
    difficulty: '',
    bestSeason: '',
    costEstimate: '',
    overview: '',
    imageUrl: '',
  };
}

function formFromDestination(d: Destination, provinces: Province[]): DestForm {
  const provinceId = typeof d.provinceId === 'string' ? d.provinceId : d.provinceId._id;
  return {
    name: d.name,
    provinceId: provinces.some((p) => p._id === provinceId) ? provinceId : provinces[0]?._id ?? '',
    category: d.category,
    difficulty: d.difficulty ?? '',
    bestSeason: d.bestSeason,
    costEstimate: d.costEstimate ?? '',
    overview: d.description,
    imageUrl: d.imageUrl,
  };
}

function provinceLabel(d: Destination): string {
  const p = d.provinceId;
  if (typeof p === 'string') return `— ${d.provinceSlug}`;
  return `#${p.number} ${p.name}`;
}

function DestFormModal({
  mode,
  title,
  initial,
  provinces,
  saving,
  error,
  onSave,
  onClose,
}: {
  mode: 'create' | 'edit';
  title: string;
  initial: DestForm;
  provinces: Province[];
  saving: boolean;
  error: string | null;
  onSave: (form: DestForm) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<DestForm>(initial);

  const set = <K extends keyof DestForm>(key: K, value: DestForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className={labelCls}>Name *</span>
          <input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
            className={fieldCls}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelCls}>Province *</span>
            <select
              value={form.provinceId}
              onChange={(e) => set('provinceId', e.target.value)}
              required
              className={fieldCls}
            >
              {provinces.map((p) => (
                <option key={p._id} value={p._id}>
                  #{p.number} {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelCls}>Category *</span>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value as Category)}
              className={fieldCls}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelCls}>Difficulty</span>
            <select
              value={form.difficulty}
              onChange={(e) => set('difficulty', e.target.value as Difficulty | '')}
              className={fieldCls}
            >
              <option value="">—</option>
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelCls}>Best season *</span>
            <input
              value={form.bestSeason}
              onChange={(e) => set('bestSeason', e.target.value)}
              required
              placeholder="e.g. Oct–Nov"
              className={fieldCls}
            />
          </label>
        </div>

        <label className="block">
          <span className={labelCls}>Cost estimate</span>
          <input
            value={form.costEstimate}
            onChange={(e) => set('costEstimate', e.target.value)}
            placeholder="e.g. NPR 8,000–12,000"
            className={fieldCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Overview *</span>
          <textarea
            value={form.overview}
            onChange={(e) => set('overview', e.target.value)}
            required
            rows={4}
            className={fieldCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Image URL *</span>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => set('imageUrl', e.target.value)}
            required
            placeholder="https://…"
            className={fieldCls}
          />
        </label>

        {error && (
          <p className="rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
            {error}
          </p>
        )}

        <p className="text-xs text-muted">
          {mode === 'create'
            ? 'New destinations default to Kathmandu map coordinates and get an auto-generated slug.'
            : 'Renaming generates a new slug. Changing the province updates the province link automatically.'}
        </p>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className={btnGhost}>
            Cancel
          </button>
          <button type="submit" disabled={saving} className={btnGold}>
            {saving ? 'Saving…' : mode === 'create' ? 'Create destination' : 'Save changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const [q, setQ] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [category, setCategory] = useState<Category | ''>('');

  const [modal, setModal] = useState<null | { mode: 'create' | 'edit'; dest?: Destination }>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([api<Destination[]>('/destinations'), api<Province[]>('/provinces')])
      .then(([dests, provs]) => {
        if (!alive) return;
        setDestinations(dests);
        setProvinces(provs);
        setLoadError(null);
      })
      .catch((err: Error) => {
        if (alive) setLoadError(err.message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [version]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return destinations.filter((d) => {
      if (provinceId) {
        const p = d.provinceId;
        const pid = typeof p === 'string' ? p : p._id;
        if (pid !== provinceId) return false;
      }
      if (category && d.category !== category) return false;
      if (needle) {
        const hay = `${d.name} ${d.district} ${d.bestSeason} ${d.provinceSlug}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [destinations, provinceId, category, q]);

  const openCreate = () => {
    setFormError(null);
    setModal({ mode: 'create' });
  };

  const openEdit = (d: Destination) => {
    setFormError(null);
    setModal({ mode: 'edit', dest: d });
  };

  const refresh = () => setVersion((v) => v + 1);

  const save = async (form: DestForm) => {
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        name: form.name,
        provinceId: form.provinceId,
        category: form.category,
        difficulty: form.difficulty || undefined,
        bestSeason: form.bestSeason,
        costEstimate: form.costEstimate || undefined,
        overview: form.overview,
        imageUrl: form.imageUrl,
      };
      if (modal?.mode === 'edit' && modal.dest) {
        await api(`/admin/destinations/${modal.dest._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await api('/admin/destinations', { method: 'POST', body: JSON.stringify(payload) });
      }
      setModal(null);
      refresh();
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (d: Destination) => {
    if (!window.confirm(`Delete "${d.name}"? This also removes it from saved lists and trips.`)) return;
    try {
      await api(`/admin/destinations/${d._id}`, { method: 'DELETE' });
      refresh();
    } catch (err) {
      window.alert((err as Error).message);
    }
  };

  return (
    <div>
      <AdminNav />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">— Admin</p>
            <h1 className="mt-2 font-serif text-4xl font-bold text-ink">Destinations</h1>
            <p className="mt-3 text-muted">
              {destinations.length} destinations · {filtered.length} shown
            </p>
          </div>
          <button type="button" onClick={openCreate} className={btnGold}>
            + Add destination
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, district, season…"
            className={`${fieldCls} sm:max-w-xs`}
          />
          <select value={provinceId} onChange={(e) => setProvinceId(e.target.value)} className={`${fieldCls} sm:w-52`}>
            <option value="">All provinces</option>
            {provinces.map((p) => (
              <option key={p._id} value={p._id}>
                #{p.number} {p.name}
              </option>
            ))}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value as Category | '')} className={`${fieldCls} sm:w-44`}>
            <option value="">All categories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {loadError && (
          <p className="mt-6 rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
            Couldn't load destinations: {loadError}
          </p>
        )}

        {loading ? (
          <Loader label="Loading destinations…" />
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-2 bg-white">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-stone-2 text-xs uppercase tracking-widest text-muted">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Province</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Best season</th>
                  <th className="px-4 py-3 font-semibold">Difficulty</th>
                  <th className="px-4 py-3 font-semibold">Cost</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-muted">
                      No destinations match the current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((d) => (
                    <tr key={d._id} className="border-b border-stone-2 last:border-0 hover:bg-mint/40">
                      <td className="px-4 py-3">
                        <Link to={`/destinations/${d.slug}`} className="font-semibold text-forest hover:underline">
                          {d.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted">{provinceLabel(d)}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-stone-2 px-2.5 py-1 text-xs font-medium text-ink">
                          {d.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted">{d.bestSeason}</td>
                      <td className="px-4 py-3">{d.difficulty ?? <span className="text-muted">—</span>}</td>
                      <td className="px-4 py-3 text-muted">{d.costEstimate ?? '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => openEdit(d)} className={btnGhost}>
                            Edit
                          </button>
                          <button type="button" onClick={() => void remove(d)} className={btnDanger}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modal && (
        <DestFormModal
          mode={modal.mode}
          title={modal.mode === 'create' ? 'Add destination' : `Edit "${modal.dest?.name}"`}
          initial={modal.dest ? formFromDestination(modal.dest, provinces) : emptyForm(provinces)}
          provinces={provinces}
          saving={saving}
          error={formError}
          onSave={(form) => void save(form)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
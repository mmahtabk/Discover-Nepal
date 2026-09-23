import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { AdminNav } from '../../admin/AdminNav';
import { Modal } from '../../admin/Modal';
import { labelCls, fieldCls, btnGold, btnGhost, btnDanger } from '../../admin/fields';
import { Loader } from '../../components/ui/Loader';
import type { Province } from '../../types';

interface ProvForm {
  name: string;
  description: string;
  imageUrl: string;
  number: number;
}

function formFromProvince(p: Province): ProvForm {
  return { name: p.name, description: p.description, imageUrl: p.imageUrl, number: p.number };
}

function ProvinceFormModal({
  province,
  provinces,
  saving,
  error,
  onSave,
  onClose,
}: {
  province: Province;
  provinces: Province[];
  saving: boolean;
  error: string | null;
  onSave: (form: ProvForm) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ProvForm>(formFromProvince(province));

  const conflict = useMemo(() => {
    return provinces.some((p) => p._id !== province._id && p.number === form.number);
  }, [provinces, province._id, form.number]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal title={`Edit "${province.name}"`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
          <label className="block">
            <span className={labelCls}>Name *</span>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
              className={fieldCls}
            />
          </label>
          <label className="block">
            <span className={labelCls}>Official number *</span>
            <input
              type="number"
              min={1}
              max={7}
              value={form.number}
              onChange={(e) => setForm((prev) => ({ ...prev, number: Number(e.target.value) }))}
              required
              className={fieldCls}
            />
          </label>
        </div>

        {conflict && (
          <p className="rounded-xl border border-gold/50 bg-cream px-4 py-3 text-sm text-ink">
            Warning: another province is already numbered #{form.number}. Nepal's official 1–7
            numbering allows only one province per number — change it before saving.
          </p>
        )}

        <label className="block">
          <span className={labelCls}>Description *</span>
          <textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            required
            rows={4}
            className={fieldCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Hero image URL *</span>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
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
          Editing the name also updates the province slug. The official number must stay within the
          1–7 mapping.
        </p>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className={btnGhost}>
            Cancel
          </button>
          <button type="submit" disabled={saving || conflict} className={btnGold}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminProvincesPage() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const [editing, setEditing] = useState<Province | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api<Province[]>('/provinces')
      .then((data) => {
        if (alive) {
          setProvinces(data);
          setLoadError(null);
        }
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

  const save = async (form: ProvForm) => {
    if (!editing) return;
    setSaving(true);
    setFormError(null);
    try {
      await api(`/admin/provinces/${editing._id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      setEditing(null);
      setVersion((v) => v + 1);
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: Province) => {
    if (!window.confirm(`Delete "${p.name}"? Destinations still linked to it must be deleted first.`)) return;
    try {
      await api(`/admin/provinces/${p._id}`, { method: 'DELETE' });
      setVersion((v) => v + 1);
    } catch (err) {
      window.alert((err as Error).message);
    }
  };

  return (
    <div>
      <AdminNav />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">— Admin</p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-ink">Provinces</h1>
          <p className="mt-3 text-muted">
            Official 1–7 numbering is fixed — a province can't share a number.
          </p>
        </div>

        {loadError && (
          <p className="mt-6 rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
            Couldn't load provinces: {loadError}
          </p>
        )}

        {loading ? (
          <Loader label="Loading provinces…" />
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-2 bg-white">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-stone-2 text-xs uppercase tracking-widest text-muted">
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Capital</th>
                  <th className="px-4 py-3 font-semibold">Districts</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {provinces.map((p) => (
                  <tr key={p._id} className="border-b border-stone-2 last:border-0 hover:bg-mint/40">
                    <td className="px-4 py-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-forest font-serif text-sm font-bold text-white">
                        {p.number}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/provinces/${p.slug}`} className="font-semibold text-forest hover:underline">
                        {p.name}
                      </Link>
                      <span className="block text-xs text-muted">{p.nameNepali}</span>
                    </td>
                    <td className="px-4 py-3 text-muted">{p.capital}</td>
                    <td className="px-4 py-3">{p.districts}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-muted" title={p.description}>
                      {p.description}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setFormError(null);
                            setEditing(p);
                          }}
                          className={btnGhost}
                        >
                          Edit
                        </button>
                        <button type="button" onClick={() => void remove(p)} className={btnDanger}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editing && (
        <ProvinceFormModal
          province={editing}
          provinces={provinces}
          saving={saving}
          error={formError}
          onSave={(form) => void save(form)}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
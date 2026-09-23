import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDestinations } from '../hooks/useDestinations';
import { api } from '../lib/api';
import { Loader } from '../components/ui/Loader';
import { labelCls, fieldCls, btnGold } from '../admin/fields';
import type { Inquiry } from '../types';

export default function ContactPage() {
  const { t } = useTranslation();
  const { destinations, loading } = useDestinations();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [destinationInterest, setDestinationInterest] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState<Inquiry | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setBusy(true);
    try {
      const inquiry = await api<Inquiry>('/inquiries', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          message,
          destinationInterest: destinationInterest || null,
        }),
      });
      setDone(inquiry);
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setDone(null);
    setName('');
    setEmail('');
    setDestinationInterest('');
    setMessage('');
  };

  return (
    <div>
      <header className="relative overflow-hidden bg-forest text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            {t('contact.eyebrow')}
          </p>
          <h1 className="mt-2 max-w-xl font-serif text-4xl font-bold sm:text-5xl">
            {t('contact.title')}
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-white/80">{t('contact.subtitle')}</p>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {done ? (
          <div className="rounded-3xl border border-forest/30 bg-mint p-8 text-center">
            <p className="font-serif text-2xl font-bold text-forest">{t('contact.success')}</p>
            <p className="mt-2 text-sm text-muted">{t('contact.successMsg')}</p>
            <button type="button" onClick={reset} className="mt-6 rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-white hover:bg-mid">
              {t('contact.sendAnother')}
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-stone-2 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-bold text-ink">{t('contact.formTitle')}</p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelCls}>{t('auth.name')} *</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                    placeholder={t('auth.namePlaceholder')}
                    className={fieldCls}
                  />
                </label>
                <label className="block">
                  <span className={labelCls}>{t('auth.email')} *</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t('auth.emailPlaceholder')}
                    className={fieldCls}
                  />
                </label>
              </div>

              <label className="block">
                <span className={labelCls}>{t('contact.destination')}</span>
                <select value={destinationInterest} onChange={(e) => setDestinationInterest(e.target.value)} className={fieldCls}>
                  <option value="">{t('contact.destinationAny')}</option>
                  {loading ? (
                    <option value="" disabled>
                      Loading…
                    </option>
                  ) : (
                    destinations.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))
                  )}
                </select>
              </label>

              <label className="block">
                <span className={labelCls}>{t('contact.message')} *</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  minLength={5}
                  rows={5}
                  placeholder={t('contact.messagePlaceholder')}
                  className={fieldCls}
                />
              </label>

              {formError && (
                <p className="rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
                  {formError}
                </p>
              )}

              <button type="submit" disabled={busy || loading} className={`${btnGold} w-full`}>
                {busy ? t('contact.submitting') : t('contact.submit')}
              </button>
            </form>
          </div>
        )}

        {loading && !done && (
          <div className="mt-4 text-center">
            <Loader label={t('contact.loadingDestinations')} />
          </div>
        )}
      </section>
    </div>
  );
}
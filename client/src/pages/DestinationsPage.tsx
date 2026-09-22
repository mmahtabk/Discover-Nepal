import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDestinations } from '../hooks/useDestinations';
import { DestinationCard } from '../components/ui/DestinationCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Loader } from '../components/ui/Loader';
import type { Category } from '../types';

const TAG_VALUES: (Category | '')[] = ['', 'trek', 'nature', 'culture', 'hidden-gem'];

function labelKey(value: Category | ''): string {
  if (value === '') return 'categories.all';
  if (value === 'hidden-gem') return 'categories.hiddenGems';
  return `categories.${value}`;
}

export default function DestinationsPage() {
  const { t } = useTranslation();
  const [tag, setTag] = useState<Category | ''>('');
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(q), 300);
    return () => clearTimeout(timer);
  }, [q]);

  const { destinations, loading, error } = useDestinations({
    tag: tag || undefined,
    q: debounced.trim() || undefined,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeader
        eyebrow={t('destinations.eyebrow')}
        title={t('destinations.title')}
        subtitle={t('destinations.subtitle')}
      />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {TAG_VALUES.map((value) => (
            <button
              key={value || 'all'}
              type="button"
              onClick={() => setTag(value)}
              className={
                tag === value
                  ? 'rounded-full bg-evergreen px-4 py-2 text-sm font-semibold text-white'
                  : 'rounded-full border border-mint bg-white px-4 py-2 text-sm font-medium text-ink hover:border-mist'
              }
            >
              {t(labelKey(value))}
            </button>
          ))}
        </div>
        <label className="relative block w-full sm:max-w-xs">
          <span className="sr-only">{t('destinations.searchLabel')}</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('destinations.searchPlaceholder')}
            className="w-full rounded-full border border-mint bg-white px-5 py-2.5 text-sm text-ink outline-none focus:border-evergreen"
          />
        </label>
      </div>

      {error && (
        <p className="mt-6 rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          {t('common.loadDestinationsError', { error })}
        </p>
      )}

      {!error && !loading && destinations.length === 0 && (
        <p className="mt-12 text-center text-mist">{t('destinations.empty')}</p>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <Loader label={t('common.loadingDestinations')} />
        ) : (
          destinations.map((destination) => (
            <DestinationCard key={destination._id} destination={destination} />
          ))
        )}
      </div>
    </div>
  );
}
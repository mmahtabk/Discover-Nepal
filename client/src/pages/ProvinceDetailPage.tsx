import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProvince } from '../hooks/useProvince';
import { DestinationCard } from '../components/ui/DestinationCard';
import { Loader } from '../components/ui/Loader';
import { SectionHeader } from '../components/ui/SectionHeader';
import type { Category } from '../types';

const CATEGORY_VALUES: (Category | '')[] = ['', 'trek', 'nature', 'culture', 'hidden-gem'];

function labelKey(value: Category | ''): string {
  if (value === '') return 'categories.all';
  if (value === 'hidden-gem') return 'categories.hiddenGems';
  return `categories.${value}`;
}

export default function ProvinceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { province, destinations, loading, error } = useProvince(slug);
  const [filter, setFilter] = useState<Category | ''>('');

  if (loading) {
    return <Loader label={t('common.loadingProvinces')} />;
  }

  if (error || !province) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">— 404</p>
        <h1 className="mt-2 font-serif text-4xl font-bold">{t('provinceDetail.notFound')}</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          {error ?? t('provinceDetail.notFoundMsg', { slug })}
        </p>
        <Link
          to="/provinces"
          className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink hover:brightness-95"
        >
          {t('provinceDetail.allProvinces')}
        </Link>
      </div>
    );
  }

  const visible =
    filter === '' ? destinations : destinations.filter((d) => d.category === filter);
  const countFor = (category: Category) => destinations.filter((d) => d.category === category).length;

  return (
    <div>
      <section className="relative flex min-h-[52vh] items-end overflow-hidden bg-forest text-white">
        <img
          src={province.imageUrl}
          alt={province.name}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-12 pt-24 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            {t('provinceDetail.eyebrow', { number: province.number, nepali: province.nameNepali })}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold sm:text-6xl">{province.name}</h1>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-white/85">{province.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-stone-2 bg-white p-5 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
              {t('provinceDetail.capital')}
            </dt>
            <dd className="mt-1 font-serif text-xl font-bold text-ink">{province.capital}</dd>
          </div>
          <div className="rounded-2xl border border-stone-2 bg-white p-5 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
              {t('provinceDetail.area')}
            </dt>
            <dd className="mt-1 font-serif text-xl font-bold text-ink">
              {province.areaKm2.toLocaleString()} km²
            </dd>
          </div>
          <div className="rounded-2xl border border-stone-2 bg-white p-5 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
              {t('provinceDetail.population')}
            </dt>
            <dd className="mt-1 font-serif text-xl font-bold text-ink">
              {province.population.toLocaleString()}
            </dd>
          </div>
          <div className="rounded-2xl border border-stone-2 bg-white p-5 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
              {t('provinceDetail.districts')}
            </dt>
            <dd className="mt-1 font-serif text-xl font-bold text-ink">{province.districts}</dd>
          </div>
        </dl>

        <div className="py-16">
          <div className="flex flex-wrap gap-2">
            {province.highlights.map((highlight) => (
              <span
                key={highlight}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-cream px-3.5 py-1.5 text-sm font-medium text-ink"
              >
                <span aria-hidden className="text-gold">✦</span>
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mint">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              eyebrow={t('provinceDetail.destCount', { count: destinations.length })}
              title={t('provinceDetail.whereTitle')}
              subtitle={t('provinceDetail.whereSubtitle')}
            />
            <div className="flex flex-wrap gap-2">
              {CATEGORY_VALUES.map((value) => (
                <button
                  key={value || 'all'}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={
                    filter === value
                      ? 'rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white'
                      : 'rounded-full border border-stone-2 bg-white px-4 py-2 text-sm font-medium text-ink hover:border-muted'
                  }
                >
                  {t(labelKey(value))}
                  {value && ` (${countFor(value)})`}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="mt-12 text-center text-muted">{t('provinceDetail.empty')}</p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((destination) => (
                <DestinationCard key={destination._id} destination={destination} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
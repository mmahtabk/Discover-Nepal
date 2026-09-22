import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDestination } from '../hooks/useDestination';
import { useDestinations } from '../hooks/useDestinations';
import { useAuth } from '../auth/AuthContext';
import { useSaved } from '../saved/SavedContext';
import { DestinationCard } from '../components/ui/DestinationCard';
import { Loader } from '../components/ui/Loader';
import { TagPill } from '../components/ui/TagPill';
import { SectionHeader } from '../components/ui/SectionHeader';
import type { Destination } from '../types';

function provinceRef(destination: Destination): { slug: string; name: string } {
  const id = destination.provinceId;
  if (id && typeof id === 'object') {
    const p = id as { slug?: string; name?: string };
    return { slug: p.slug ?? destination.provinceSlug, name: p.name ?? 'Nepal' };
  }
  return { slug: destination.provinceSlug, name: 'Nepal' };
}

export default function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSaved();
  const [saveBusy, setSaveBusy] = useState(false);
  const { destination, loading, error } = useDestination(slug);

  const moreInProvince = useDestinations(
    destination ? { province: destination.provinceSlug } : {},
  );
  const more =
    destination && moreInProvince.destinations
      ? moreInProvince.destinations.filter((d) => d.slug !== destination.slug).slice(0, 3)
      : [];

  if (loading) {
    return <Loader label={t('common.loadingDestinations')} />;
  }

  if (error || !destination) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-evergreen">— 404</p>
        <h1 className="mt-2 font-serif text-4xl font-bold">
          {t('destinationDetail.notFound')}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-mist">
          {error ?? t('destinationDetail.notFoundMsg', { slug })}
        </p>
        <Link
          to="/destinations"
          className="mt-6 inline-block rounded-full bg-evergreen px-6 py-3 text-sm font-semibold text-white hover:bg-pine"
        >
          {t('destinationDetail.allDestinations')}
        </Link>
      </div>
    );
  }

  const province = provinceRef(destination);
  const saved = isSaved(destination._id);

  const onSave = async () => {
    if (saveBusy) return;
    setSaveBusy(true);
    try {
      await toggleSave(destination._id);
    } catch {
      // optimistic update already rolled back by the provider
    } finally {
      setSaveBusy(false);
    }
  };

  return (
    <div>
      <section className="relative flex min-h-[58vh] items-end overflow-hidden bg-pine text-white">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-12 pt-24 sm:px-6">
          <div className="flex items-center gap-3">
            <TagPill category={destination.category} />
            <span className="text-xs font-medium uppercase tracking-widest text-white/80">
              {province.name} · {destination.district}
            </span>
          </div>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold sm:text-6xl">
            {destination.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">
            {destination.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-mint bg-white p-5 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-widest text-mist">
              {t('destinationDetail.bestSeason')}
            </dt>
            <dd className="mt-1 font-serif text-base font-bold text-ink">{destination.bestSeason}</dd>
          </div>
          <div className="rounded-2xl border border-mint bg-white p-5 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-widest text-mist">
              {t('destinationDetail.elevation')}
            </dt>
            <dd className="mt-1 font-serif text-base font-bold text-ink">
              {destination.elevationM ? `${destination.elevationM.toLocaleString()} m` : '—'}
            </dd>
          </div>
          <div className="rounded-2xl border border-mint bg-white p-5 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-widest text-mist">
              {t('destinationDetail.district')}
            </dt>
            <dd className="mt-1 font-serif text-base font-bold text-ink">{destination.district}</dd>
          </div>
          <div className="rounded-2xl border border-mint bg-white p-5 shadow-sm">
            <dt className="text-xs font-semibold uppercase tracking-widest text-mist">
              {t('destinationDetail.category')}
            </dt>
            <dd className="mt-1 font-serif text-base font-bold text-ink">
              <TagPill category={destination.category} />
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to={`/map?d=${destination.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-evergreen px-5 py-2.5 text-sm font-semibold text-white hover:bg-pine"
          >
            {t('destinationDetail.viewOnMap')}
          </Link>
          {user && (
            <button
              type="button"
              onClick={onSave}
              disabled={saveBusy}
              aria-pressed={saved}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                saved
                  ? 'border-evergreen bg-evergreen text-white'
                  : 'border-evergreen/40 text-evergreen hover:bg-evergreen hover:text-white'
              }`}
            >
              <span aria-hidden="true">{saved ? '♥' : '♡'}</span>
              {saved ? t('save.saved') : t('save.saveForLater')}
            </button>
          )}
          {!user && (
            <Link
              to="/plan-trip"
              className="inline-flex items-center gap-2 rounded-full border border-evergreen/40 px-5 py-2.5 text-sm font-semibold text-evergreen hover:bg-evergreen hover:text-white"
            >
              <span aria-hidden="true">♡</span>
              {t('save.logInToSave')}
            </Link>
          )}
        </div>

        <div className="grid gap-12 py-16 lg:grid-cols-[1fr_16rem]">
          <article>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-evergreen">
              {t('destinationDetail.about')}
            </p>
            <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink/85">
              {destination.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={`/provinces/${province.slug}`}
                className="rounded-full bg-evergreen px-6 py-3 text-sm font-semibold text-white hover:bg-pine"
              >
                {t('destinationDetail.exploreProvince', { name: province.name })}
              </Link>
              <Link
                to="/plan-trip"
                className="rounded-full border border-mint bg-white px-6 py-3 text-sm font-semibold text-ink hover:border-mist"
              >
                {t('destinationDetail.addToTrip')}
              </Link>
            </div>
          </article>

          <aside className="rounded-2xl border border-mint bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-mist">
              {t('destinationDetail.quickFacts')}
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <span className="text-mist">{t('destinationDetail.provinceLabel')}</span>
                <Link to={`/provinces/${province.slug}`} className="block font-semibold text-ink hover:text-evergreen">
                  {province.name}
                </Link>
              </li>
              <li>
                <span className="text-mist">{t('destinationDetail.districtLabel')}</span>
                <p className="font-semibold text-ink">{destination.district}</p>
              </li>
              <li>
                <span className="text-mist">{t('destinationDetail.categoryLabel')}</span>
                <TagPill category={destination.category} />
              </li>
              <li>
                <span className="text-mist">{t('destinationDetail.bestSeason')}</span>
                <p className="font-semibold text-ink">{destination.bestSeason}</p>
              </li>
              <li>
                <span className="text-mist">{t('destinationDetail.elevation')}</span>
                <p className="font-semibold text-ink">
                  {destination.elevationM ? `${destination.elevationM.toLocaleString()} m` : '—'}
                </p>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      {more.length > 0 && (
        <section className="bg-mint">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <SectionHeader
              eyebrow={t('destinationDetail.moreEyebrow')}
              title={t('destinationDetail.moreTitle', { name: province.name })}
              subtitle={t('destinationDetail.moreSubtitle')}
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((destination) => (
                <DestinationCard key={destination._id} destination={destination} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
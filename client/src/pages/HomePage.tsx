import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { site } from '../data/site';
import { useProvinces } from '../hooks/useProvinces';
import { useDestinations } from '../hooks/useDestinations';
import { ProvinceCard } from '../components/ui/ProvinceCard';
import { DestinationCard } from '../components/ui/DestinationCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Loader } from '../components/ui/Loader';

function italicAccent(text: string) {
  return text.split(/(Nepal|नेपाल)/).map((part, i) =>
    part === 'Nepal' || part === 'नेपाल' ? (
      <em key={i} className="italic">
        {part}
      </em>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const { provinces, loading: loadingProvinces, error: provincesError } = useProvinces();
  const { destinations, loading: loadingDestinations, error: destinationsError } =
    useDestinations();

  const featured = destinations.slice(0, 6);

  return (
    <div>
      <section className="relative flex min-h-[78vh] items-center overflow-hidden bg-forest text-white">
        <img
          src={site.heroImageUrl}
          alt={t('hero.alt')}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            {t('hero.eyebrow')}
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-tight">
            {italicAccent(t('hero.title'))}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">{t('tagline')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/provinces"
              className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink hover:brightness-95"
            >
              {t('hero.ctaProvinces')}
            </Link>
            <Link
              to="/destinations"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {t('hero.ctaDestinations')}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeader
          eyebrow={t('home.provincesEyebrow')}
          title={t('home.provincesTitle')}
          subtitle={t('home.provincesSubtitle')}
        />
        {provincesError && (
          <p className="mt-6 rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
            {t('common.loadProvincesError', { error: provincesError })}
          </p>
        )}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loadingProvinces ? (
            <Loader label={t('common.loadingProvinces')} />
          ) : (
            provinces.map((province) => (
              <ProvinceCard key={province._id} province={province} />
            ))
          )}
        </div>
      </section>

      <section className="bg-mint">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeader
            eyebrow={t('home.featuredEyebrow')}
            title={t('home.featuredTitle')}
            subtitle={t('home.featuredSubtitle')}
          />
          {destinationsError && (
            <p className="mt-6 rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
              {t('common.loadDestinationsError', { error: destinationsError })}
            </p>
          )}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loadingDestinations ? (
              <Loader label={t('common.loadingDestinations')} />
            ) : (
              featured.map((destination) => (
                <DestinationCard key={destination._id} destination={destination} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
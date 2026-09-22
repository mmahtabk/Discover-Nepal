import { useProvinces } from '../hooks/useProvinces';
import { ProvinceCard } from '../components/ui/ProvinceCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Loader } from '../components/ui/Loader';
import { useTranslation } from 'react-i18next';

export default function ProvincesPage() {
  const { t } = useTranslation();
  const { provinces, loading, error } = useProvinces();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeader
        eyebrow={t('provincesPage.eyebrow')}
        title={t('provincesPage.title')}
        subtitle={t('provincesPage.subtitle')}
      />
      {error && (
        <p className="mt-6 rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
          {t('common.loadProvincesError', { error })}
        </p>
      )}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <Loader label={t('common.loadingProvinces')} />
        ) : (
          provinces.map((province) => <ProvinceCard key={province._id} province={province} />)
        )}
      </div>
    </div>
  );
}
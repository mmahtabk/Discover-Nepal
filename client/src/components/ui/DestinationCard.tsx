import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Destination } from '../../types';
import { TagPill } from './TagPill';
import { useAuth } from '../../auth/AuthContext';
import { useSaved } from '../../saved/SavedContext';

function provinceName(destination: Destination): string {
  if (destination.provinceId && typeof destination.provinceId === 'object') {
    return 'name' in destination.provinceId ? destination.provinceId.name : 'Nepal';
  }
  return 'Nepal';
}

export function DestinationCard({ destination }: { destination: Destination }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSaved();
  const [busy, setBusy] = useState(false);

  const saved = isSaved(destination._id);

  const onSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      await toggleSave(destination._id);
    } catch {
      // optimistic update already rolled back by the provider
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative">
      <Link
        to={`/destinations/${destination.slug}`}
        className="group block overflow-hidden rounded-2xl border border-stone-2 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3">
            <TagPill category={destination.category} />
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-serif text-lg font-bold text-ink">{destination.name}</h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
            {provinceName(destination)} · {destination.district}
          </p>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/80">{destination.subtitle}</p>
        </div>
      </Link>
      {user && (
        <button
          type="button"
          onClick={onSave}
          aria-pressed={saved}
          aria-label={saved ? t('save.savedWithAccount') : t('save.saveForLater')}
          title={saved ? t('save.savedWithAccount') : t('save.saveForLater')}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full shadow-sm transition-colors ${
            saved ? 'bg-forest text-white' : 'bg-white/90 text-ink hover:bg-white'
          }`}
        >
          <span aria-hidden="true" className="text-base leading-none">
            {saved ? '♥' : '♡'}
          </span>
        </button>
      )}
    </div>
  );
}
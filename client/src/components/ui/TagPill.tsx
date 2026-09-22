import { useTranslation } from 'react-i18next';
import type { Category } from '../../types';

const PILL_STYLES: Record<Category, string> = {
  trek: 'bg-evergreen/15 text-evergreen',
  nature: 'bg-evergreen/10 text-pine',
  culture: 'bg-pine/10 text-pine',
  'hidden-gem': 'bg-mint text-[#2e6b4f] ring-1 ring-inset ring-evergreen/25',
};

const LABEL_KEY: Record<Category, string> = {
  trek: 'categories.trek',
  nature: 'categories.nature',
  culture: 'categories.culture',
  'hidden-gem': 'categories.hiddenGem',
};

export function TagPill({ category }: { category: Category }) {
  const { t } = useTranslation();
  const hidden = category === 'hidden-gem';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${PILL_STYLES[category]}`}
    >
      {hidden && <span aria-hidden>✦</span>}
      {t(LABEL_KEY[category])}
    </span>
  );
}
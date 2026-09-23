import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { site } from '../../data/site';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-20 bg-forest text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl font-bold">{t('brand')}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/80">{t('tagline')}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
            {t('footer.explore')}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="hover:text-gold">
                  {t(item.tKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
            {t('footer.provinces')}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/80">{t('footer.provinceList')}</p>
        </div>
      </div>
      <div className="border-t border-white/20">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/60 sm:px-6">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
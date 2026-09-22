import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { site } from '../../data/site';
import { useAuth } from '../../auth/AuthContext';
import { LANGUAGE_LABEL, SUPPORTED_LANGS, setLanguage, type SupportedLanguage } from '../../i18n';

export function Navbar() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const current = (SUPPORTED_LANGS.includes(i18n.language as SupportedLanguage)
    ? (i18n.language as SupportedLanguage)
    : 'en') as SupportedLanguage;

  return (
    <header className="sticky top-0 z-50 border-b border-mint bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold text-ink">{t('brand')}</span>
        </NavLink>
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1 text-sm font-medium sm:gap-2">
            {site.nav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  isActive
                    ? 'rounded-full bg-evergreen px-3 py-1.5 text-white'
                    : 'rounded-full px-3 py-1.5 text-ink hover:bg-mint'
                }
              >
                {t(item.tKey)}
              </NavLink>
            ))}
          </nav>

          <div
            className="flex items-center rounded-full border border-mint bg-white p-0.5"
            role="group"
            aria-label="Language"
          >
            {SUPPORTED_LANGS.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                aria-pressed={current === lang}
                className={
                  current === lang
                    ? 'rounded-full bg-evergreen px-3 py-1 text-xs font-semibold text-white'
                    : 'rounded-full px-3 py-1 text-xs font-medium text-mist hover:text-ink'
                }
              >
                {LANGUAGE_LABEL[lang]}
              </button>
            ))}
          </div>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="rounded-full bg-pine/10 px-3 py-1.5 text-sm font-semibold text-pine">
                {user.name.split(' ')[0]}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-mist hover:bg-mint hover:text-ink"
              >
                {t('auth.signOut')}
              </button>
            </div>
          ) : (
            <Link
              to="/plan-trip"
              className="hidden rounded-full border border-evergreen/40 px-3 py-1.5 text-sm font-semibold text-evergreen hover:bg-evergreen hover:text-white sm:inline-block"
            >
              {t('auth.signIn')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './en';
import { ne } from './ne';

export const SUPPORTED_LANGS = ['en', 'ne'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGS)[number];

export const LANGUAGE_LABEL: Record<SupportedLanguage, string> = {
  en: 'EN',
  ne: 'नेपाली',
};

const STORAGE_KEY = 'discover-nepal-lang';

function initialLanguage(): SupportedLanguage {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'ne') return saved;
  }
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('ne')) {
    return 'ne';
  }
  return 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ne: { translation: ne },
  },
  lng: initialLanguage(),
  fallbackLng: 'en',
  supportedLngs: ['en', 'ne'],
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

export function setLanguage(lang: SupportedLanguage): void {
  i18n.changeLanguage(lang);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lang);
  }
  document.documentElement.lang = lang;
}

document.documentElement.lang = i18n.language;

export default i18n;
import { useEffect } from 'react';

export function useLanguageFromUrl(i18n, searchParams) {
  useEffect(() => {
    const lang = searchParams.get('lang') || 'en';
    i18n.changeLanguage(lang);
  }, [searchParams, i18n]);
}
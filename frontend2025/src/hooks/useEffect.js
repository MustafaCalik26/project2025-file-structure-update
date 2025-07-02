import { useEffect } from 'react';

export function useLanguageFromUrl(i18n, searchParams) {
  useEffect(() => {
    const lang = searchParams.get('lang') || 'tr';
    i18n.changeLanguage(lang);
  }, [searchParams, i18n]);
}
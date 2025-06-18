import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Tr from './Lng/tr.json';
import En from './Lng/en.json';
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: En },
      tr: { translation: Tr },
    },
    lng: 'en', // Defo Lang
    fallbackLng: 'tr',

    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
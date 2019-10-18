/** @format */

import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  // load translation using xhr -> see /public/locales
  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    // please see: https://www.i18next.com/overview/configuration-options
    whitelist: ['en', 'zh'],
    load: 'languageOnly',
    fallbackLng: 'en', // language to use if translations in user language are not available
    ns: ['translation'], // string or array of namespaces to load
    debug: false,
    keySeparator: true,
    pluralSeparator: '-',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      allowMultiLoading: true,
      loadPath: '/assets/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      debug: false,
      // order and from where user language should be detected
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      load: 'all',
      // keys or params to lookup language from
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,

      // cache user language on
      caches: [],
      excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

      // optional htmlTag with lang attribute, the default is:
      htmlTag: document.documentElement
    }
  });

export default i18n;

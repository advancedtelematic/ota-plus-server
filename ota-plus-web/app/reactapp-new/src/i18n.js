import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import translations_eng from '../../assets/locales/en/translation-new.json'
import translations_zh from '../../assets/locales/zh/translation-new.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
        en: {
            translation: translations_eng
        },
        zh: {
            translation: translations_zh
        }
    },
    whitelist: ['en', 'zh'],
    fallbackLng: 'en',
    keySeparator: true,
    pluralSeparator: '-',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;

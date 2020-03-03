import i18n from '../i18n';
import { i18ToMomenLocaleMapping } from '../config';

export const getLanguage = () => i18n.language || window.localStorage.i18nextLng;

export const getCurrentLanguageIndex = (supportedLanguages) => {
  const languageIndex = supportedLanguages.findIndex(item => item.language === getLanguage());
  return languageIndex > -1 ? languageIndex : 0;
};

export const isLanguageSupported = (language, supportedLanguages) => {
  const languageIndex = supportedLanguages.findIndex(item => item.language === language);
  return languageIndex > -1;
};

export const getMomentLocale = i18Language => i18ToMomenLocaleMapping[i18Language];

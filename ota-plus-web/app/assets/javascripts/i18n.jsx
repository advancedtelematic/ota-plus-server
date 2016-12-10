define(function (require) {
  i18n = require('i18next');
  XHR = require('i18nextXHRBackend'),
  LanguageDetector = require('i18nextBrowserLanguageDetector');

  return i18n
    .use(XHR)
    .use(LanguageDetector)
    .init({
      fallbackLng: 'en',
        debug: true,
        interpolation: {
        escapeValue: false // not needed for react!!
      },
      backend: {
        loadPath: "/assets/javascripts/locales/{{lng}}/{{ns}}.json"
      }
    });
});

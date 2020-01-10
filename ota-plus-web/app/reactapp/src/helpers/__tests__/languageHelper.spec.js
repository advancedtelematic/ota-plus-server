/* eslint-disable global-require */
import { LANGUAGE_SYMBOL_ENGLISH, LANGUAGE_SYMBOL_PSEUDO, SUPPORTED_LANGUAGES } from '../../config';

const LANGUAGE_ENGLISH = SUPPORTED_LANGUAGES[0].language;
const LANGUAGE_SYMBOL_NOT_SUPPORTED = 'pl';

describe('languageHelper', () => {
  beforeEach(() => jest.resetModules());

  it('language should be initially undefined', () => {
    jest.mock('../../i18n', () => ({
      language: undefined
    }));
    const { getLanguage } = require('../languageHelper');
    expect(getLanguage()).toEqual(undefined);
  });

  it('language should be equal to en', () => {
    jest.doMock('../../i18n', () => ({
      language: LANGUAGE_SYMBOL_ENGLISH
    }));
    const { getLanguage } = require('../languageHelper');
    expect(getLanguage()).toEqual(LANGUAGE_ENGLISH);
  });

  it('language index should be initially 0', () => {
    const { getCurrentLanguageIndex } = require('../languageHelper');
    expect(getCurrentLanguageIndex(SUPPORTED_LANGUAGES)).toEqual(0);
  });

  it('language index should be equal to 0 supported language item', () => {
    jest.doMock('../../i18n', () => ({
      language: SUPPORTED_LANGUAGES[0].language
    }));
    const { getCurrentLanguageIndex } = require('../languageHelper');
    expect(getCurrentLanguageIndex(SUPPORTED_LANGUAGES)).toEqual(0);
  });

  it('language index should be equal to 0 but not supported language item', () => {
    jest.doMock('../../i18n', () => ({
      language: LANGUAGE_SYMBOL_NOT_SUPPORTED
    }));
    const { getCurrentLanguageIndex } = require('../languageHelper');
    expect(getCurrentLanguageIndex(SUPPORTED_LANGUAGES)).toEqual(0);
  });

  it('language index should be equal to 1 supported language item', () => {
    jest.doMock('../../i18n', () => ({
      language: SUPPORTED_LANGUAGES[1].language
    }));
    const { getCurrentLanguageIndex } = require('../languageHelper');
    expect(getCurrentLanguageIndex(SUPPORTED_LANGUAGES)).toEqual(1);
  });

  it('language english and pseudo should be supported', () => {
    jest.doMock('../../i18n', () => ({
      language: SUPPORTED_LANGUAGES[1].language
    }));
    const { isLanguageSupported } = require('../languageHelper');
    expect(isLanguageSupported(LANGUAGE_SYMBOL_ENGLISH, SUPPORTED_LANGUAGES)).toEqual(true);
    expect(isLanguageSupported(LANGUAGE_SYMBOL_PSEUDO, SUPPORTED_LANGUAGES)).toEqual(true);
  });

  it('language which not exists should be not supported', () => {
    jest.doMock('../../i18n', () => ({
      language: SUPPORTED_LANGUAGES[1].language
    }));
    const { isLanguageSupported } = require('../languageHelper');
    expect(isLanguageSupported(LANGUAGE_SYMBOL_NOT_SUPPORTED, SUPPORTED_LANGUAGES)).toEqual(false);
  });
});

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useObserver } from 'mobx-react';
import { Dropdown } from 'antd';
import moment from 'moment';
import {
  OTA_FOOTER_CONTACT,
  OTA_FOOTER_LANGUAGES,
  OTA_FOOTER_PRIVACY,
  OTA_FOOTER_TERMS
} from '../../constants/analyticsActions';
import { sendAction } from '../../helpers/analyticsHelper';
import {
  getCurrentLanguageIndex,
  getLanguage,
  getMomentLocale,
  isLanguageSupported
} from '../../helpers/languageHelper';

import {
  ButtonStyled,
  ButtonText,
  CopyrightTag,
  FooterContainer,
  IconStyled,
  LanguageTag,
  MenuItemStyled,
  MenuStyled,
  RightContainer
} from './styled';
import ExternalLink from '../ExternalLink';
import {
  URL_FOOTER_CONTACT_US,
  URL_FOOTER_PRIVACY_POLICY,
  URL_FOOTER_SERVICE_TERMS
} from '../../constants/urlConstants';
import { FEATURES, SUPPORTED_LANGUAGES, LANGUAGE_SYMBOL_PSEUDO } from '../../config';
import i18n from '../../i18n';
import { useStores } from '../../stores/hooks';

const renderLinks = links => (
  links.map(link => (
    <ExternalLink
      key={`${link.url}-${link.name}`}
      onClick={() => sendAction(link.actionType)}
      url={link.url}
    >
      {link.name}
    </ExternalLink>
  ))
);

const languages = (t, supportedLanguages) => supportedLanguages.map(item => t(item.textKey));

const languageMenu = (t, handleLanguageMenuClick, supportedLanguages) => (
  <MenuStyled id="footer-language-menu" onClick={handleLanguageMenuClick}>
    {languages(t, supportedLanguages).map((item, index) => (
      <MenuItemStyled id={`footer-language-menu-item-${index}`} key={`${index}`}>
        {item}
      </MenuItemStyled>
    ))}
  </MenuStyled>
);

function useStoreData() {
  const { stores } = useStores();
  return useObserver(() => ({
    features: stores.featuresStore.features,
    usePseudoLocalisation: stores.featuresStore.features.includes(FEATURES.PSEUDO_LOCALISATION),
  }));
}

export const Footer = () => {
  const { t } = useTranslation();
  const links = [
    { actionType: OTA_FOOTER_TERMS, name: t('footer.links.service-terms'), url: URL_FOOTER_SERVICE_TERMS },
    { actionType: OTA_FOOTER_PRIVACY, name: t('footer.links.privacy-policy'), url: URL_FOOTER_PRIVACY_POLICY },
    { actionType: OTA_FOOTER_CONTACT, name: t('footer.links.contact-us'), url: URL_FOOTER_CONTACT_US }
  ];

  const { features, usePseudoLocalisation } = useStoreData();
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [languageSelectedIndex, setLanguageSelectedIndex] = useState(getCurrentLanguageIndex(supportedLanguages));
  useEffect(() => {
    const supportedLanguagesTemp = [];
    SUPPORTED_LANGUAGES.forEach((item) => {
      switch (item.language) {
        case LANGUAGE_SYMBOL_PSEUDO:
          if (usePseudoLocalisation) {
            supportedLanguagesTemp.push(item);
          }
          break;
        default:
          supportedLanguagesTemp.push(item);
          break;
      }
    });
    setSupportedLanguages(supportedLanguagesTemp);
    if (!isLanguageSupported(getLanguage(), supportedLanguagesTemp)) {
      const { language } = supportedLanguagesTemp[0];
      setLanguageSelectedIndex(0);
      i18n.changeLanguage(language);
      moment.locale(getMomentLocale(language));
    } else if (languageSelectedIndex !== getCurrentLanguageIndex(supportedLanguagesTemp)) {
      setLanguageSelectedIndex(getCurrentLanguageIndex(supportedLanguagesTemp));
    }
  }, [features]);

  const handleLanguageMenuClick = (event) => {
    const key = parseInt(event.key, 10);
    setLanguageSelectedIndex(key);
    const { language } = supportedLanguages[key];
    i18n.changeLanguage(language);
    moment.locale(getMomentLocale(language));
    sendAction(OTA_FOOTER_LANGUAGES);
  };
  return (
    <FooterContainer id="footer-container">
      {renderLinks(links)}
      <RightContainer id="footer-container-right">
        <LanguageTag id="footer-language-tag">{t('footer.language')}</LanguageTag>
        <Dropdown
          id="footer-language-dropdown"
          overlay={languageMenu(t, handleLanguageMenuClick, supportedLanguages)}
        >
          <ButtonStyled id="footer-language-button">
            <ButtonText id="footer-language-button-text">
              {languages(t, supportedLanguages)[languageSelectedIndex]}
            </ButtonText>
            <IconStyled id="footer-language-button-icon" type="down" />
          </ButtonStyled>
        </Dropdown>
        <CopyrightTag id="footer-copyright-tag">{t('footer.copyright')}</CopyrightTag>
      </RightContainer>
    </FooterContainer>
  );
};

export default Footer;

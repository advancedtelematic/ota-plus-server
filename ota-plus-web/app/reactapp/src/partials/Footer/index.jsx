import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'antd';
import {
  OTA_FOOTER_CONTACT,
  OTA_FOOTER_LANGUAGES,
  OTA_FOOTER_PRIVACY,
  OTA_FOOTER_TERMS
} from '../../constants/analyticsActions';
import { sendAction } from '../../helpers/analyticsHelper';

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

const handleLanguageMenuClick = () => {
  // TODO: add languages switching. There is a need for event pass as an argument.
  sendAction(OTA_FOOTER_LANGUAGES);
};

const languageMenu = t => (
  <MenuStyled onClick={handleLanguageMenuClick}>
    <MenuItemStyled key="1">
      {t('footer.language.english')}
    </MenuItemStyled>
  </MenuStyled>
);

export const Footer = () => {
  const { t } = useTranslation();
  const links = [
    { actionType: OTA_FOOTER_TERMS, name: t('footer.links.service-terms'), url: URL_FOOTER_SERVICE_TERMS },
    { actionType: OTA_FOOTER_PRIVACY, name: t('footer.links.privacy-policy'), url: URL_FOOTER_PRIVACY_POLICY },
    { actionType: OTA_FOOTER_CONTACT, name: t('footer.links.contact-us'), url: URL_FOOTER_CONTACT_US }
  ];

  return (
    <FooterContainer id="app-footer">
      {renderLinks(links)}
      <RightContainer>
        <LanguageTag id="footer-language-tag">{t('footer.language')}</LanguageTag>
        <Dropdown overlay={languageMenu(t)}>
          <ButtonStyled>
            <ButtonText>{t('footer.language.english')}</ButtonText>
            <IconStyled type="down" />
          </ButtonStyled>
        </Dropdown>
        <CopyrightTag id="footer-copyright-tag">{t('footer.copyright')}</CopyrightTag>
      </RightContainer>
    </FooterContainer>
  );
};

export default Footer;

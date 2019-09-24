import React from 'react';
import styled from 'styled-components';
import { UseTranslationResponse, useTranslation } from 'react-i18next';

import { ExternalLink } from '../common';

const Footer = styled.footer`
  height: 50px;
  background-color: ${({ theme }) => theme.palette.secondary};
  box-shadow: ${({ theme }) => theme.shadows.upwards};
  padding: 0 30px;
  display: flex;
  align-items: center;
  line-height: 0.86em;
  ${ExternalLink}:not(:first-of-type) {
    padding-left: 10px;
  };
  ${ExternalLink}:not(:last-of-type) {
    border-right: 1px solid rgba(255,255,255,0.2);
    padding-right: 10px;
  };
`;

const CopyrightTag = styled.span`
  margin-left: auto;
  color: ${({ theme }) => theme.palette.white};
  font-size: 0.72em;
  font-weight: 300;
`;

type Link = {
  name: string,
  url: string
};

const renderLinks = (links: Link[]): React.ReactElement[] => (
  links.map(link => (
    <ExternalLink size="small" url={link.url} key={`${link.url}-${link.name}`}>
      {link.name}
    </ExternalLink>
  ))
);

export const AppFooter: React.FC = () => {
  const { t }: UseTranslationResponse = useTranslation();
  const links: Link[] = [
    { name: t('footer.links.service-terms'), url: t('footer.links.service-terms.url') },
    { name: t('footer.links.privacy-policy'), url: t('footer.links.privacy-policy.url') },
    { name: t('footer.links.cookie-policy'), url: t('footer.links.cookie-policy.url') },
    { name: t('footer.links.contact-us'), url: t('footer.links.contact-us.url') }
  ];

  return (
    <Footer id="app-footer">
      {renderLinks(links)}
      <CopyrightTag>{t('footer.copyright')}</CopyrightTag>
    </Footer>
  );
};

export default AppFooter;

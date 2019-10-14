import React from 'react';
import { useTranslation, UseTranslationResponse } from 'react-i18next';
import { Container, Title, ExternalLink, Icon } from '../../common';
import { Description, List, ListItem, StyledIcon } from './styled';

const DocsLinks = () => {
  const { t }: UseTranslationResponse = useTranslation();
  return (
    <Container elevation={2} id="docs-links">
      <Title id="docs-links-title">{t('dashboard.docs-links.title')}</Title>
      <Description id="docs-links-desc">{t('dashboard.docs-links.description')}</Description>
      <List>
        <ListItem>
          <StyledIcon type="devices" />
          <ExternalLink
            id="docs-links-link-devicegroups"
            url="#"
          >
            {t('dashboard.docs-links.links.device-group')}
          </ExternalLink>
        </ListItem>
        <ListItem>
          <StyledIcon type="softwareUpdates" />
          <ExternalLink
            id="docs-links-link-updateconfig"
            url="#"
          >
            {t('dashboard.docs-links.links.update-configuration')}
          </ExternalLink>
        </ListItem>
        <ListItem>
          <StyledIcon type="campaigns" />
          <ExternalLink
            id="docs-links-link-campaigns"
            url="#"
          >
            {t('dashboard.docs-links.links.campaigns')}
          </ExternalLink>
        </ListItem>
        <ListItem>
          <StyledIcon type="campaigns" />
          <ExternalLink
            id="docs-links-link-troubleshoot"
            url="#"
          >
            {t('dashboard.docs-links.links.troubleshoot')}
          </ExternalLink>
        </ListItem>
      </List>
    </Container>
  );
};

export default DocsLinks;

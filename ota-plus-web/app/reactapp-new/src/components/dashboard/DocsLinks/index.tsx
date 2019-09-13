import React from 'react';
import { useTranslation, UseTranslationResponse } from 'react-i18next';
import { Container, Title, ExternalLink, Icon } from '../../common';
import { Description, List, ListItem, StyledIcon } from './styled';

const DocsLinks = () => {
  const { t }: UseTranslationResponse = useTranslation();
  return (
    <Container elevation={2} id="docs-links">
      <Title id="docs-links-title">{t('dashboard.docslinks.title')}</Title>
      <Description id="docs-links-desc">{t('dashboard.docslinks.description')}</Description>
      <List>
        <ListItem>
          <StyledIcon type="devices" />
          <ExternalLink
            id="docs-links-link-devicegroups"
            url="#"
          >
            {t('dashboard.docslinks.links.devicegroup')}
          </ExternalLink>
        </ListItem>
        <ListItem>
          <StyledIcon type="softwareUpdates" />
          <ExternalLink
            id="docs-links-link-updateconfig"
            url="#"
          >
            {t('dashboard.docslinks.links.updateconfiguration')}
          </ExternalLink>
        </ListItem>
        <ListItem>
          <StyledIcon type="campaigns" />
          <ExternalLink
            id="docs-links-link-campaigns"
            url="#"
          >
            {t('dashboard.docslinks.links.campaigns')}
          </ExternalLink>
        </ListItem>
        <ListItem>
          <StyledIcon type="campaigns" />
          <ExternalLink
            id="docs-links-link-troubleshoot"
            url="#"
          >
            {t('dashboard.docslinks.links.troubleshoot')}
          </ExternalLink>
        </ListItem>
      </List>
    </Container>
  );
};

export default DocsLinks;

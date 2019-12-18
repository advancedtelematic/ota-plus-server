import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, ExternalLink } from '../../../../partials';
import { Description, DocsLinksWrapper, List, ListItem, StyledIcon, Title } from './styled';
import { sendAction } from '../../../../helpers/analyticsHelper';
import {
  OTA_HOME_READ_CAMPAIGN_EXAMPLES,
  OTA_HOME_READ_GROUP_EXAMPLES,
  OTA_HOME_READ_TROUBLESHOOT_EXAMPLES,
  OTA_HOME_READ_UPDATE_EXAMPLES
} from '../../../../constants/analyticsActions';
import {
  URL_DOCS_LINKS_CREATE_CAMPAIGNS,
  URL_DOCS_LINKS_DEVICE_GROUPS,
  URL_DOCS_LINKS_SOFTWARE_UPDATES,
  URL_DOCS_LINKS_TROUBLESHOOT_CAMPAIGN
} from '../../../../constants/urlConstants';

const ICON_CAMPAIGNS = '/assets/img/new-app/24/campaigns-active-solid-24-green.svg';
const ICON_DEVICES = '/assets/img/new-app/24/devices-active-outline-24-green.svg';
const ICON_SOFTWARE_UPDATES = '/assets/img/new-app/24/software-updates-active-outline-24-green.svg';

const DocsLinks = () => {
  const { t } = useTranslation();
  return (
    <DocsLinksWrapper id="docs-link-wrapper">
      <Container elevation={2} rounded={false} id="docs-links">
        <Title id="docs-links-title">{t('dashboard.docs-links.title')}</Title>
        <Description id="docs-links-desc">{t('dashboard.docs-links.description')}</Description>
        <List>
          <ListItem>
            <StyledIcon src={ICON_DEVICES} />
            <ExternalLink
              id="docs-links-link-device-groups"
              onClick={() => sendAction(OTA_HOME_READ_GROUP_EXAMPLES)}
              url={URL_DOCS_LINKS_DEVICE_GROUPS}
              weight="medium"
            >
              {t('dashboard.docs-links.link-create-device-groups')}
            </ExternalLink>
          </ListItem>
          <ListItem>
            <StyledIcon src={ICON_SOFTWARE_UPDATES} />
            <ExternalLink
              id="docs-links-link-update-software"
              onClick={() => sendAction(OTA_HOME_READ_UPDATE_EXAMPLES)}
              url={URL_DOCS_LINKS_SOFTWARE_UPDATES}
              weight="medium"
            >
              {t('dashboard.docs-links.link-create-software-updates')}
            </ExternalLink>
          </ListItem>
          <ListItem>
            <StyledIcon src={ICON_CAMPAIGNS} />
            <ExternalLink
              id="docs-links-link-create-campaigns"
              onClick={() => sendAction(OTA_HOME_READ_CAMPAIGN_EXAMPLES)}
              url={URL_DOCS_LINKS_CREATE_CAMPAIGNS}
              weight="medium"
            >
              {t('dashboard.docs-links.link-create-campaigns')}
            </ExternalLink>
          </ListItem>
          <ListItem>
            <StyledIcon src={ICON_CAMPAIGNS} />
            <ExternalLink
              id="docs-links-link-troubleshoot-campaigns"
              onClick={() => sendAction(OTA_HOME_READ_TROUBLESHOOT_EXAMPLES)}
              url={URL_DOCS_LINKS_TROUBLESHOOT_CAMPAIGN}
              weight="medium"
            >
              {t('dashboard.docs-links.link-create-troubleshoot-campaigns')}
            </ExternalLink>
          </ListItem>
        </List>
      </Container>
    </DocsLinksWrapper>
  );
};

export default DocsLinks;

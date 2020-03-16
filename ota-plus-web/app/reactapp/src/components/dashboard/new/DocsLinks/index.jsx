import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, ExternalLink } from '../../../../partials';
import { Description, DocsLinksWrapper, List, ListItem, StyledIcon, Title } from './styled';
import { sendAction } from '../../../../helpers/analyticsHelper';
import {
  OTA_HOME_READ_EXAMPLES_GROUP,
  OTA_HOME_READ_EXAMPLES_UPDATE,
  OTA_HOME_READ_EXAMPLES_CAMPAIGN,
  OTA_HOME_READ_EXAMPLES_TROUBLESHOOT,
} from '../../../../constants/analyticsActions';
import {
  URL_DOCS_LINKS_CREATE_CAMPAIGNS,
  URL_DOCS_LINKS_DEVICE_GROUPS,
  URL_DOCS_LINKS_SOFTWARE_UPDATES,
  URL_DOCS_LINKS_TROUBLESHOOT_CAMPAIGN
} from '../../../../constants/urlConstants';
import {
  CAMPAIGNS_ICON_GREEN,
  DEVICE_ICON_GREEN,
  UPDATE_ICON_GREEN
} from '../../../../config';

const DocsLinks = () => {
  const { t } = useTranslation();
  return (
    <DocsLinksWrapper id="docs-link-wrapper">
      <Container elevation={2} rounded={false} id="docs-links">
        <Title id="docs-links-title">{t('dashboard.docs-links.title')}</Title>
        <Description id="docs-links-desc">{t('dashboard.docs-links.description')}</Description>
        <List>
          <ListItem>
            <StyledIcon src={DEVICE_ICON_GREEN} />
            <ExternalLink
              id="docs-links-link-device-groups"
              onClick={() => sendAction(OTA_HOME_READ_EXAMPLES_GROUP)}
              url={URL_DOCS_LINKS_DEVICE_GROUPS}
              weight="medium"
            >
              {t('dashboard.docs-links.link-create-device-groups')}
            </ExternalLink>
          </ListItem>
          <ListItem>
            <StyledIcon src={UPDATE_ICON_GREEN} />
            <ExternalLink
              id="docs-links-link-update-software"
              onClick={() => sendAction(OTA_HOME_READ_EXAMPLES_UPDATE)}
              url={URL_DOCS_LINKS_SOFTWARE_UPDATES}
              weight="medium"
            >
              {t('dashboard.docs-links.link-create-software-updates')}
            </ExternalLink>
          </ListItem>
          <ListItem>
            <StyledIcon src={CAMPAIGNS_ICON_GREEN} />
            <ExternalLink
              id="docs-links-link-create-campaigns"
              onClick={() => sendAction(OTA_HOME_READ_EXAMPLES_CAMPAIGN)}
              url={URL_DOCS_LINKS_CREATE_CAMPAIGNS}
              weight="medium"
            >
              {t('dashboard.docs-links.link-create-campaigns')}
            </ExternalLink>
          </ListItem>
          <ListItem>
            <StyledIcon src={CAMPAIGNS_ICON_GREEN} />
            <ExternalLink
              id="docs-links-link-troubleshoot-campaigns"
              onClick={() => sendAction(OTA_HOME_READ_EXAMPLES_TROUBLESHOOT)}
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

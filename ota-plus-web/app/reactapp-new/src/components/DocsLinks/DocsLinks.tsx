import React from 'react';
import { useTranslation, UseTranslationResponse } from 'react-i18next';
import { Container, Title, ExternalLink, Icon } from '../common';
import styled from 'styled-components';

const Description = styled.div`
  color: ${({ theme }) => theme.palette.texts.black};
  font-size: 1em;
  line-height: 17px;
`;

const List = styled.ul`
  list-style: none;
  margin: 1.3em 0 0 0;
  padding: 0;
`;

const ListItem = styled.li`
  margin: 0.6em 0 0 0;
  line-height: 18px;
`;

const StyledIcon = styled(Icon)`
  width: 13px;
  margin-top: -3px;
  margin-right: 10px;
`;

const DocsLinks = () => {
  const { t }: UseTranslationResponse = useTranslation();
  return (
    <Container>
      <Title>{t('dashboard.docslinks.title')}</Title>
      <Description>{t('dashboard.docslinks.description')}</Description>
      <List>
        <ListItem>
          <StyledIcon type="devices" />
          <ExternalLink url="#">{t('dashboard.docslinks.links.devicegroup')}</ExternalLink>
        </ListItem>
        <ListItem>
          <StyledIcon type="softwareUpdates" />
          <ExternalLink url="#">{t('dashboard.docslinks.links.updateconfiguration')}</ExternalLink>
        </ListItem>
        <ListItem>
          <StyledIcon type="campaigns" />
          <ExternalLink url="#">{t('dashboard.docslinks.links.campaigns')}</ExternalLink>
        </ListItem>
        <ListItem>
          <StyledIcon type="campaigns" />
          <ExternalLink url="#">{t('dashboard.docslinks.links.troubleshoot')}</ExternalLink>
        </ListItem>
      </List>
    </Container>
  );
};

export default DocsLinks;

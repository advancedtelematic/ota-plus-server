import React from 'react';
import styled from 'styled-components';
import { useTranslation, UseTranslationResponse } from 'react-i18next';
import { Container, Title, ExternalLink, Icon } from '../../common';

const Description = styled.div`
  color: ${({ theme }) => theme.palette.texts.black};
  font-size: 0.93em;
  line-height: 24px;
  padding-right: 40px;
`;

const List = styled.ul`
  list-style: none;
  margin: 1em 0 0 0;
  padding: 0;
`;

const ListItem = styled.li`
  margin: 0.3em 0 0 0;
  height: 35px;
  display: flex;
  align-items: center;
  a {
    line-height: 20px;
  }
`;

const StyledIcon = styled(Icon)`
  width: 16px;
  margin-right: 10px;
`;

const DocsLinks = () => {
  const { t }: UseTranslationResponse = useTranslation();
  return (
    <Container elevation={2}>
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

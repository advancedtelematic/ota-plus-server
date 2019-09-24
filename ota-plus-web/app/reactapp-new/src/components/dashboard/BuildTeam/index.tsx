import React from 'react';
import { useTranslation, UseTranslationResponse } from 'react-i18next';
import { Theme } from '../../common/Icon';
import { Container, Title, Icon } from '../../common';
import { AddMembersButton, Description, StyledIcon, TitleWrapper } from './styled';

export const BuildTeam = () => {
  const { t }: UseTranslationResponse = useTranslation();
  return (
    <Container id="build-team" elevation={2}>
      <TitleWrapper>
        <StyledIcon type="people" />
        <Title id="build-team-title">{t('dashboard.buildteam.title')}</Title>
      </TitleWrapper>
      <Description id="build-team-desc">{t('dashboard.buildteam.description')}</Description>
      <AddMembersButton type="link" id="build-team-add-btn">
        <Icon theme={Theme.aqua} type="plus" />
        {t('dashboard.buildteam.button-title')}
      </AddMembersButton>
    </Container>
  );
};

export default BuildTeam;

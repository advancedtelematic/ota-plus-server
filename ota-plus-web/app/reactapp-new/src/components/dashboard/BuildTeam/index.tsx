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
        <Title id="build-team-title">{t('dashboard.build-team.title')}</Title>
      </TitleWrapper>
      <Description id="build-team-desc">{t('dashboard.build-team.description')}</Description>
      <AddMembersButton type="link" id="build-team-add-btn">
        <Icon colorTheme={Theme.aqua} type="plus" />
        {t('dashboard.build-team.button-title')}
      </AddMembersButton>
    </Container>
  );
};

export default BuildTeam;

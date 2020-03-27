import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Title } from '../../../../partials';
import { AddMembersButton, BuildTeamWrapper, Description, StyledIcon, TitleWrapper } from './styled';
import { PEOPLE_ICON, PLUS_ICON } from '../../../../config';
import { sendAction } from '../../../../helpers/analyticsHelper';
import { OTA_HOME_ADD_MEMBERS } from '../../../../constants/analyticsActions';

const BuildTeam = () => {
  const { t } = useTranslation();

  return (
    <BuildTeamWrapper id="build-team" elevation={2}>
      <TitleWrapper>
        <StyledIcon src={PEOPLE_ICON} />
        <Title id="build-team-title">{t('dashboard.build-team.title')}</Title>
      </TitleWrapper>
      <Description id="build-team-desc">{t('dashboard.build-team.description')}</Description>
      <Link to="/environments">
        <AddMembersButton type="link" id="build-team-add-btn" onClick={() => sendAction(OTA_HOME_ADD_MEMBERS)}>
          <img src={PLUS_ICON} />
          {t('dashboard.build-team.button-title')}
        </AddMembersButton>
      </Link>
    </BuildTeamWrapper>
  );
};

export default BuildTeam;

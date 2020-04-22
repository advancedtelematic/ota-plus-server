import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../../../stores/hooks';
import { Title } from '../../../../partials';
import { AddMembersButton, BuildTeamWrapper, Description, StyledIcon, TitleWrapper } from './styled';
import { PEOPLE_ICON, PLUS_ICON } from '../../../../config';
import { sendAction } from '../../../../helpers/analyticsHelper';
import {
  OTA_HOME_ADD_MEMBERS,
  OTA_HOME_CREATE_ENVIRONMENT,
  OTA_HOME_READ_MORE_ENVIRONMENT
} from '../../../../constants/analyticsActions';
import ExternalLink from '../../../../partials/ExternalLink';
import { URL_ENVIRONMENTS_READ_MORE } from '../../../../constants/urlConstants';

const BuildTeam = () => {
  const { t } = useTranslation();
  const { stores } = useStores();

  const handleAddMemberClick = () => {
    stores.userStore.getOrganizationUsers();
    stores.userStore.getOrganization();
    stores.userStore.showEnvDetails = true;
    stores.userStore.environmentsAddMember = true;
    sendAction(OTA_HOME_ADD_MEMBERS);
  };

  const handleCreateEnvironmentClick = () => {
    stores.userStore.environmentsCreateEnvironment = true;
    sendAction(OTA_HOME_CREATE_ENVIRONMENT);
  };

  return (
    <BuildTeamWrapper id="build-team" elevation={2}>
      <TitleWrapper>
        <StyledIcon src={PEOPLE_ICON} />
        <Title id="build-team-title">{t('dashboard.build-team.title')}</Title>
      </TitleWrapper>
      <Description id="build-team-desc">
        {t('dashboard.build-team.description')}
        {' '}
        <ExternalLink
          key={'build-team-read-more-link'}
          onClick={() => sendAction(OTA_HOME_READ_MORE_ENVIRONMENT)}
          url={URL_ENVIRONMENTS_READ_MORE}
        >
          {t('dashboard.build-team.read-more')}
        </ExternalLink>
      </Description>
      <Link to="/environments">
        <AddMembersButton type="link" id="build-team-add-btn" onClick={() => handleAddMemberClick()}>
          <img src={PLUS_ICON} />
          {t('dashboard.build-team.button-title-add-members')}
        </AddMembersButton>
      </Link>
      <Link to="/environments">
        <AddMembersButton type="link" id="build-team-create-env-btn" onClick={() => handleCreateEnvironmentClick()}>
          <img src={PLUS_ICON} />
          {t('dashboard.build-team.button-title-create-environment')}
        </AddMembersButton>
      </Link>
    </BuildTeamWrapper>
  );
};

export default BuildTeam;

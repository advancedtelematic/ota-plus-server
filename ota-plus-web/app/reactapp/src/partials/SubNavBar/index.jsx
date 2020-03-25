import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useObserver } from 'mobx-react';
import EnvironmentsSelector from '../EnvironmentsSelector';
import {
  BackButton,
  EnvironmentContainer,
  EnvironmentTitle,
  SubNavBarContainer
} from './styled';
import { useStores } from '../../stores/hooks';
import { changeUserEnvironment } from '../../helpers/environmentHelper';
import { sendAction } from '../../helpers/analyticsHelper';
import { OTA_ENVIRONMENT_BACK_TO_LIST, OTA_NAV_ENV_SWITCH } from '../../constants/analyticsActions';
import { LOCATION_ENVIRONMENTS } from '../../constants/locationConstants';
import { getCurrentLocation } from '../../utils/Helpers';

const useStoreData = () => {
  const { stores: { userStore } } = useStores();
  return useObserver(() => ({
    environments: userStore.userOrganizations,
    showEnvDetails: userStore.showEnvDetails,
    userEnvironmentName: userStore.userOrganizationName,
    userEnvironmentNamespace: userStore.userOrganizationNamespace
  }));
};

const SubNavBar = ({ lightMode }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { stores } = useStores();
  const {
    environments,
    showEnvDetails,
    userEnvironmentName,
    userEnvironmentNamespace
  } = useStoreData();

  const handleMenuClick = (event) => {
    const key = parseInt(event.key, 10);
    if (userEnvironmentNamespace !== environments[key].namespace) {
      changeUserEnvironment(environments[key].namespace);
      sendAction(OTA_NAV_ENV_SWITCH);
    }
  };

  const getNavActionForPath = (path) => {
    switch (getCurrentLocation(path)) {
      case LOCATION_ENVIRONMENTS:
        stores.userStore.showEnvDetails = false;
        sendAction(OTA_ENVIRONMENT_BACK_TO_LIST);
        break;
      default:
        break;
    }
  };

  const renderNavigationForPath = () => {
    let navigation;
    switch (getCurrentLocation(location)) {
      case LOCATION_ENVIRONMENTS:
        if (showEnvDetails) {
          navigation = (
            <BackButton id="env-subnav-back-btn" onClick={() => getNavActionForPath(location)}>
              {t('profile.organization.nav.back')}
            </BackButton>
          );
        } else {
          navigation = (
            <span id="env-subnav-title">{t('profile.organization.nav.title')}</span>
          );
        }
        break;
      default:
        return null;
    }
    return <div id="app-subnavbar-navigation">{navigation}</div>;
  };

  return (
    <SubNavBarContainer id="app-subnavbar" lightMode={lightMode}>
      {renderNavigationForPath()}
      {environments.length && (
        <EnvironmentContainer id="app-subnavbar-environment-container">
          <EnvironmentTitle id="app-subnavbar-environment-title" lightMode={lightMode}>
            {t('navigation.environments.selector.title')}
          </EnvironmentTitle>
          <EnvironmentsSelector
            id="app-subnavbar-environment-selector"
            handleMenuClick={handleMenuClick}
            headerTitle={t('navigation.environments.selector.selecttitle')}
            lightMode={lightMode}
            environments={environments}
            userEnvironmentNamespace={userEnvironmentNamespace}
            userEnvironmentName={userEnvironmentName}
          />
        </EnvironmentContainer>
      )
      }
    </SubNavBarContainer>
  );
};

SubNavBar.propTypes = {
  lightMode: PropTypes.bool.isRequired,
};

export default SubNavBar;

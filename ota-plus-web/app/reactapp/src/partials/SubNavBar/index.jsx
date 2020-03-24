import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useObserver } from 'mobx-react';
import EnvironmentsSelector from '../EnvironmentsSelector';
import {
  EnvironmentContainer,
  EnvironmentTitle,
  SubNavBarContainer
} from './styled';
import { useStores } from '../../stores/hooks';
import { changeUserEnvironment } from '../../helpers/environmentHelper';
import { sendAction } from '../../helpers/analyticsHelper';
import { OTA_NAV_ENV_SWITCH } from '../../constants/analyticsActions';

const useStoreData = () => {
  const { stores: { userStore } } = useStores();
  return useObserver(() => ({
    environments: userStore.userOrganizations,
    userEnvironmentName: userStore.userOrganizationName,
    userEnvironmentNamespace: userStore.userOrganizationNamespace
  }));
};

const SubNavBar = ({ lightMode }) => {
  const { t } = useTranslation();
  const { environments, userEnvironmentName, userEnvironmentNamespace } = useStoreData();
  const handleMenuClick = (event) => {
    const key = parseInt(event.key, 10);
    if (userEnvironmentNamespace !== environments[key].namespace) {
      changeUserEnvironment(environments[key].namespace);
      sendAction(OTA_NAV_ENV_SWITCH);
    }
  };
  return (
    <SubNavBarContainer id="app-subnavbar" lightMode={lightMode}>
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

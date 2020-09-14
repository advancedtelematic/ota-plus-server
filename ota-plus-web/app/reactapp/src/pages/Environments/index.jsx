import React, { useEffect, useState } from 'react';
import { useObserver } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../stores/hooks';
import EnvironmentsHeader from '../../components/environments/EnvironmentsHeader';
import EnvironmentsList from '../../components/environments/EnvironmentsList';
import EnvironmentDetails from '../../components/environments/EnvironmentDetails';
import CreateEnvModal from '../../components/environments/modals/CreateEnvModal';
import { WarningModal } from '../../partials';
import { EnvListWrapper } from './styled';
import { MetaData } from '../../utils';
import { sendAction, setAnalyticsView } from '../../helpers/analyticsHelper';
import {
  OTA_ENVIRONMENT_CREATE_ENV,
  OTA_ENVIRONMENT_DETAILS,
  OTA_ENVIRONMENT_REACH_MAX_ENV
} from '../../constants/analyticsActions';
import { ANALYTICS_VIEW_ENVIRONMENTS } from '../../constants/analyticsViews';
import { WARNING_MODAL_COLOR } from '../../constants';

function useStoreData() {
  const { stores } = useStores();
  return useObserver(() => ({
    environments: stores.userStore.userOrganizations,
    maxEnvReached: stores.userStore.maxEnvReached,
    profile: stores.userStore.user.profile,
    showEnvDetails: stores.userStore.showEnvDetails
  }));
}

const Environments = () => {
  const { t } = useTranslation();
  const { stores } = useStores();
  const { environments, maxEnvReached, profile, showEnvDetails } = useStoreData();
  const [createEnvModalOpen, setCreateEnvModalOpen] = useState(false);

  const toggleCreateEnvModal = () => {
    setCreateEnvModalOpen(!createEnvModalOpen);
  };

  useEffect(() => {
    stores.userStore.getOrganizations();
    setAnalyticsView(ANALYTICS_VIEW_ENVIRONMENTS);
    if (stores.userStore.environmentsCreateEnvironment) {
      stores.userStore.environmentsCreateEnvironment = false;
      toggleCreateEnvModal();
    }
  }, []);

  const closeMaxEnvModal = () => {
    const { userStore } = stores;
    userStore.maxEnvReached = false;
    sendAction(OTA_ENVIRONMENT_REACH_MAX_ENV);
  };

  const handleCreateEnvironment = (envName) => {
    const { userStore } = stores;
    userStore.createEnvironment(envName);
    toggleCreateEnvModal();
    sendAction(OTA_ENVIRONMENT_CREATE_ENV);
  };

  const handleShowEnvDetails = (namespace) => {
    stores.userStore.getOrganizationUsers(namespace);
    stores.userStore.getOrganization(namespace);
    stores.userStore.showEnvDetails = true;
    sendAction(OTA_ENVIRONMENT_DETAILS);
  };

  const getInitialNamespaceName = () => {
    const initialNamespace = environments.find(env => env.namespace === profile.initialNamespace);
    if (initialNamespace) {
      return initialNamespace.name;
    }
    return '';
  };

  return (
    <MetaData title={t('profile.organization.title')}>
      {showEnvDetails
        ? <EnvironmentDetails />
        : (
          <div>
            <EnvironmentsHeader
              homeEnvName={profile && getInitialNamespaceName()}
              onCreateEnvBtnClick={toggleCreateEnvModal}
              onHomeEnvClick={() => handleShowEnvDetails(profile.initialNamespace)}
            />
            <EnvListWrapper>
              {environments.length > 0 && (
                <EnvironmentsList dataSource={environments} onListItemClick={handleShowEnvDetails} />
              )}
            </EnvListWrapper>
          </div>
        )
      }
      {createEnvModalOpen && (
        <CreateEnvModal onClose={toggleCreateEnvModal} onConfirm={handleCreateEnvironment} />
      )}
      {maxEnvReached && (
        <WarningModal
          id="max-env-modal"
          type={WARNING_MODAL_COLOR.INFO}
          title={t('profile.organization.max-env-modal.title')}
          desc={t('profile.organization.max-env-modal.desc')}
          cancelButtonProps={{
            title: t('profile.organization.max-env-modal.close'),
          }}
          onClose={closeMaxEnvModal}
        />
      )}
    </MetaData>
  );
};

export default Environments;

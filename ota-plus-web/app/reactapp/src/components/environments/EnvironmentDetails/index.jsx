import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useObserver } from 'mobx-react';
import { Checkbox, Tooltip } from 'antd';
import { useStores } from '../../../stores/hooks';
import EnvironmentDetailsHeader from '../EnvironmentDetailsHeader';
import EnvironmentMembersList from '../EnvironmentMembersList';
import AddMemberModal from '../modals/AddMemberModal';
import RenameEnvModal from '../modals/RenameEnvModal';
import { WarningModal, ExternalLink } from '../../../partials';
import {
  FeaturesListHeader,
  SplitContainer,
  Sidepanel,
  ContentWrapper,
  FeatureCategoryBlock,
  FeatureBlock
} from './styled';
import { changeUserEnvironment } from '../../../helpers/environmentHelper';
import { sendAction } from '../../../helpers/analyticsHelper';
import {
  OTA_ENVIRONMENT_ADD_MEMBER,
  OTA_ENVIRONMENT_LEAVE_READ_MORE,
  OTA_ENVIRONMENT_RENAME,
  OTA_ENVIRONMENT_SWITCH,
} from '../../../constants/analyticsActions';
import { REMOVAL_MODAL_TYPE, WARNING_MODAL_COLOR } from '../../../constants';
import { UI_FEATURES, isFeatureEnabled, FEATURE_CATEGORIES } from '../../../config';
import { URL_FEATURE_ACCESS_READ_MORE, URL_ENVIRONMENTS_LEAVE } from '../../../constants/urlConstants';

const FEATURE_CATEGORIES_TRANSLATED = {
  [FEATURE_CATEGORIES.ACCESS]: 'profile.organization.feature-category.access',
  [FEATURE_CATEGORIES.CREDENTIALS]: 'profile.organization.feature-category.credentials',
  [FEATURE_CATEGORIES.ENVIRONMENT]: 'profile.organization.feature-category.environment',
  [FEATURE_CATEGORIES.DEVICE]: 'profile.organization.feature-category.device',
  [FEATURE_CATEGORIES.CUSTOM_FIELD]: 'profile.organization.feature-category.custom-field',
  [FEATURE_CATEGORIES.SOFTWARE]: 'profile.organization.feature-category.software',
  [FEATURE_CATEGORIES.UPDATE]: 'profile.organization.feature-category.update',
  [FEATURE_CATEGORIES.CAMPAIGN]: 'profile.organization.feature-category.campaign',
};

function useStoreData() {
  const { stores } = useStores();
  return useObserver(() => ({
    currentEnvironment: stores.userStore.currentOrganization,
    environmentMembers: stores.userStore.userOrganizationUsers,
    currentEnvUIFeatures: stores.userStore.currentEnvUIFeatures,
    currentEnvUIFeaturesCategorized: stores.userStore.currentEnvUIFeaturesCategorized,
    uiFeatures: stores.userStore.uiFeatures,
    user: stores.userStore.user,
  }));
}

const EnvironmentDetails = () => {
  const { t } = useTranslation();
  const { stores } = useStores();
  const {
    currentEnvironment,
    environmentMembers,
    currentEnvUIFeatures,
    currentEnvUIFeaturesCategorized,
    user
  } = useStoreData();
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [renameEnvModalOpen, setRenameEnvModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const [removalModal, setRemovalModal] = useState({
    type: undefined
  });
  const { name, namespace } = currentEnvironment;

  useEffect(() => () => {
    stores.userStore.userOrganizationUsers = [];
    stores.userStore.currentEnvUIFeatures = {};
    stores.userStore.currentEnvUIFeaturesCategorized = {};
    stores.userStore.currentOrganization = {};
    stores.userStore.showEnvDetails = false;
  }, []);

  const toggleAddMemberModal = () => {
    setAddMemberModalOpen(!addMemberModalOpen);
  };

  useEffect(() => {
    if (stores.userStore.environmentsAddMember) {
      stores.userStore.environmentsAddMember = false;
      toggleAddMemberModal();
    }
  }, []);

  useEffect(() => {
    if (environmentMembers.length > 0 && Object.keys(currentEnvironment).length) {
      setSelectedMember(environmentMembers[0]);
      environmentMembers.forEach((member) => {
        stores.userStore.getUIFeatures(currentEnvironment.namespace, member.email, true);
      });
    }
  }, [currentEnvironment, environmentMembers]);

  const handleAddMember = (email) => {
    stores.userStore.addUserToOrganization(email, namespace);
    toggleAddMemberModal();
    sendAction(OTA_ENVIRONMENT_ADD_MEMBER);
  };

  const toggleRenameEnvModal = () => {
    setRenameEnvModalOpen(!renameEnvModalOpen);
  };

  const handleRenameEnvironment = (newName) => {
    stores.userStore.editOrganizationName(newName, namespace);
    toggleRenameEnvModal();
    sendAction(OTA_ENVIRONMENT_RENAME);
  };

  const openRemovalModal = (email) => {
    if (email) {
      setRemovalModal({ type: REMOVAL_MODAL_TYPE.MEMBER_REMOVAL, selectedUserEmail: email });
    } else {
      setRemovalModal({ type: REMOVAL_MODAL_TYPE.SELF_REMOVAL });
    }
  };

  const closeRemovalModal = () => {
    setRemovalModal({ type: undefined });
  };

  const setUserOrganization = (newNamespace) => {
    changeUserEnvironment(newNamespace);
    sendAction(OTA_ENVIRONMENT_SWITCH);
  };

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
  };

  const handleMemberRemoval = (email) => {
    if (user.email === email) {
      stores.userStore.deleteMemberFromOrganization(email, false);
      setUserOrganization(user.profile.defaultNamespace);
    } else {
      stores.userStore.deleteMemberFromOrganization(email, true);
    }
    closeRemovalModal();
  };

  const populateRemovalModal = () => {
    const { type, selectedUserEmail } = removalModal;
    const lastToLeave = environmentMembers.length === 1;
    switch (type) {
      case REMOVAL_MODAL_TYPE.SELF_REMOVAL:
        return {
          type: WARNING_MODAL_COLOR.DANGER,
          title: t('profile.organization.remove-modal.title.self'),
          desc: t(lastToLeave
            ? 'profile.organization.remove-modal.desc.self.last'
            : 'profile.organization.remove-modal.desc.self'),
          readMore: !lastToLeave ? {
            analyticsAction: OTA_ENVIRONMENT_LEAVE_READ_MORE,
            title: t('profile.organization.remove-modal.desc.self.read-more'),
            url: URL_ENVIRONMENTS_LEAVE,
          } : null,
          cancelButtonProps: {
            title: t('profile.organization.remove-modal.cancel'),
          },
          confirmButtonProps: {
            title: t('profile.organization.remove-modal.confirm.self'),
            onClick: () => handleMemberRemoval(user.email),
          },
          onClose: closeRemovalModal,
        };
      default:
        return {
          type: WARNING_MODAL_COLOR.DANGER,
          title: t('profile.organization.remove-modal.title'),
          desc: t('profile.organization.remove-modal.desc'),
          cancelButtonProps: {
            title: t('profile.organization.remove-modal.cancel'),
          },
          confirmButtonProps: {
            title: t('profile.organization.remove-modal.confirm'),
            onClick: () => handleMemberRemoval(selectedUserEmail),
          },
          onClose: closeRemovalModal,
        };
    }
  };

  const toggleFeature = (event, featureId) => {
    if (event.target.checked) {
      stores.userStore.toggleFeatureOn(currentEnvironment.namespace, selectedMember.email, featureId);
    } else {
      stores.userStore.toggleFeatureOff(currentEnvironment.namespace, selectedMember.email, featureId);
    }
  };

  return (
    <div>
      <EnvironmentDetailsHeader
        envInfo={currentEnvironment}
        onAddMemberBtnClick={toggleAddMemberModal}
        onRenameBtnClick={toggleRenameEnvModal}
      />
      <SplitContainer>
        <Sidepanel>
          {environmentMembers.length > 0 && (
            <EnvironmentMembersList
              currentEnvUIFeatures={currentEnvUIFeatures}
              envInfo={currentEnvironment}
              environmentMembers={environmentMembers}
              onRemoveBtnClick={openRemovalModal}
              onListItemClick={handleMemberSelect}
              selectedUserEmail={selectedMember.email}
              user={user}
            />
          )}
        </Sidepanel>
        <ContentWrapper>
          <h2>{t('profile.organization.features.title')}</h2>
          <div>
            <span>{t('profile.organization.features.desc')}</span>
            {' '}
            <ExternalLink weight="regular" id="feature-access-read-more" url={URL_FEATURE_ACCESS_READ_MORE}>
              {t('profile.organization.features.read-more')}
            </ExternalLink>
          </div>
          <FeaturesListHeader>
            <span>
              {t('profile.organization.features.header.feature-category')}
            </span>
            <span>
              {t('profile.organization.features.header.feature-name')}
            </span>
            <span>
              {t('profile.organization.features.header.docs')}
            </span>
          </FeaturesListHeader>
          {selectedMember
            && Object.keys(currentEnvUIFeaturesCategorized).length === environmentMembers.length
            && Object.entries(currentEnvUIFeaturesCategorized[selectedMember.email])
              .map(([categoryId, features]) => (
                <>
                  <FeatureCategoryBlock key={categoryId} id={categoryId}>
                    {t(FEATURE_CATEGORIES_TRANSLATED[categoryId])}
                  </FeatureCategoryBlock>
                  {features.map(feature => (
                    <FeatureBlock key={feature.id} id={feature.id}>
                      <span>{feature.name}</span>
                      <Tooltip title={t(`profile.organization.features.${feature.isAllowed ? 'accessible' : 'restricted'}`)}>
                        <Checkbox
                          disabled={
                            !isFeatureEnabled(
                              currentEnvUIFeatures[user.email],
                              UI_FEATURES.MANAGE_FEATURE_ACCESS
                            )
                            || currentEnvironment.creatorEmail === selectedMember.email
                            || selectedMember.email === user.email
                          }
                          id={`feature-checkbox-${feature.isAllowed}`}
                          onChange={event => toggleFeature(event, feature.id)}
                          checked={feature.isAllowed}
                        />
                      </Tooltip>
                    </FeatureBlock>
                  ))}
                </>
              ))}
        </ContentWrapper>
      </SplitContainer>
      {addMemberModalOpen && (
        <AddMemberModal onClose={toggleAddMemberModal} onConfirm={handleAddMember} />
      )}
      {renameEnvModalOpen && (
        <RenameEnvModal currentName={name} onClose={toggleRenameEnvModal} onConfirm={handleRenameEnvironment} />
      )}
      {removalModal.type && (
        <WarningModal {...populateRemovalModal()} />
      )}
    </div>
  );
};

export default EnvironmentDetails;

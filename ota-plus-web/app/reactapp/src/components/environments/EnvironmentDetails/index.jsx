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
import {
  URL_FEATURE_ACCESS_READ_MORE,
  URL_ENVIRONMENTS_LEAVE,
  URL_FEATURE_ACCESS_MANAGE,
  URL_FEATURE_ACCESS_CREDENTIALS,
  URL_FEATURE_ACCESS_ENVIRONMENT_RENAME,
  URL_FEATURE_ACCESS_ENVIRONMENT_MEMBERS_ADD,
  URL_FEATURE_ACCESS_ENVIRONMENT_MEMBERS_REMOVE,
  URL_FEATURE_ACCESS_DEVICE_GROUPS,
  URL_FEATURE_ACCESS_DEVICE_SET_AUTOMATIC_UPDATES,
  URL_FEATURE_ACCESS_DEVICE_LAUNCH_SINGLE_DEVICE_UPDATES,
  URL_FEATURE_ACCESS_DEVICE_DELETE,
  URL_FEATURE_ACCESS_DEVICE_RENAME,
  URL_FEATURE_ACCESS_CUSTOM_FIELD_CREATE,
  URL_FEATURE_ACCESS_CUSTOM_FIELD_RENAME,
  URL_FEATURE_ACCESS_CUSTOM_FIELD_VALUES_EDIT,
  URL_FEATURE_ACCESS_CUSTOM_FIELD_DELETE,
  URL_FEATURE_ACCESS_SOFTWARE_UPLOAD,
  URL_FEATURE_ACCESS_SOFTWARE_COMMENTS_EDIT,
  URL_FEATURE_ACCESS_SOFTWARE_VERSIONS_DELETE,
  URL_FEATURE_ACCESS_SOFTWARE_DELETE,
  URL_FEATURE_ACCESS_UPDATE_CREATE,
  URL_FEATURE_ACCESS_CAMPAIGN_CREATE,
  URL_FEATURE_ACCESS_CAMPAIGN_CANCEL,
  URL_FEATURE_ACCESS_CAMPAIGN_RETRY
} from '../../../constants/urlConstants';

const FEATURE_CATEGORIES_TRANSLATION_KEYS = {
  [FEATURE_CATEGORIES.ACCESS]: 'profile.organization.feature-category.access',
  [FEATURE_CATEGORIES.CREDENTIALS]: 'profile.organization.feature-category.credentials',
  [FEATURE_CATEGORIES.ENVIRONMENT]: 'profile.organization.feature-category.environment',
  [FEATURE_CATEGORIES.DEVICE]: 'profile.organization.feature-category.device',
  [FEATURE_CATEGORIES.CUSTOM_FIELD]: 'profile.organization.feature-category.custom-field',
  [FEATURE_CATEGORIES.SOFTWARE]: 'profile.organization.feature-category.software',
  [FEATURE_CATEGORIES.UPDATE]: 'profile.organization.feature-category.update',
  [FEATURE_CATEGORIES.CAMPAIGN]: 'profile.organization.feature-category.campaign',
};

const FEATURES_READ_MORE_LINKS = {
  [UI_FEATURES.ACCESS_CREDS]: URL_FEATURE_ACCESS_CREDENTIALS,
  [UI_FEATURES.ADD_MEMBER]: URL_FEATURE_ACCESS_ENVIRONMENT_MEMBERS_ADD,
  [UI_FEATURES.CANCEL_CAMPAIGN]: URL_FEATURE_ACCESS_CAMPAIGN_CANCEL,
  [UI_FEATURES.CREATE_CAMPAIGN]: URL_FEATURE_ACCESS_CAMPAIGN_CREATE,
  [UI_FEATURES.CREATE_DEVICE_GROUP]: URL_FEATURE_ACCESS_DEVICE_GROUPS,
  [UI_FEATURES.CREATE_SOFTWARE_UPDATE]: URL_FEATURE_ACCESS_UPDATE_CREATE,
  [UI_FEATURES.DELETE_CUSTOM_FIELD]: URL_FEATURE_ACCESS_CUSTOM_FIELD_DELETE,
  [UI_FEATURES.DELETE_DEVICE]: URL_FEATURE_ACCESS_DEVICE_DELETE,
  [UI_FEATURES.DELETE_SOFTWARE]: URL_FEATURE_ACCESS_SOFTWARE_DELETE,
  [UI_FEATURES.DELETE_SOFTWARE_VERSION]: URL_FEATURE_ACCESS_SOFTWARE_VERSIONS_DELETE,
  [UI_FEATURES.EDIT_CUSTOM_FIELD_VALUE]: URL_FEATURE_ACCESS_CUSTOM_FIELD_VALUES_EDIT,
  [UI_FEATURES.EDIT_SOFTWARE_COMMENT]: URL_FEATURE_ACCESS_SOFTWARE_COMMENTS_EDIT,
  [UI_FEATURES.LAUNCH_SINGLE_DEVICE_UPDATE]: URL_FEATURE_ACCESS_DEVICE_LAUNCH_SINGLE_DEVICE_UPDATES,
  [UI_FEATURES.MANAGE_FEATURE_ACCESS]: URL_FEATURE_ACCESS_MANAGE,
  [UI_FEATURES.REMOVE_MEMBER]: URL_FEATURE_ACCESS_ENVIRONMENT_MEMBERS_REMOVE,
  [UI_FEATURES.RENAME_CUSTOM_FIELD]: URL_FEATURE_ACCESS_CUSTOM_FIELD_RENAME,
  [UI_FEATURES.RENAME_DEVICE]: URL_FEATURE_ACCESS_DEVICE_RENAME,
  [UI_FEATURES.RENAME_ENV]: URL_FEATURE_ACCESS_ENVIRONMENT_RENAME,
  [UI_FEATURES.RETRY_FAILED_UPDATE]: URL_FEATURE_ACCESS_CAMPAIGN_RETRY,
  [UI_FEATURES.SET_AUTO_UPDATE]: URL_FEATURE_ACCESS_DEVICE_SET_AUTOMATIC_UPDATES,
  [UI_FEATURES.UPLOAD_FILE_CUSTOM_FIELDS]: URL_FEATURE_ACCESS_CUSTOM_FIELD_CREATE,
  [UI_FEATURES.UPLOAD_SOFTWARE]: URL_FEATURE_ACCESS_SOFTWARE_UPLOAD,
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
                <div key={categoryId}>
                  <FeatureCategoryBlock id={categoryId}>
                    {t(FEATURE_CATEGORIES_TRANSLATION_KEYS[categoryId])}
                  </FeatureCategoryBlock>
                  {features.map(feature => (
                    <FeatureBlock key={feature.id} id={feature.id}>
                      <span />
                      <span>{feature.name}</span>
                      <span>
                        <ExternalLink
                          weight="regular"
                          id={`${feature.id}-read-more`}
                          url={FEATURES_READ_MORE_LINKS[feature.id]}
                        >
                          {t('profile.organization.features.read-more')}
                        </ExternalLink>
                      </span>
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
                </div>
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

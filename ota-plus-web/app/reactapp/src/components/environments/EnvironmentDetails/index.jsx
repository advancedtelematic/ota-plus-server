import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useObserver } from 'mobx-react';
import { Tabs } from 'antd';
import { useStores } from '../../../stores/hooks';
import EnvironmentDetailsHeader from '../EnvironmentDetailsHeader';
import EnvironmentMembersList from '../EnvironmentMembersList';
import AddMemberModal from '../modals/AddMemberModal';
import RenameEnvModal from '../modals/RenameEnvModal';
import WarningModal from '../modals/WarningModal';
import { StyledTabs } from './styled';
import { changeUserEnvironment } from '../../../helpers/environmentHelper';
import { sendAction } from '../../../helpers/analyticsHelper';
import {
  OTA_ENVIRONMENT_ADD_MEMBER,
  OTA_ENVIRONMENT_RENAME,
  OTA_ENVIRONMENT_SWITCH,
} from '../../../constants/analyticsActions';
import { REMOVAL_MODAL_TYPE, WARNING_MODAL_COLOR } from '../../../constants';

const MEMBERS_TAB_KEY = '1';

function useStoreData() {
  const { stores } = useStores();
  return useObserver(() => ({
    currentEnvironment: stores.userStore.currentOrganization,
    environmentMembers: stores.userStore.userOrganizationUsers,
    user: stores.userStore.user,
  }));
}

const EnvironmentDetails = () => {
  const { t } = useTranslation();
  const { stores } = useStores();
  const { currentEnvironment, environmentMembers, user } = useStoreData();
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [renameEnvModalOpen, setRenameEnvModalOpen] = useState(false);
  const [removalModal, setRemovalModal] = useState({
    type: undefined
  });
  const { name, namespace } = currentEnvironment;

  useEffect(() => () => {
    stores.userStore.userOrganizationUsers = [];
    stores.userStore.currentOrganization = {};
    stores.userStore.showEnvDetails = false;
  }, []);

  const toggleAddMemberModal = () => {
    setAddMemberModalOpen(!addMemberModalOpen);
  };

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
          type: lastToLeave ? WARNING_MODAL_COLOR.DANGER : WARNING_MODAL_COLOR.DEFAULT,
          title: t('profile.organization.remove-modal.title.self'),
          desc: t(lastToLeave
            ? 'profile.organization.remove-modal.desc.self.last'
            : 'profile.organization.remove-modal.desc.self'),
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

  return (
    <div>
      <EnvironmentDetailsHeader
        envInfo={currentEnvironment}
        onAddMemberBtnClick={toggleAddMemberModal}
        onRenameBtnClick={toggleRenameEnvModal}
      />
      <StyledTabs defaultActiveKey={MEMBERS_TAB_KEY} animated={false}>
        <Tabs.TabPane key={MEMBERS_TAB_KEY} tab={t('profile.organization.members')}>
          {environmentMembers.length > 0 && (
            <EnvironmentMembersList
              envInfo={currentEnvironment}
              environmentMembers={environmentMembers}
              onRemoveBtnClick={openRemovalModal}
              user={user}
            />
          )}
        </Tabs.TabPane>
      </StyledTabs>
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

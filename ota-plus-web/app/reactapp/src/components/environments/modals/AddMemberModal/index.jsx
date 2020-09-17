import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useObserver } from 'mobx-react';
import PropTypes from 'prop-types';
import isEmail from 'validator/lib/isEmail';
import SingleInputModal from '../SingleInputModal';
import { URL_ENVIRONMENTS_READ_MORE } from '../../../../constants/urlConstants';
import { OTA_ENVIRONMENT_CREATE_ENV_READ_MORE } from '../../../../constants/analyticsActions';
import { useStores } from '../../../../stores/hooks';

function useStoreData() {
  const { stores } = useStores();
  return useObserver(() => ({
    currentEnvironment: stores.userStore.currentOrganization,
    userEnvironmentNamespace: stores.userStore.userOrganizationNamespace
  }));
}

const AddMemberModal = ({ onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const { currentEnvironment, userEnvironmentNamespace } = useStoreData();

  const onInputChange = (event) => {
    setMemberEmail(event.target.value);
    if (isEmail(event.target.value)) {
      setError(false);
    } else {
      setError(true);
    }
  };

  let readMore;
  if (currentEnvironment.isInitial && currentEnvironment.namespace === userEnvironmentNamespace) {
    readMore = {
      analyticsAction: OTA_ENVIRONMENT_CREATE_ENV_READ_MORE,
      description: t('profile.organization.add-member-modal.owner-warning-description'),
      linkText: t('profile.organization.add-member-modal.owner-warning-read-more'),
      url: URL_ENVIRONMENTS_READ_MORE
    };
  }

  return (
    <SingleInputModal
      confirmActionName={t('profile.organization.add-member-modal.add')}
      height={readMore ? '400px' : undefined}
      error={error}
      errorMsg={t('profile.organization.add-member-modal.error-msg')}
      id="add-member-modal"
      inputLabel={t('profile.organization.add-member-modal.input-label')}
      onClose={onClose}
      onChange={onInputChange}
      onConfirm={() => onConfirm(memberEmail)}
      placeholder={t('profile.organization.add-member-modal.placeholder')}
      readMore={readMore}
      title={t('profile.organization.add-member-modal.title')}
      value={memberEmail}
    />
  );
};

AddMemberModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default AddMemberModal;

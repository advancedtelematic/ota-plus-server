import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import isEmail from 'validator/lib/isEmail';
import SingleInputModal from '../SingleInputModal';

const AddMemberModal = ({ onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');

  const onInputChange = (event) => {
    setMemberEmail(event.target.value);
    if (isEmail(event.target.value)) {
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <SingleInputModal
      confirmActionName={t('profile.organization.add-member-modal.add')}
      error={error}
      errorMsg={t('profile.organization.add-member-modal.error-msg')}
      id="add-member-modal"
      inputLabel={t('profile.organization.add-member-modal.input-label')}
      onClose={onClose}
      onChange={onInputChange}
      onConfirm={() => onConfirm(memberEmail)}
      placeholder={t('profile.organization.add-member-modal.placeholder')}
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

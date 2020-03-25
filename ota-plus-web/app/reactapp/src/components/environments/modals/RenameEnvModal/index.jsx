import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import SingleInputModal from '../SingleInputModal';
import { ENVIRONMENT_NAME_REGEX } from '../../../../constants/regexPatterns';

const MAX_ENV_LENGTH = 30;
const noError = { isError: false, msg: '' };

const RenameEnvModal = ({ currentName, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [error, setError] = useState(false);
  const [environmentName, setEnvironmentName] = useState(currentName);

  const onInputChange = (event) => {
    setEnvironmentName(event.target.value);
    if (event.target.value.length > MAX_ENV_LENGTH) {
      setError({
        isError: true,
        msg: t('profile.organization.create-modal.input-error2')
      });
    } else if (ENVIRONMENT_NAME_REGEX.test(event.target.value)) {
      setError(noError);
    } else {
      setError({
        isError: true,
        msg: t('profile.organization.create-modal.input-error1')
      });
    }
  };

  return (
    <SingleInputModal
      confirmActionName={t('profile.organization.rename-modal.confirm')}
      error={error.isError}
      errorMsg={error.msg}
      id="rename-env-modal"
      inputLabel={t('profile.organization.rename-modal.input-label')}
      onClose={onClose}
      onChange={onInputChange}
      onConfirm={() => onConfirm(environmentName)}
      title={t('profile.organization.rename-modal.title')}
      value={environmentName}
    />
  );
};

RenameEnvModal.propTypes = {
  currentName: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default RenameEnvModal;

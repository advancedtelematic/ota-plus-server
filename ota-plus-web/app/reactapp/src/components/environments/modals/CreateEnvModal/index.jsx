import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  BackgroundMask,
  ButtonsWrapper,
  CloseIcon,
  ErrorMsg,
  Input,
  InputLabel,
  ModalContainer,
  StyledButton,
  Title
} from '../sharedStyled';
import { Subtitle } from './styled';
import { CLOSE_MODAL_ICON } from '../../../../config';
import { ENVIRONMENT_NAME_REGEX } from '../../../../constants/regexPatterns';

const MAX_ENV_LENGTH = 30;
const noError = { isError: false, msg: '' };

const CreateEnvModal = ({ onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [error, setError] = useState(noError);
  const [environmentName, setEnvironmentName] = useState('');

  const onInputChange = (event) => {
    const value = event.target.value.trim();
    if (value.length > MAX_ENV_LENGTH) {
      setError({
        isError: true,
        msg: t('profile.organization.create-modal.input-error2')
      });
    } else if (ENVIRONMENT_NAME_REGEX.test(value)) {
      setEnvironmentName(value);
      setError(noError);
    } else {
      setError({
        isError: true,
        msg: t('profile.organization.create-modal.input-error1')
      });
    }
  };

  return (
    <>
      <BackgroundMask onClick={onClose} />
      <ModalContainer id="create-env-modal">
        <CloseIcon src={CLOSE_MODAL_ICON} onClick={onClose} />
        <Title>{t('profile.organization.create-env')}</Title>
        <Subtitle>{t('profile.organization.create-modal.subtitle')}</Subtitle>
        <InputLabel error={error.isError}>{t('profile.organization.create-modal.input-label')}</InputLabel>
        <Input
          id="name-input"
          withError={error.isError}
          placeholder={t('profile.organization.create-modal.input-placeholder')}
          onChange={onInputChange}
        />
        {error.isError && (
          <ErrorMsg id="error-msg">
            {error.msg}
          </ErrorMsg>
        )}
        <ButtonsWrapper>
          <StyledButton id="cancel-btn" light="true" onClick={onClose}>
            {t('profile.organization.create-modal.cancel')}
          </StyledButton>
          <StyledButton
            id="create-btn"
            type="primary"
            light="true"
            disabled={!environmentName || error.isError}
            onClick={() => onConfirm(environmentName)}
          >
            {t('profile.organization.create-modal.create')}
          </StyledButton>
        </ButtonsWrapper>
      </ModalContainer>
    </>
  );
};

CreateEnvModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default CreateEnvModal;

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  BackgroundMask,
  ButtonsWrapper,
  CloseIcon,
  ErrorMsg,
  Input,
  InputLabel,
  StyledButton,
} from '../sharedStyled';
import { ModalContainer, Title } from './styled';
import { CLOSE_MODAL_ICON } from '../../../../config';

const SingleInputModal = ({
  confirmActionName,
  error,
  errorMsg,
  id,
  inputLabel,
  onClose,
  onChange,
  onConfirm,
  placeholder,
  title,
  value
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    document.getElementsByClassName('ant-input')[0].focus();
  }, []);

  return (
    <>
      <BackgroundMask onClick={onClose} />
      <ModalContainer id={id}>
        <CloseIcon src={CLOSE_MODAL_ICON} onClick={onClose} />
        <Title>{title}</Title>
        <InputLabel error={error}>{inputLabel}</InputLabel>
        <Input
          value={value}
          withError={error}
          placeholder={placeholder}
          onChange={onChange}
        />
        {error && (
          <ErrorMsg id="error-msg">
            {errorMsg}
          </ErrorMsg>
        )}
        <ButtonsWrapper>
          <StyledButton id="cancel-btn" light="true" onClick={onClose}>
            {t('profile.organization.create-modal.cancel')}
          </StyledButton>
          <StyledButton
            id="confirm-btn"
            type="primary"
            light="true"
            disabled={error || !value}
            onClick={onConfirm}
          >
            {confirmActionName}
          </StyledButton>
        </ButtonsWrapper>
      </ModalContainer>
    </>
  );
};

SingleInputModal.propTypes = {
  confirmActionName: PropTypes.string,
  error: PropTypes.bool,
  errorMsg: PropTypes.string,
  id: PropTypes.string,
  inputLabel: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  placeholder: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string,
};

export default SingleInputModal;

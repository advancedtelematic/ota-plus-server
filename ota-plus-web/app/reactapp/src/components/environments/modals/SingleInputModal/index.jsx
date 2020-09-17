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
import { Description, ModalContainer, Title } from './styled';
import { CLOSE_MODAL_ICON } from '../../../../config';
import ExternalLink from '../../../../partials/ExternalLink';
import { sendAction } from '../../../../helpers/analyticsHelper';

const SingleInputModal = ({
  confirmActionName,
  height,
  error,
  errorMsg,
  id,
  inputLabel,
  onClose,
  onChange,
  onConfirm,
  placeholder,
  readMore,
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
      <ModalContainer id={id} height={height}>
        <CloseIcon src={CLOSE_MODAL_ICON} onClick={onClose} />
        <Title>{title}</Title>
        {readMore && (
          <Description id="single-input-modal-read-more-description">
            {readMore.description}
            {' '}
            <ExternalLink
              id="single-input-modal-read-more-link"
              key="single-input-modal-read-more-link"
              onClick={() => sendAction(readMore.analyticsAction)}
              url={readMore.url}
              weight="regular"
            >
              {readMore.linkText}
            </ExternalLink>
          </Description>
        )}
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
  height: PropTypes.string,
  error: PropTypes.bool,
  errorMsg: PropTypes.string,
  id: PropTypes.string,
  inputLabel: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  placeholder: PropTypes.string,
  readMore: PropTypes.shape({}),
  title: PropTypes.string,
  value: PropTypes.string,
};

export default SingleInputModal;

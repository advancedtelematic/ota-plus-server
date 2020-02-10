import React from 'react';
import PropTypes from 'prop-types';
import {
  BackgroundMask,
  ButtonsWrapper,
  CancelButton,
  ConfirmButton,
  Description,
  ModalContainer,
  Title,
  TopBar
} from './styled';
import { WARNING_MODAL_TYPE } from '../../../constants';

const WarningModal = ({ type, title, desc, cancelButtonProps, confirmButtonProps, onClose }) => (
  <>
    <BackgroundMask onClick={onClose} />
    <ModalContainer>
      <TopBar colorTheme={type} />
      <Title>{title}</Title>
      <Description>{desc}</Description>
      <ButtonsWrapper>
        <CancelButton id="cancel-remove-btn" colorTheme={type} onClick={onClose}>
          {cancelButtonProps.title}
        </CancelButton>
        <ConfirmButton id="confirm-remove-btn" colorTheme={type} onClick={confirmButtonProps.onClick}>
          {confirmButtonProps.title}
        </ConfirmButton>
      </ButtonsWrapper>
    </ModalContainer>
  </>
);

WarningModal.propTypes = {
  type: PropTypes.oneOf([WARNING_MODAL_TYPE.DANGER, WARNING_MODAL_TYPE.DEFAULT]),
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  cancelButtonProps: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  confirmButtonProps: PropTypes.shape({
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  }),
  onClose: PropTypes.func.isRequired
};

export default WarningModal;

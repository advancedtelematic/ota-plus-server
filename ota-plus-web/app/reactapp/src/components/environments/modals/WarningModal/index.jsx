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
import { WARNING_MODAL_COLOR } from '../../../../constants';

const WarningModal = ({ type, title, desc, cancelButtonProps, confirmButtonProps, onClose }) => (
  <>
    <BackgroundMask onClick={onClose} />
    <ModalContainer id="warning-modal">
      <TopBar colorTheme={type} />
      <Title>{title}</Title>
      <Description>{desc}</Description>
      <ButtonsWrapper>
        <CancelButton id="cancel-btn" colorTheme={type} onClick={onClose}>
          {cancelButtonProps.title}
        </CancelButton>
        {confirmButtonProps && (
          <ConfirmButton id="confirm-btn" colorTheme={type} onClick={confirmButtonProps.onClick}>
            {confirmButtonProps.title}
          </ConfirmButton>
        )}
      </ButtonsWrapper>
    </ModalContainer>
  </>
);

WarningModal.propTypes = {
  type: PropTypes.oneOf([WARNING_MODAL_COLOR.DANGER, WARNING_MODAL_COLOR.DEFAULT, WARNING_MODAL_COLOR.INFO]),
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

import React from 'react';
import PropTypes from 'prop-types';
import {
  CROSS_ICON_WHITE,
  SOFTWARE_ICON_UPLOADING_STATUS_ERROR,
  SOFTWARE_ICON_UPLOADING_STATUS_SUCCESS
} from '../../config';
import {
  CloseIconContainer,
  Container,
  Icon,
  Text
} from './styled';
import { INFO_STATUS_BAR_TYPE } from '../../constants';

export const InfoStatusBar = ({ onClose, text, type }) => (
  <Container id="info-status-bar-container" type={type}>
    <Icon
      id="info-status-bar-icon"
      src={type === INFO_STATUS_BAR_TYPE.SUCCESS
        ? SOFTWARE_ICON_UPLOADING_STATUS_SUCCESS : SOFTWARE_ICON_UPLOADING_STATUS_ERROR}
      type={type}
    />
    <Text id="info-status-bar-text" type={type}>{text}</Text>
    { onClose && (
      <CloseIconContainer>
        <Icon
          id="info-status-bar-icon-close"
          onClick={onClose}
          src={CROSS_ICON_WHITE}
        />
      </CloseIconContainer>
    )}
  </Container>
);

InfoStatusBar.propTypes = {
  onClose: PropTypes.func,
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf([INFO_STATUS_BAR_TYPE.ERROR, INFO_STATUS_BAR_TYPE.SUCCESS]),
};

export default InfoStatusBar;

import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip } from 'antd';
import { Container, Icon, Title, Value } from './styled';
import { sendAction } from '../../helpers/analyticsHelper';
import { copyToClipboard } from '../../helpers/clipboardHelper';
import { OTA_DEVICE_ID_COPY_TO_CLIPBOARD } from '../../constants/analyticsActions';

const CopyableValue = ({ title, value }) => (
  <Container id="copyable-value-container">
    <Tooltip title={value}>
      {title && (
        <Title id="copyable-value-title">
          {title}
        </Title>
      )}
      <Value id="copyable-value-value">
        {value}
      </Value>
      <Icon
        id="copyable-value-icon"
        onClick={() => {
          copyToClipboard(value);
          sendAction(OTA_DEVICE_ID_COPY_TO_CLIPBOARD);
        }}
      />
    </Tooltip>
  </Container>
);

CopyableValue.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
};

export default CopyableValue;

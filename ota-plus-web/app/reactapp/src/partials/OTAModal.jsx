/** @format */

import PropTypes from 'prop-types';
import React from 'react';

import { Modal } from 'antd';

const OTAModal = ({
  title,
  topActions,
  content,
  visible,
  className,
  titleClassName,
  hideOnClickOutside,
  onRequestClose,
  width
}) => (
  <Modal
    title={(
      <div className={`heading${titleClassName || ''}`}>
        <div className="heading__inner">{title}</div>
        {topActions}
      </div>
    )}
    className={`dialog ${className || ''}`}
    closable={false} /* disable default close button to allow custom topActions */
    visible={visible}
    width={width}
    onRequestClose={onRequestClose}
    maskClosable={hideOnClickOutside}
    mask
    keyboard
    content={content}
    footer={null}
    centered
  >
    {content}
  </Modal>
);

OTAModal.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ]),
  topActions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string
  ]),
  content: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string
  ]),
  visible: PropTypes.bool,
  className: PropTypes.string,
  titleClassName: PropTypes.string,
  hideOnClickOutside: PropTypes.bool,
  onRequestClose: PropTypes.func,
  width: PropTypes.string,
};

OTAModal.defaultProps = {
  visible: false,
  hideOnClickOutside: true,
  width: '50vw',
  onRequestClose: () => {},
};

export default OTAModal;

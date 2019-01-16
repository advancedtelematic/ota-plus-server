/** @format */

import PropTypes from 'prop-types';
import React from 'react';

import { Modal } from 'antd';

const OTAModal = ({ title, topActions, content, actions, visible, className, titleClassName, hideOnClickOutside, onRequestClose, width }) => (
  <Modal
    title={
      <div className={`heading${titleClassName || ''}`}>
        <div className='heading__inner'>{title}</div>
        {topActions}
      </div>
    }
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
  title: PropTypes.any,
  topActions: PropTypes.any,
  content: PropTypes.any.isRequired,
  actions: PropTypes.array,
  visible: PropTypes.bool,
  className: PropTypes.string,
  titleClassName: PropTypes.string,
  hideOnClickOutside: PropTypes.bool,
  onRequestClose: PropTypes.func,
  width: PropTypes.string,
};

OTAModal.defaultProps = {
  actions: [],
  visible: false,
  hideOnClickOutside: true,
  width: '50vw',
  onRequestClose: () => {},
};

export default OTAModal;

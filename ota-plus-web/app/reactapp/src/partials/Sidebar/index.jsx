import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';
import { SIZES } from '../../constants/styleConstants';

const Sidebar = ({ children, onClose, visible }) => (
  <Drawer
    width={SIZES.SIDEBAR_WIDTH}
    maskStyle={{
      backgroundColor: 'transparent',
      top: `-${SIZES.NAVBAR_HEIGHT}`,
    }}
    style={{
      top: SIZES.NAVBAR_HEIGHT,
      maxHeight: `calc(100% - ${SIZES.NAVBAR_HEIGHT})`
    }}
    bodyStyle={{
      padding: 0
    }}
    closable={false}
    onClose={onClose}
    visible={visible}
  >
    {children}
  </Drawer>
);

Sidebar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired
};

export default Sidebar;

import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';
import { SIZES } from '../../constants/styleConstants';

const NAVBARS_HEIGHT = SIZES.NAVBAR_HEIGHT + SIZES.SUBNAVBAR_HEIGHT;

const Sidebar = ({ children, onClose, visible }) => (
  <Drawer
    width={`${SIZES.SIDEBAR_WIDTH}px`}
    maskStyle={{
      backgroundColor: 'transparent',
      top: `-${NAVBARS_HEIGHT}px`,
    }}
    style={{
      top: `${NAVBARS_HEIGHT}px`,
      maxHeight: `calc(100% - ${NAVBARS_HEIGHT}px)`
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

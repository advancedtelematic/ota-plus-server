/** @format */

import PropTypes from 'prop-types';
import React from 'react';

const Header = ({ showCreateGroupModal }) => {
  return (
    <div className='groups-panel__header'>
      <div className='groups-panel__title'>Groups</div>
      <a href='#' className='ant-btn ant-btn--sm ant-btn-outlined' id='add-new-group' onClick={showCreateGroupModal}>
        <span>Add group</span>
      </a>
    </div>
  );
};

Header.propTypes = {
  showCreateGroupModal: PropTypes.func.isRequired,
};

export default Header;

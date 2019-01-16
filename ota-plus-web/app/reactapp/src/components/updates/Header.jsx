/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { SubHeader } from '../../partials';

@observer
class Header extends Component {
  render() {
    const { showCreateModal } = this.props;
    return (
      <SubHeader className='update-subheader'>
        <div className='update-subheader__item'>Title</div>
        <div className='update-subheader__item'>Internal description</div>
        <a href='#' className='add-button grey-button' id='add-new-update' onClick={showCreateModal}>
          <span>+</span>
          <span>Create new update</span>
        </a>
      </SubHeader>
    );
  }
}

Header.propTypes = {
  showCreateModal: PropTypes.func.isRequired,
};

export default Header;

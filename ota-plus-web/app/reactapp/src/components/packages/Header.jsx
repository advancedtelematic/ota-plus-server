/** @format */

import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { SubHeader } from '../../partials';

@observer
class Header extends Component {
  render() {
    const { showCreateModal } = this.props;
    return (
      <SubHeader>
        <a href='#' className='add-button grey-button' id='add-new-package' onClick={showCreateModal.bind(this, null)}>
          <span>+</span>
          <span>Add package</span>
        </a>
      </SubHeader>
    );
  }
}

Header.propTypes = {
  showCreateModal: PropTypes.func.isRequired,
};

export default Header;

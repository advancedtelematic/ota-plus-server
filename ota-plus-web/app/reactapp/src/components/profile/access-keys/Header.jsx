/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { SubHeader, SearchBar } from '../../../partials';
import { Form } from 'formsy-antd';

@observer
class Header extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { showCreateModal, provisioningFilter, changeFilter } = this.props;
    return (
      <SubHeader>
        <Form>
          <SearchBar value={provisioningFilter} changeAction={changeFilter} id='search-keys-input' additionalClassName={'white'} />
        </Form>
        <a href='#' className='add-button light' id='add-new-key' onClick={showCreateModal.bind(this)}>
          <span>+</span>
          <span>Add key</span>
        </a>
      </SubHeader>
    );
  }
}

Header.propTypes = {
  showCreateModal: PropTypes.func.isRequired,
};

export default Header;

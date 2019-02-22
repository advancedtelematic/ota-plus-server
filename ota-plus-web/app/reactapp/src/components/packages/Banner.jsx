/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button } from 'antd';

@observer
class Banner extends Component {
  createNewPackage = e => {
    const { showCreateModal } = this.props;
    e.preventDefault();
    showCreateModal();
  };

  render() {
    return (
      <div className='banner banner-dark'>
        <Button htmlType='button' className='ant-btn-hero' id='add-new-package' onClick={this.createNewPackage}>
          {'Create package'}
        </Button>
      </div>
    );
  }
}

Banner.propTypes = {
  showCreateModal: PropTypes.func.isRequired,
};

export default Banner;

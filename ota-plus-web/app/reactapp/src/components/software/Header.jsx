/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button } from 'antd';

@observer
class Header extends Component {
  render() {
    const { showCreateModal } = this.props;
    return (
      <div className="tab-navigation">
        <div className="tab-navigation__buttons">
          <Button
            htmlType="button"
            className="ant-btn ant-btn-hero"
            id="add-new-software"
            onClick={() => {
              showCreateModal(null);
            }}
          >
            {'Add software'}
          </Button>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  showCreateModal: PropTypes.func.isRequired,
};

export default Header;

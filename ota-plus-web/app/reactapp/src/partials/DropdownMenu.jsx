/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';

import { Dropdown, Menu } from 'antd';
import { observable } from 'mobx';

@observer
class DropdownMenu extends React.Component {
  @observable visible = false;

  static propTypes = {
    children: PropTypes.object,
    customStyles: PropTypes.object,
    customClassName: PropTypes.string,
    placement: PropTypes.string,
  };

  render() {
    const { children, placement, customStyles, customClassName } = this.props;
    const menu = <Menu>{children}</Menu>;
    return (
      <Dropdown overlay={menu} trigger={['click']} placement={placement} overlayStyle={customStyles} overlayClassName={customClassName}>
        <span className='dots' id='campaign-menu'>
          <span />
          <span />
          <span />
        </span>
      </Dropdown>
    );
  }
}

export default DropdownMenu;

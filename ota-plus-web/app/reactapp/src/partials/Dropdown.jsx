/** @format */

import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import enhanceWithClickOutside from 'react-click-outside';

@observer
class Dropdown extends React.Component {
  constructor() {
    super();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  handleClickOutside() {
    this.props.hideSubmenu();
  }
  render() {
    const { children, customStyles, customClassName } = this.props;
    return (
      <ul className={'submenu ' + (customClassName ? customClassName : '')} style={customStyles}>
        {children}
      </ul>
    );
  }
}

export default enhanceWithClickOutside(Dropdown);

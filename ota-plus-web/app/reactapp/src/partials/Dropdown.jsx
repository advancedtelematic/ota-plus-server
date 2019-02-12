/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import enhanceWithClickOutside from 'react-click-outside';

@observer
class Dropdown extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    customStyles: PropTypes.object,
    customClassName: PropTypes.string,
  };

  handleClickOutside = () => {
    this.props.hideSubmenu();
  };

  render() {
    const { children, customStyles, customClassName } = this.props;
    return (
      <ul className={`submenu ${customClassName || ''}`} style={customStyles}>
        {children}
      </ul>
    );
  }
}

export default enhanceWithClickOutside(Dropdown);

/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import enhanceWithClickOutside from 'react-click-outside';

@observer
class Dropdown extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.array
    ]),
    customStyles: PropTypes.shape({}),
    customClassName: PropTypes.string,
    hideSubmenu: PropTypes.func
  };

  handleClickOutside = () => {
    const { hideSubmenu } = this.props;
    hideSubmenu();
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

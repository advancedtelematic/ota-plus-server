/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class LinkWrapper extends Component {
  handleClick = (e) => {
    e.preventDefault();
    const { onClick } = this.props;
    onClick(e);
  };

  render() {
    const { children, id } = this.props;
    return (
      <a href="#" onClick={this.handleClick} id={id}>
        {children}
      </a>
    );
  }
}

LinkWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string
  ]),
  id: PropTypes.string,
  onClick: PropTypes.func
};

export default LinkWrapper;

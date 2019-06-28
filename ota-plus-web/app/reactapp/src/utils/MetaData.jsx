/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { APP_TITLE } from '../config';

class MetaData extends Component {
  componentDidMount() {
    const { title, keywords, description } = this.props;
    document.title = `${APP_TITLE} - ${title}`;
    if (keywords) document.querySelector('meta[name="keywords"]').setAttribute('content', keywords);
    if (description) document.querySelector('meta[name="description"]').setAttribute('content', description);
  }

  render() {
    const { className, children } = this.props;
    return <span className={`content${className ? ` ${className}` : ''}`}>{children}</span>;
  }
}

MetaData.propTypes = {
  title: PropTypes.string.isRequired,
  keywords: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string
  ])
};

export default MetaData;

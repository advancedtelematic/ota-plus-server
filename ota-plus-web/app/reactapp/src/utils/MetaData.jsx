/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { APP_TITLE } from '../config';

class MetaData extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    document.title = APP_TITLE + ' - ' + this.props.title;
    if (this.props.keywords) document.querySelector('meta[name="keywords"]').setAttribute('content', this.props.keywords);
    if (this.props.description) document.querySelector('meta[name="description"]').setAttribute('content', this.props.description);
  }
  render() {
    return <span className={'content' + (this.props.className ? ' ' + this.props.className : '')}>{this.props.children}</span>;
  }
}

MetaData.propTypes = {
  title: PropTypes.string.isRequired,
  keywords: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string,
};

export default MetaData;

/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import Img from 'react-image';

@observer
class Image extends Component {
  render() {
    const { id, src, wrap, className } = this.props;
    const image = <Img className={`image-responsive ${className}`} id={id} src={src} />;
    const renderContainer = !_.isUndefined(wrap);

    return renderContainer ? <div className={wrap}>{image}</div> : image;
  }
}

Image.propTypes = {
  wrap: PropTypes.string,
  className: PropTypes.string,
  src: PropTypes.string,
  id: PropTypes.string,
};

export default Image;

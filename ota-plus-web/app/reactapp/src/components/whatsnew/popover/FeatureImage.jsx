/** @format */

import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { Image } from '../../../partials/media/index';

@observer
class FeatureImage extends Component {
  render() {
    const { popoverImage } = this.props.feature;
    return <Image src={popoverImage.src} className={''} />;
  }
}

FeatureImage.propTypes = {
  feature: PropTypes.object.isRequired,
};

export default FeatureImage;

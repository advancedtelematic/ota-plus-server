/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { WhatsNewGuide } from './popover';

@inject('stores')
@observer
class WhatsNew extends Component {
  @observable features = {};

  componentWillMount() {
    const { stores } = this.props;
    const { featuresStore } = stores;
    this.features = featuresStore.whatsNew;
  }

  render() {
    const currentVersion = _.last(Object.keys(this.features));
    const currentFeatures = this.features[currentVersion];
    const { triggerEl, hide, changeRoute } = this.props;
    return <WhatsNewGuide features={currentFeatures} trigger={triggerEl} hide={hide} changeRoute={changeRoute} />;
  }
}

WhatsNew.propTypes = {
  stores: PropTypes.object,
  triggerEl: PropTypes.object,
  hide: PropTypes.func.isRequired,
  changeRoute: PropTypes.func,
};

export default WhatsNew;

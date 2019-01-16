/** @format */

import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { WhatsNew } from './popover/index';
import _ from 'underscore';

@inject('stores')
@observer
class Popover extends Component {
  @observable features = {};

  componentWillMount() {
    const { featuresStore } = this.props.stores;
    this.features = featuresStore.whatsNew;
  }

  render() {
    const currentVersion = _.last(Object.keys(this.features));
    const currentFeatures = this.features[currentVersion];
    const { triggerEl, hide, changeRoute } = this.props;
    return <WhatsNew features={currentFeatures} trigger={triggerEl} hide={hide} changeRoute={changeRoute} />;
  }
}

Popover.propTypes = {
  stores: PropTypes.object,
  triggerEl: PropTypes.object,
  hide: PropTypes.func.isRequired,
  changeRoute: PropTypes.func,
};

export default Popover;

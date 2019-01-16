/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { WhatsNewHeader, WhatsNewList } from '../components/whatsnew';

@inject('stores')
@observer
class WhatsNew extends Component {
  static propTypes = {
    stores: PropTypes.object,
  };

  componentWillMount() {
    const { featuresStore } = this.props.stores;
    this.features = featuresStore.whatsNew;
  }

  render() {
    return (
      <span>
        <WhatsNewHeader />
        <WhatsNewList data={this.features} />
      </span>
    );
  }
}

export default WhatsNew;

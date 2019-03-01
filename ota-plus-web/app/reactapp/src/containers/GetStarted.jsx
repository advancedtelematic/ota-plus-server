/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { GetStartedHeader, GetStartedList } from '../components/getstarted';

@inject('stores')
@observer
class GetStarted extends Component {
  static propTypes = {
    stores: PropTypes.object,
  };

  componentWillMount() {
    const { featuresStore } = this.props.stores;
    this.features = featuresStore.getStarted;
  }

  render() {
    return (
      <span>
        <GetStartedHeader />
        <GetStartedList data={this.features} />
      </span>
    );
  }
}

export default GetStarted;

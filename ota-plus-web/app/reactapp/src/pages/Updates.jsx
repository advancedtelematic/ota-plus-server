/** @format */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import { MetaData, FadeAnimation } from '../utils';
import { UpdatesContainer } from '../containers';

const title = 'Updates';

@inject('stores')
@observer
class Updates extends Component {
  static propTypes = {
    stores: PropTypes.object,
  };

  componentWillMount() {
    const { stores } = this.props;
    const { updatesStore, softwareStore } = stores;
    updatesStore.fetchUpdates();
    softwareStore.fetchPackages();
  }

  componentWillUnmount() {
    const { stores } = this.props;
    const { updatesStore } = stores;
    updatesStore._reset();
  }

  render() {
    return (
      <FadeAnimation>
        <MetaData title={title}>
          <UpdatesContainer />
        </MetaData>
      </FadeAnimation>
    );
  }
}

export default Updates;

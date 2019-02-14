/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { PackagesContainer } from '../containers';

const title = 'Packages';

@inject('stores')
@observer
class Packages extends Component {
  static propTypes = {
    stores: PropTypes.object.isRequired,
    match: PropTypes.object,
  };

  componentDidMount() {
    const { stores } = this.props;
    const { packagesStore } = stores;
    packagesStore.page = 'packages';
    packagesStore.fetchPackages();
  }

  componentWillUnmount() {
    const { stores } = this.props;
    const { packagesStore } = stores;
    packagesStore._reset();
  }

  render() {
    const { match } = this.props;
    const { params } = match;
    return (
      <FadeAnimation>
        <MetaData title={title}>
          <PackagesContainer highlightedPackage={params.packageName} />
        </MetaData>
      </FadeAnimation>
    );
  }
}

export default Packages;

/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { SoftwareContainer } from '../containers';

const title = 'Software Repository';

@inject('stores')
@observer
class SoftwareRepository extends Component {
  static propTypes = {
    stores: PropTypes.shape({}).isRequired,
    match: PropTypes.shape({}),
  };

  componentDidMount() {
    const { stores } = this.props;
    const { softwareStore } = stores;
    softwareStore.page = 'packages';
    softwareStore.fetchPackages();
  }

  componentWillUnmount() {
    const { stores } = this.props;
    const { softwareStore } = stores;
    softwareStore.reset();
  }

  render() {
    const { match } = this.props;
    const { params } = match;
    return (
      <FadeAnimation>
        <MetaData title={title}>
          <SoftwareContainer highlightedPackage={params.packageName} />
        </MetaData>
      </FadeAnimation>
    );
  }
}

export default SoftwareRepository;

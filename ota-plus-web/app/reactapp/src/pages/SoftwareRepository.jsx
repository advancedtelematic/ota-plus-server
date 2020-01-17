/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { FadeAnimation } from '../utils';
import { SoftwareContainer } from '../containers';
import { PAGE_PACKAGES } from '../config';

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
    softwareStore.page = PAGE_PACKAGES;
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
        <div>
          <SoftwareContainer highlightedPackage={params.packageName} />
        </div>
      </FadeAnimation>
    );
  }
}

export default SoftwareRepository;

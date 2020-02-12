/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { ImpactAnalysisContainer } from '../containers';

const title = 'Analytics';

@inject('stores')
@observer
class ImpactAnalysis extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
  };

  componentDidMount() {
    const { stores } = this.props;
    const { softwareStore } = stores;
    softwareStore.fetchBlacklist(true, true);
  }

  render() {
    return (
      <FadeAnimation>
        <MetaData title={title}>
          <ImpactAnalysisContainer />
        </MetaData>
      </FadeAnimation>
    );
  }
}

export default ImpactAnalysis;

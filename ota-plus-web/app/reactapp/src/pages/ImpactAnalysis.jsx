/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { ImpactAnalysisContainer } from '../containers';

const title = 'Impact analysis';

@inject('stores')
@observer
class ImpactAnalysis extends Component {
  static propTypes = {
    stores: PropTypes.object,
  };

  componentDidMount() {
    const { stores } = this.props;
    const { packagesStore, impactAnalysisStore } = stores;
    packagesStore.fetchBlacklist(true, true);
    impactAnalysisStore.fetchImpactAnalysis();
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

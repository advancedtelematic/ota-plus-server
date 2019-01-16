/** @format */

import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { ImpactAnalysisContainer } from '../containers';
import { translate } from 'react-i18next';

const title = 'Impact analysis';

@inject('stores')
@observer
class ImpactAnalysis extends Component {
  componentWillMount() {
    const { packagesStore, impactAnalysisStore } = this.props.stores;
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

ImpactAnalysis.propTypes = {
  stores: PropTypes.object,
};

export default ImpactAnalysis;

/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { Loader } from '../partials';
import { BlocklistedPackages, ImpactAnalysisChart, ImpactAnalysisTooltip } from '../components/impactanalysis';
import { setAnalyticsView } from '../helpers/analyticsHelper';
import { ANALYTICS_VIEW_IMPACT_ANALYSIS } from '../constants/analyticsViews';
import { SOFTWARE_ICON } from '../config';
import ReadMore from '../partials/ReadMore';

@inject('stores')
@observer
class ImpactAnalysis extends Component {
  @observable
  tooltipShown = false;

  componentDidMount() {
    setAnalyticsView(ANALYTICS_VIEW_IMPACT_ANALYSIS);
  }

  showTooltip = (e) => {
    if (e) e.preventDefault();
    this.tooltipShown = true;
  };

  hideTooltip = (e) => {
    if (e) e.preventDefault();
    this.tooltipShown = false;
  };

  render() {
    const { stores, t } = this.props;
    const { softwareStore, impactAnalysisStore } = stores;
    const { packagesBlocklistFetchAsync } = softwareStore;
    const { impactAnalysisFetchAsync } = impactAnalysisStore;
    const isFetching = packagesBlocklistFetchAsync.isFetching || impactAnalysisFetchAsync.isFetching;
    return (
      <span>
        {isFetching ? (
          <div className="wrapper-center">
            <Loader />
          </div>
        ) : softwareStore.blocklistCount ? (
          <span id="page-impact-analysis">
            <BlocklistedPackages />
            <ImpactAnalysisChart />
          </span>
        ) : (
          <div className="wrapper-center">
            <div className="page-intro content-full-height">
              <img src={SOFTWARE_ICON} alt="Icon" />
              <div>{t('impact.empty.no-packages-1')}</div>
              <ReadMore>{t('impact.empty.no-packages-2')}</ReadMore>
            </div>
          </div>
        )}
        <ImpactAnalysisTooltip shown={this.tooltipShown} hide={this.hideTooltip} />
      </span>
    );
  }
}

ImpactAnalysis.propTypes = {
  stores: PropTypes.shape({}),
  t: PropTypes.func
};

export default withTranslation()(ImpactAnalysis);

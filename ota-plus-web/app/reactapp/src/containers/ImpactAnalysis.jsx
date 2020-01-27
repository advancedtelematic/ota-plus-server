/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Loader } from '../partials';
import { BlacklistedPackages, ImpactAnalysisChart, ImpactAnalysisTooltip } from '../components/impactanalysis';
import { setAnalyticsView } from '../helpers/analyticsHelper';
import { ANALYTICS_VIEW_IMPACT_ANALYSIS } from '../constants/analyticsViews';

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
    const { stores } = this.props;
    const { softwareStore, impactAnalysisStore } = stores;
    const { packagesBlacklistFetchAsync } = softwareStore;
    const { impactAnalysisFetchAsync } = impactAnalysisStore;
    const isFetching = packagesBlacklistFetchAsync.isFetching || impactAnalysisFetchAsync.isFetching;
    return (
      <span>
        {isFetching ? (
          <div className="wrapper-center">
            <Loader />
          </div>
        ) : softwareStore.blacklistCount ? (
          <span>
            <BlacklistedPackages />
            <ImpactAnalysisChart />
          </span>
        ) : (
          <div className="wrapper-center">
            <div className="page-intro">
              <div>{"You don't have any blacklisted packages."}</div>
              <a href="#" id="impact-analysis-what-is-this" onClick={this.showTooltip}>
                What is this?
              </a>
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
};

export default ImpactAnalysis;

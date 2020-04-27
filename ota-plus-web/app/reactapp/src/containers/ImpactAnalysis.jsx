/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { Loader } from '../partials';
import { BlacklistedPackages, ImpactAnalysisChart, ImpactAnalysisTooltip } from '../components/impactanalysis';
import { setAnalyticsView } from '../helpers/analyticsHelper';
import { ANALYTICS_VIEW_IMPACT_ANALYSIS } from '../constants/analyticsViews';
import { SOFTWARE_ICON } from '../config';

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
              <img src={SOFTWARE_ICON} alt="Icon" />
              <div>{t('impact.empty.no-packages-1')}</div>
              <div>{t('impact.empty.no-packages-2')}</div>
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

/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Loader } from '../partials';
import { BlacklistedPackages, ImpactAnalysisChart, ImpactAnalysisTooltip } from '../components/impactanalysis';
import { FlatButton } from 'antd';

@inject('stores')
@observer
class ImpactAnalysis extends Component {
  @observable
  tooltipShown = false;

  showTooltip = e => {
    if (e) e.preventDefault();
    this.tooltipShown = true;
  };

  hideTooltip = e => {
    if (e) e.preventDefault();
    this.tooltipShown = false;
  };

  render() {
    const { packagesStore, impactAnalysisStore } = this.props.stores;
    return (
      <span>
        {packagesStore.packagesBlacklistFetchAsync.isFetching || impactAnalysisStore.impactAnalysisFetchAsync.isFetching ? (
          <div className='wrapper-center'>
            <Loader />
          </div>
        ) : packagesStore.blacklistCount ? (
          <span>
            <BlacklistedPackages />
            <ImpactAnalysisChart />
          </span>
        ) : (
          <div className='wrapper-center'>
            <div className='page-intro'>
              <div>{"You don't have any blacklisted packages."}</div>
              <a href='#' id='impact-analysis-what-is-this' onClick={this.showTooltip}>
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
  stores: PropTypes.object,
};

export default ImpactAnalysis;

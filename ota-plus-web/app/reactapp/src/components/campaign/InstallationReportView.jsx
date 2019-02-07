/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';

@inject('stores')
@observer
class InstallationReportView extends Component {
  render() {
    const { campaignsStore } = this.props.stores;
    const { campaign } = campaignsStore;
    const devicesTotal = _.reduce(_.map(campaign.statistics.stats, group => group.processed), (prev, next) => {
      return prev + next;
    });
    let failureStats = campaign.statistics.byResultCode;
    let failures = [];

    failureStats.map(el => {
      let failure = {
        name: el.resultCode,
        devices: el.total,
      };
      failures.push(failure);
    });

    return (
      <div className='codes'>
        <div className='codes__heading'>
          <div className='col-name'>Failure code</div>
          <div className='col-progress'>% of devices in campiagn</div>
          <div className='col-numbers'>
            Number of Affected <br />
            devices in campaign
          </div>
          {/*<div className='col-actions'>Downloads</div>
          <div className='col-actions'>Retry</div>
          <div className='col-actions'>Retry status</div>*/}
        </div>

        <>
          {_.map(failures, (el, index) => {
            const progress = Math.min(Math.round((el.devices / Math.max(devicesTotal, 1)) * 100), 100);
            return (
              <div key={index} className='codes__item'>
                <div className='col-name'>{el.name}</div>
                <div className='col-progress'>
                  <div className='codes__item-progress-wrapper'>
                    <div className='codes__item-progress-value'>{devicesTotal !== 0 ? progress + '%' : '100%'}</div>
                    <div className='codes__item-progress-bar progress progress-bar' style={{ width: devicesTotal !== 0 ? progress + '%' : '100%' }} />
                  </div>
                </div>
                <div className='col-numbers'>
                  {el.devices} of {devicesTotal}
                </div>
                {/*
                <div className='col-actions'>
                  <div className='failures__action' data-tip data-for='extract-vins' onClick={this.downloadReport}>
                    <img src='/assets/img/icons/download.svg' alt='Icon' />
                  </div>
                </div>
                <div className='col-actions'>
                  <div className='failures__action' data-tip data-for='relaunch-campaign'>
                    <img src='/assets/img/icons/relaunch.svg' alt='Icon' />
                  </div>
                </div>
                <div className='col-actions'>No retry?</div>*/}
              </div>
            );
          })}
        </>
      </div>
    );
  }
}

InstallationReportView.propTypes = {
  stores: PropTypes.object,
};

export default InstallationReportView;

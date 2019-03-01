/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { API_CAMPAIGNS_STATISTICS_FAILURES_SINGLE } from '../../config';
import { Tag } from 'antd';

@inject('stores')
@observer
class InstallationReportView extends Component {
  downloadReport = () => {
    const { campaignsStore } = this.props.stores;
    const { campaign } = campaignsStore;
    location.href = `${API_CAMPAIGNS_STATISTICS_FAILURES_SINGLE}/failed-installations.csv?correlationId=urn:here-ota:campaign:${campaign.id}`;
  };

  render() {
    const { showRetryModal } = this.props;
    const { campaignsStore, featuresStore } = this.props.stores;
    const { alphaPlusEnabled } = featuresStore;
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
          <div className='col-actions'>Export device statistics</div>
          {alphaPlusEnabled && (
            <div style={{ display: 'flex', flexDirection: 'column' }} className='col-actions'>
              <Tag color='#48dad0' className='alpha-tag'>
                ALPHA
              </Tag>
              <span>Retry</span>
            </div>
          )}
          {/*  <div className='col-actions'>Retry status</div>*/}
        </div>

        <>
          {_.map(failures, (failure, index) => {
            const progress = Math.min(Math.round((failure.devices / Math.max(devicesTotal, 1)) * 100), 100);
            return (
              <div key={index} className='codes__item'>
                <div className='col-name'>{failure.name}</div>
                <div className='col-progress'>
                  <div className='codes__item-progress-wrapper'>
                    <div className='codes__item-progress-value'>{devicesTotal !== 0 ? progress + '%' : '100%'}</div>
                    <div className='codes__item-progress-bar progress progress-bar' style={{ width: devicesTotal !== 0 ? progress + '%' : '100%' }} />
                  </div>
                </div>
                <div className='col-numbers'>
                  {failure.devices} of {devicesTotal}
                </div>
                <div className='col-actions'>
                  <div className='failure_report' onClick={this.downloadReport}>
                    <img src='/assets/img/icons/download.svg' alt='Icon' />
                  </div>
                </div>
                {alphaPlusEnabled && (
                  <div className='col-actions'>
                    <div
                      className='failure_report'
                      onClick={() => {
                        showRetryModal(failure.name);
                      }}
                    >
                      <img src='/assets/img/icons/retry_icon.svg' alt='Icon' />
                    </div>
                  </div>
                )}
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

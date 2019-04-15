/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { API_CAMPAIGNS_STATISTICS_SINGLE } from '../../config';
import { CAMPAIGN_RETRY_STATUS_TOOLTIPS, CAMPAIGN_RETRY_STATUSES } from '../../constants';
import { Button, Tag, Tooltip } from 'antd';

const RetryButtonWithTooltip = ({ status, tooltipText, onClick }) => (
  <Tooltip title={tooltipText} placement="left">
    <Button
      className="retry-button"
      shape="circle"
      disabled={status !== CAMPAIGN_RETRY_STATUSES.NOT_LAUNCHED}
      onClick={onClick}
    >
      <img src={`/assets/img/icons/retry_icon_${status}.svg`} alt='Icon' />
    </Button>
  </Tooltip>
);

@inject('stores')
@observer
class InstallationReportView extends Component {
  
  downloadReport = failureCode => {
    const { campaignsStore } = this.props.stores;
    const { campaign } = campaignsStore;
    location.href = `${API_CAMPAIGNS_STATISTICS_SINGLE}/${campaign.id}/failed-installations.csv?failureCode=${failureCode}`;
  };

  render() {
    const { showRetryModal } = this.props;
    const { campaignsStore, featuresStore } = this.props.stores;
    const { alphaPlusEnabled } = featuresStore;
    const { campaign } = campaignsStore;
    const devicesTotal = campaign.statistics.processed;
    const failures = campaign.statistics.failures;
    const isAnyRetryLaunched = _.find(failures, failure => failure.retryStatus === CAMPAIGN_RETRY_STATUSES.LAUNCHED);
    
    return (
      <div className='codes'>
        <div className='codes__heading'>
          <div className='col-name'>Failure code</div>
          <div className='col-progress'>% of devices in campaign</div>
          <div className='col-numbers'>
            Number of Affected <br />
            devices in campaign
          </div>
          <div className='col-actions'>Export device statistics</div>
          {alphaPlusEnabled && (
            <div style={{ display: 'flex', flexDirection: 'column' }} className='col-actions'>
              <Tag color='#48dad0' className='alpha-tag alpha-tag--small-margins'>
                ALPHA
              </Tag>
              <span>Retry the update installation</span>
            </div>
          )}
        </div>

        <>
          {_.map(failures, (failure, index) => {
            const progress = Math.min(Math.round((failure.count / Math.max(devicesTotal, 1)) * 100), 100);
            const retryStatus = isAnyRetryLaunched && failure.retryStatus !== CAMPAIGN_RETRY_STATUSES.LAUNCHED 
                                  ? CAMPAIGN_RETRY_STATUSES.WAITING
                                  : failure.retryStatus;
            const isActionDisabled = failure.retryStatus === CAMPAIGN_RETRY_STATUSES.LAUNCHED || retryStatus === CAMPAIGN_RETRY_STATUSES.WAITING;
            return (
              <div key={index} className='codes__item'>
                <div className='col-name'>{failure.code}</div>
                <div className='col-progress'>
                  <div className='codes__item-progress-wrapper'>
                    <div className='codes__item-progress-value'>{devicesTotal !== 0 ? progress + '%' : '100%'}</div>
                    <div className='codes__item-progress-bar progress progress-bar' style={{ width: devicesTotal !== 0 ? progress + '%' : '100%' }} />
                  </div>
                </div>
                <div className='col-numbers'>
                  {failure.count} of {devicesTotal}
                </div>
                <div className='col-actions'>
                  <div
                    className='failure_report'
                    style={{ cursor: isActionDisabled && 'not-allowed' }}
                    onClick={() => !isActionDisabled ? this.downloadReport(failure.code) : undefined}
                  >
                    <Tooltip
                      title={isActionDisabled ? 'Please, wait to export' : 'You can export'}
                      placement="left"
                    >
                      <img src='/assets/img/icons/download.svg' alt='Icon' />
                    </Tooltip>
                  </div>
                </div>
                {alphaPlusEnabled && (
                  <div className='col-actions'>
                    <div>
                      <RetryButtonWithTooltip
                        status={retryStatus}
                        tooltipText={CAMPAIGN_RETRY_STATUS_TOOLTIPS[retryStatus]}
                        onClick={() => {
                          showRetryModal(failure.code);
                        }}
                      />
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

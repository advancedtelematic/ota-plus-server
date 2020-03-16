/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { Button, Tooltip } from 'antd';
import { withTranslation } from 'react-i18next';

import { API_CAMPAIGNS_STATISTICS_SINGLE, DOWNLOAD_ICON } from '../../config';
import { CAMPAIGN_RETRY_STATUS_TOOLTIPS, CAMPAIGN_RETRY_STATUSES } from '../../constants';
import { sendAction } from '../../helpers/analyticsHelper';
import { OTA_CAMPAIGNS_EXTRACT_FAILED_DEVICES } from '../../constants/analyticsActions';

const RetryButtonWithTooltip = ({ status, tooltipText, onClick }) => (
  <Tooltip title={tooltipText} placement="left">
    <Button
      className="retry-button"
      shape="circle"
      disabled={status !== CAMPAIGN_RETRY_STATUSES.NOT_LAUNCHED}
      onClick={onClick}
    >
      <img src={`/assets/img/icons/retry_icon_${status}.svg`} alt="Icon" />
    </Button>
  </Tooltip>
);

RetryButtonWithTooltip.propTypes = {
  status: PropTypes.string.isRequired,
  tooltipText: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

@inject('stores')
@observer
class InstallationReportView extends Component {
  downloadReport = (failureCode) => {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    const { campaign } = campaignsStore;
    // eslint-disable-next-line no-restricted-globals
    location.href = `${API_CAMPAIGNS_STATISTICS_SINGLE}/${
      campaign.id
    }/failed-installations.csv?failureCode=${failureCode}`;
    sendAction(OTA_CAMPAIGNS_EXTRACT_FAILED_DEVICES);
  };

  render() {
    const { showRetryModal, stores, t } = this.props;
    const { campaignsStore } = stores;
    const { campaign } = campaignsStore;
    const devicesTotal = campaign.statistics.processed;
    const { failures } = campaign.statistics;
    const isAnyRetryLaunched = _.find(failures, failure => failure.retryStatus === CAMPAIGN_RETRY_STATUSES.LAUNCHED);

    return (
      <div className="codes">
        <div className="codes__heading">
          <div className="col-name">Failure code</div>
          <div className="col-progress">% of devices in campaign</div>
          <div className="col-numbers">
            Number of Affected
            <br />
            devices in campaign
          </div>
          <div className="col-actions">Export device statistics</div>
          <div style={{ display: 'flex', flexDirection: 'column' }} className="col-actions">
            <span>Retry the update installation</span>
          </div>
        </div>

        <>
          {_.map(failures, (failure, index) => {
            const progress = Math.min(Math.round((failure.count / Math.max(devicesTotal, 1)) * 100), 100);
            const retryStatus = isAnyRetryLaunched && failure.retryStatus !== CAMPAIGN_RETRY_STATUSES.LAUNCHED
              ? CAMPAIGN_RETRY_STATUSES.WAITING
              : failure.retryStatus;
            const isActionDisabled = failure.retryStatus === CAMPAIGN_RETRY_STATUSES.LAUNCHED
              || retryStatus === CAMPAIGN_RETRY_STATUSES.WAITING;
            return (
              <div key={index} className="codes__item">
                <div className="col-name">{failure.code}</div>
                <div className="col-progress">
                  <div className="codes__item-progress-wrapper">
                    <div
                      className="codes__item-progress-bar progress progress-bar"
                      style={{ width: devicesTotal !== 0 ? `${progress}%` : '100%' }}
                    >
                      <div className="codes__item-progress-value">{devicesTotal !== 0 ? `${progress}%` : '100%'}</div>
                    </div>
                  </div>
                </div>
                <div className="col-numbers">
                  {`${failure.count} of ${devicesTotal}`}
                </div>
                <div className="col-actions">
                  <div
                    className="failure_report"
                    style={{ cursor: isActionDisabled && 'not-allowed' }}
                    onClick={() => (!isActionDisabled ? this.downloadReport(failure.code) : undefined)}
                  >
                    <Tooltip
                      title={
                        isActionDisabled
                          ? t('campaigns.installation_reports.please_wait')
                          : t('campaigns.installation_reports.can_export')
                      }
                      placement="left"
                    >
                      <img src={DOWNLOAD_ICON} alt="Icon" />
                    </Tooltip>
                  </div>
                </div>
                <div className="col-actions">
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
              </div>
            );
          })}
        </>
      </div>
    );
  }
}

InstallationReportView.propTypes = {
  stores: PropTypes.shape({}),
  showRetryModal: PropTypes.func,
  t: PropTypes.func.isRequired
};

export default withTranslation()(InstallationReportView);

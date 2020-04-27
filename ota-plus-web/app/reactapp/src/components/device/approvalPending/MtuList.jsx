/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Row } from 'antd';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { CAMPAIGNS_ICON_GRAY } from '../../../config';
import MtuListItem from './MtuListItem';

@inject('stores')
@observer
class MtuList extends Component {
  render() {
    const { cancelApprovalPendingCampaign, stores, t } = this.props;
    const { devicesStore } = stores;
    const emptyApprovalPending = (
      <div className="wrapper-center">
        <span className="overview-panel__empty">
          <img src={CAMPAIGNS_ICON_GRAY} />
          <div>{t('devices.mtu.approval_pending.no-updates')}</div>
        </span>
      </div>
    );
    return (
      <ul className={`overview-panel__list${!devicesStore.deviceApprovalPendingCampaigns.campaigns.length ? ' empty' : ''}`}>
        {devicesStore.deviceApprovalPendingCampaigns.campaigns.length
          ? (
            <div>
              <Row className="no-margin-bottom pending-description">
                {t('devices.mtu.approval_pending.description')}
              </Row>
              {_.map(devicesStore.deviceApprovalPendingCampaigns.campaigns, (campaign, index) => (
                <MtuListItem
                  key={index}
                  campaign={campaign}
                  cancelApprovalPendingCampaign={cancelApprovalPendingCampaign}
                />
              ))}
            </div>
          )
          : emptyApprovalPending}
      </ul>
    );
  }
}

MtuList.propTypes = {
  cancelApprovalPendingCampaign: PropTypes.func.isRequired,
  stores: PropTypes.shape({}),
  t: PropTypes.func.isRequired
};

export default withTranslation()(MtuList);

/** @format */

import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { METADATA_TYPES } from '../../../constants';

const MtuListItem = ({ campaign, cancelApprovalPendingCampaign, t }) => {
  const metadata = campaign.metadata.length ? campaign.metadata : null;
  return (
    <li className="overview-panel__item">
      <div className="overview-panel__item-header">
        <div className="overview-panel__item-header--title overview-panel__item-header--title__queue">
          <div>
            <span id={`update-id-title-${campaign.id}`} className="overview-panel__item-header--title__label">
              {t('devices.mtu.common.campaign')}
            </span>
            <span id={`update-id-${campaign.id}`}>{campaign.name}</span>
          </div>
          <div>
            <Tooltip title={t('devices.mtu.approval_pending.cancel_tooltip_info')} placement="left">
              <button
                type="button"
                id="cancel-mtu"
                className="ant-btn ant-btn--sm ant-btn-error"
                onClick={cancelApprovalPendingCampaign.bind(this, campaign.id)}
              >
                {t('devices.mtu.common.cancel')}
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="overview-panel__item-header--update">
          <div className="overview-panel__item-header--update__name">
            <span id={`update-id-title-${campaign.id}`} className="overview-panel__item-header__label">
              {t('devices.mtu.common.update_name')}
            </span>
            <span id={`update-id-${campaign.id}`}>{campaign.update.name}</span>
          </div>
          <div className="overview-panel__item-header--update__description">
            <span id={`update-id-title-${campaign.id}`} className="overview-panel__item-header__label">
              {t('devices.mtu.common.update_description')}
            </span>
            <span id={`update-id-${campaign.id}`}>{campaign.update.description}</span>
          </div>
        </div>
        <div className="overview-panel__item-header--update">
          {metadata && (
          <div className="overview-panel__item-header--update__name">
            <span id={`update-id-title-${campaign.id}`} className="overview-panel__item-header__label">
              {t('devices.mtu.approval_pending.distribution_settings')}
            </span>
            <span id={`update-id-${campaign.id}`}>{'Require OTA client\'s approval before installation'}</span>
          </div>
          )}
          {metadata && metadata.find(el => el.type === METADATA_TYPES.DESCRIPTION) && (
          <div className="overview-panel__item-header--update__name">
            <span id={`update-id-title-${campaign.id}`} className="overview-panel__item-header__label">
              {t('devices.mtu.approval_pending.notification_text')}
            </span>
            <span id={`update-id-${campaign.id}`}>{metadata.find(el => el.type === METADATA_TYPES.DESCRIPTION).value}</span>
          </div>
          )}
        </div>
        <div className="overview-panel__item-header--update">
          {metadata && metadata.find(el => el.type === METADATA_TYPES.PRE_DURATION) && (
          <div className="overview-panel__item-header--update__name">
            <span id={`update-id-title-${campaign.id}`} className="overview-panel__item-header__label">
              {t('devices.mtu.approval_pending.estimated_time_to_prepare')}
            </span>
            <span id={`update-id-${campaign.id}`}>
              {moment.utc(
                parseInt(metadata.find(el => el.type === METADATA_TYPES.PRE_DURATION).value, 10) * 1000
              ).format('HH:mm:ss')}
            </span>
          </div>
          )}
          {metadata && metadata.find(el => el.type === METADATA_TYPES.INSTALL_DURATION) && (
          <div className="overview-panel__item-header--update__description">
            <span id={`update-id-title-${campaign.id}`} className="overview-panel__item-header__label">
              {t('devices.mtu.approval_pending.estimated_time_to_install')}
            </span>
            <span id={`update-id-${campaign.id}`}>
              {moment.utc(
                parseInt(metadata.find(el => el.type === METADATA_TYPES.INSTALL_DURATION).value, 10) * 1000
              ).format('HH:mm:ss')}
            </span>
          </div>
          )}
        </div>
      </div>
    </li>
  );
};

MtuListItem.propTypes = {
  campaign: PropTypes.shape({}),
  cancelApprovalPendingCampaign: PropTypes.func,
  t: PropTypes.func.isRequired
};

export default withTranslation()(MtuListItem);

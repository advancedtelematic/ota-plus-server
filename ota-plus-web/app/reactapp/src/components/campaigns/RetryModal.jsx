/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Trans, withTranslation } from 'react-i18next';

import { OTAModal } from '../../partials';
import { assets } from '../../config';

@inject('stores')
@observer
class RetryModal extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    failureforRetry: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
  };

  launch = () => {
    const { stores, hide, failureforRetry } = this.props;
    const { campaignsStore } = stores;
    campaignsStore.launchRetryCampaign(campaignsStore.campaign.id, failureforRetry);
    hide();
  }

  render() {
    const { shown, hide, failureforRetry, t } = this.props;
    const content = (
      <div>
        <div className="list-header">
          {t('campaigns.retry.header_1')}
          <b>{failureforRetry}</b>
        </div>
        <ol>
          <Trans>
            {t('campaigns.retry.description_1', { returnObjects: true }).map(text => (<li>{text}</li>))}
          </Trans>
        </ol>
        <div className="list-header">{t('campaigns.retry.header_2')}</div>
        <ol>
          <Trans>
            {t('campaigns.retry.description_2', { returnObjects: true }).map(text => (<li>{text}</li>))}
          </Trans>
        </ol>
        <div className="body-actions">
          <button type="submit" className="btn-primary" id="add-new-key-confirm" onClick={this.launch}>
            Confirm
          </button>
        </div>
      </div>
    );
    return (
      <OTAModal
        title={t('campaigns.retry.title')}
        topActions={(
          <div className="top-actions flex-end">
            <div className="modal-close" onClick={hide}>
              <img src={assets.DEFAULT_CLOSE_ICON} alt="Icon" />
            </div>
          </div>
        )}
        className="retry-campaign-modal"
        content={content}
        visible={shown}
      />
    );
  }
}

export default withTranslation()(RetryModal);

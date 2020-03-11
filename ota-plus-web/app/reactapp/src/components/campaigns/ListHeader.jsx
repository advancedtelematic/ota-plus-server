/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import { CAMPAIGNS_STATUS_PREPARED } from '../../config';

@observer
class ListHeader extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
  };

  render() {
    const { status, t } = this.props;
    const showColumns = status !== CAMPAIGNS_STATUS_PREPARED;

    return (
      <div className="campaigns__header">
        <div className="campaigns__column">{t('campaigns.list_item.name')}</div>
        {showColumns && (
          <>
            <div className="campaigns__column">{t('campaigns.list-item.created-at')}</div>
            <div className="campaigns__column">{t('campaigns.list_item.status')}</div>
            <div className="campaigns__column">{t('campaigns.list_item.selected_devices')}</div>
            <div className="campaigns__column">{t('campaigns.list_item.failed_percentage')}</div>
            <div className="campaigns__column">{t('campaigns.list_item.successful_percentage')}</div>
            <div className="campaigns__column">{t('campaigns.list_item.installing_percentage')}</div>
            <div className="campaigns__column">{t('campaigns.list_item.not_applicable_percentage')}</div>
          </>
        )}
        <div className="campaigns__column">{''}</div>
      </div>
    );
  }
}

export default withTranslation()(ListHeader);

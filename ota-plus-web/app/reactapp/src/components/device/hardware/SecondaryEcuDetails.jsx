/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Trans, withTranslation } from 'react-i18next';

import { Button, OTAModal } from '../../../partials';

@observer
class SecondaryEcuDetails extends Component {
  static propTypes = {
    hideDetails: PropTypes.func.isRequired,
    shown: PropTypes.bool,
    t: PropTypes.func.isRequired
  };

  render() {
    const { hideDetails, shown, t } = this.props;
    const content = (
      <span>
        <Trans>
          {t('devices.hardware.secondary_ecus_description', { returnObjects: true })}
        </Trans>
        <div className="body-actions">
          <Button light type="primary" htmlType="button" onClick={hideDetails}>
            {t('devices.hardware.got_it')}
          </Button>
        </div>
      </span>
    );

    return (
      <OTAModal
        title={t('devices.hardware.secondary_ecus_title')}
        topActions={(
          <div className="top-actions flex-end">
            <div className="modal-close" onClick={hideDetails}>
              <img src="/assets/img/icons/close.svg" alt="Icon" />
            </div>
          </div>
        )}
        content={content}
        visible={shown}
        className="secondary-ecu-details-modal"
        hideOnClickOutside
        onRequestClose={hideDetails}
      />
    );
  }
}

export default withTranslation()(SecondaryEcuDetails);

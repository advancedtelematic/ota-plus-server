/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withTranslation, Trans } from 'react-i18next';
import { Tooltip } from 'antd';
import { Button } from '../../../../partials';
import { sendAction } from '../../../../helpers/analyticsHelper';
import { OTA_DEVICE_BLACKLIST_PRIMARY_PACKAGE } from '../../../../constants/analyticsActions';
import { FEATURES } from '../../../../config';

const ACTION_TYPE_ADD = 'add';
const ACTION_TYPE_EDIT = 'edit';

@observer
class ListItem extends Component {
  constructor(props) {
    super(props);
    this.showPackageBlacklistModal = this.showPackageBlacklistModal.bind(this);
  }

  showPackageBlacklistModal(name, version, action) {
    const { showPackageBlacklistModal } = this.props;
    showPackageBlacklistModal(name, version, action);
    if (action === ACTION_TYPE_ADD) {
      sendAction(OTA_DEVICE_BLACKLIST_PRIMARY_PACKAGE);
    }
  }

  render() {
    const { features, pack, t } = this.props;
    return (
      <div className="item ondevice" id={`ondevice-package-${pack.name}`}>
        <div className="name">{pack.name}</div>
        <div className="actions">
          <div className="version">
            {`v${pack.version}`}
          </div>
          {features.includes(FEATURES.IMPACT_ANALYSIS) && (
            <>
              {pack.isBlackListed ? (
                <Tooltip title={<Trans>{t('devices.software.blacklist.delete-tooltip')}</Trans>}>
                  <Button
                    className="btn-blacklist bl-remove"
                    htmlType="button"
                    onClick={() => {
                      this.showPackageBlacklistModal(pack.name, pack.version, ACTION_TYPE_EDIT);
                    }}
                    id={`button-edit-blacklisted-package-${pack.name}-${pack.version}`}
                  >
                    {t('software.blacklist-modal.buttons.remove')}
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title={<Trans>{t('devices.software.blacklist.add-tooltip')}</Trans>}>
                  <Button
                    className="btn-blacklist"
                    htmlType="button"
                    onClick={() => {
                      this.showPackageBlacklistModal(pack.name, pack.version, ACTION_TYPE_ADD);
                    }}
                    id={`button-blacklist-package-${pack.name}-${pack.version}`}
                  >
                    {t('software.blacklist-modal.buttons.add')}
                  </Button>
                </Tooltip>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

ListItem.propTypes = {
  features: PropTypes.arrayOf(PropTypes.string),
  pack: PropTypes.shape({}).isRequired,
  showPackageBlacklistModal: PropTypes.func.isRequired,
  t: PropTypes.func,
};

export default withTranslation()(ListItem);

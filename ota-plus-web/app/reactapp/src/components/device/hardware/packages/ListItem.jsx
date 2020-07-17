/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withTranslation, Trans } from 'react-i18next';
import { Tooltip } from 'antd';
import { Button } from '../../../../partials';
import { sendAction } from '../../../../helpers/analyticsHelper';
import { OTA_DEVICE_BLOCKLIST_PRIMARY_PACKAGE } from '../../../../constants/analyticsActions';
import { FEATURES } from '../../../../config';

const ACTION_TYPE_ADD = 'add';
const ACTION_TYPE_EDIT = 'edit';

@observer
class ListItem extends Component {
  constructor(props) {
    super(props);
    this.showPackageBlocklistModal = this.showPackageBlocklistModal.bind(this);
  }

  showPackageBlocklistModal(name, version, action) {
    const { showPackageBlocklistModal } = this.props;
    showPackageBlocklistModal(name, version, action);
    if (action === ACTION_TYPE_ADD) {
      sendAction(OTA_DEVICE_BLOCKLIST_PRIMARY_PACKAGE);
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
              {pack.isBlockListed ? (
                <Tooltip title={<Trans>{t('devices.software.blocklist.delete-tooltip')}</Trans>}>
                  <Button
                    className="btn-blocklist bl-remove"
                    htmlType="button"
                    onClick={() => {
                      this.showPackageBlocklistModal(pack.name, pack.version, ACTION_TYPE_EDIT);
                    }}
                    id={`button-edit-blocklisted-package-${pack.name}-${pack.version}`}
                  >
                    {t('software.blocklist-modal.buttons.remove')}
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title={<Trans>{t('devices.software.blocklist.add-tooltip')}</Trans>}>
                  <Button
                    className="btn-blocklist"
                    htmlType="button"
                    onClick={() => {
                      this.showPackageBlocklistModal(pack.name, pack.version, ACTION_TYPE_ADD);
                    }}
                    id={`button-blocklist-package-${pack.name}-${pack.version}`}
                  >
                    {t('software.blocklist-modal.buttons.add')}
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
  showPackageBlocklistModal: PropTypes.func.isRequired,
  t: PropTypes.func,
};

export default withTranslation()(ListItem);

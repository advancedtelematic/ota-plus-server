/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { sendAction } from '../../../../helpers/analyticsHelper';
import { OTA_DEVICE_BLACKLIST_PRIMARY_PACKAGE } from '../../../../constants/analyticsActions';

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
    const { pack } = this.props;
    return (
      <div className="item ondevice" id={`ondevice-package-${pack.name}`}>
        <div className="name">{pack.name}</div>

        <div className="actions">
          <div className="version">
            {`v${pack.version}`}
          </div>
          {pack.isBlackListed ? (
            <button
              type="button"
              className="btn-blacklist edit"
              onClick={() => {
                this.showPackageBlacklistModal(pack.name, pack.version, ACTION_TYPE_EDIT);
              }}
              title="Edit blacklisted package version"
              id={`button-edit-blacklisted-package-${pack.name}-${pack.version}`}
            />
          ) : (
            <button
              type="button"
              className="btn-blacklist"
              onClick={() => {
                this.showPackageBlacklistModal(pack.name, pack.version, ACTION_TYPE_ADD);
              }}
              title="Blacklist package version"
              id={`button-blacklist-package-${pack.name}-${pack.version}`}
            />
          )}
        </div>
      </div>
    );
  }
}

ListItem.propTypes = {
  pack: PropTypes.shape({}).isRequired,
  showPackageBlacklistModal: PropTypes.func.isRequired,
};

export default ListItem;

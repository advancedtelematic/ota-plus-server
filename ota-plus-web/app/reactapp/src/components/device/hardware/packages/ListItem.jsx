/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class ListItem extends Component {
  render() {
    const { pack, showPackageBlacklistModal } = this.props;
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
              onClick={showPackageBlacklistModal.bind(this, pack.name, pack.version, 'edit')}
              title="Edit blacklisted package version"
              id={`button-edit-blacklisted-package-${pack.name}-${pack.version}`}
            />
          ) : (
            <button
              type="button"
              className="btn-blacklist"
              onClick={showPackageBlacklistModal.bind(this, pack.name, pack.version, 'add')}
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

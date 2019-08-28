/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';

@inject('stores')
@observer
class ListItem extends Component {
  @observable isExportable = false;

  componentDidMount() {
    const { provisioningKey, stores } = this.props;
    const { provisioningStore } = stores;
    this.isExportable = provisioningStore.checkProvisioningKey(provisioningKey.id);
  }

  onDownload = () => {
    const { provisioningKey, stores } = this.props;
    const { provisioningStore } = stores;
    provisioningStore.downloadProvisioningKey(provisioningKey.id);
  }

  render() {
    const { provisioningKey } = this.props;
    const validFrom = new Date(provisioningKey.validFrom);
    const validUntil = new Date(provisioningKey.validUntil);
    return (
      <div className="box" id={`key-${provisioningKey.description}`}>
        <div className="column">
          {provisioningKey.description}
        </div>
        <div className="column">
          {`Start date: ${validFrom.toDateString()}  ${validFrom.toLocaleTimeString()}`}
        </div>
        <div className="column">
          {`End date: ${validUntil.toDateString()} ${validUntil.toLocaleTimeString()}`}
        </div>
        <div className="column">
          <img
            src="/assets/img/icons/download_key.svg"
            className={this.isExportable ? 'download-key-link' : 'download-key-link--disabled'}
            id={`download-key-link-${provisioningKey.description}`}
            alt="Icon"
            onClick={this.isExportable ? this.onDownload : null}
          />
        </div>
      </div>
    );
  }
}

ListItem.propTypes = {
  stores: PropTypes.shape({}),
  provisioningKey: PropTypes.shape({}).isRequired,
};

export default ListItem;

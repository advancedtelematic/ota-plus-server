/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { CREDENTIALS_PROVISIONING_DATE_FORMAT } from '../../../constants/datesTimesConstants';
import { getFormattedDateTime } from '../../../helpers/datesTimesHelper';
import { DOWNLOAD_KEY_ICON } from '../../../config';

@inject('stores')
class ListItem extends Component {
  onDownload = () => {
    const { provisioningKey, stores } = this.props;
    const { provisioningStore } = stores;
    provisioningStore.downloadProvisioningKey(provisioningKey.id);
  };

  render() {
    const { provisioningKey, isExportable } = this.props;
    return (
      <div className="box" id={`key-${provisioningKey.description}`}>
        <div className="column">
          {provisioningKey.description}
        </div>
        <div className="column">
          {`Start date: ${getFormattedDateTime(provisioningKey.validFrom, CREDENTIALS_PROVISIONING_DATE_FORMAT)}`}
        </div>
        <div className="column">
          {`End date: ${getFormattedDateTime(provisioningKey.validUntil, CREDENTIALS_PROVISIONING_DATE_FORMAT)}`}
        </div>
        <div className="column">
          <img
            src={DOWNLOAD_KEY_ICON}
            className={isExportable ? 'download-key-link' : 'download-key-link--disabled'}
            id={`download-key-link-${provisioningKey.description}`}
            alt="Icon"
            onClick={isExportable ? this.onDownload : null}
          />
        </div>
      </div>
    );
  }
}

ListItem.propTypes = {
  stores: PropTypes.shape({}),
  isExportable: PropTypes.bool,
  provisioningKey: PropTypes.shape({}).isRequired,
};

export default ListItem;

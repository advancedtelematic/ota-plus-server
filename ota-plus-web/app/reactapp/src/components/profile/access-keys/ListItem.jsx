/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject } from 'mobx-react';
import moment from 'moment';
import { CREDENTIALS_PROVISIONING_DATE_FORMAT } from '../../../constants/datesTimesConstants';

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
          {`Start date: ${moment(provisioningKey.validFrom).format(CREDENTIALS_PROVISIONING_DATE_FORMAT)}`}
        </div>
        <div className="column">
          {`End date: ${moment(provisioningKey.validUntil).format(CREDENTIALS_PROVISIONING_DATE_FORMAT)}`}
        </div>
        <div className="column">
          <img
            src="/assets/img/icons/download_key.svg"
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

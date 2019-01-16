/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class VersionsItem extends Component {
  render() {
    const { version } = this.props;
    return (
      <li className='version-item'>
        <div className='column' title={version.packageId.version}>
          {version.packageId.version}
        </div>
        <div className='column'>{version.statistics.deviceCount !== null ? version.statistics.deviceCount : null}</div>
      </li>
    );
  }
}

VersionsItem.propTypes = {
  version: PropTypes.object.isRequired,
};

export default VersionsItem;

/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import VersionsItem from './VersionsItem';

@observer
class Versions extends Component {
  render() {
    const { versions } = this.props;
    return (
      <div className="versions" id="impact-analysis-blocklisted-versions">
        <ul>
          {_.map(versions, (version, index) => <VersionsItem version={version} key={index} />)}
        </ul>
      </div>
    );
  }
}

Versions.propTypes = {
  versions: PropTypes.arrayOf(PropTypes.shape({}))
};

export default Versions;

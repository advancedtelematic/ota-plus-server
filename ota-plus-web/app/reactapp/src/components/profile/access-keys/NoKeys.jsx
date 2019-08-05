/** @format */

import PropTypes from 'prop-types';
import React from 'react';

const NoKeys = ({ showTooltip }) => (
  <div className="profile-container-empty">
    <div className="wrapper-center">
      <div className="page-intro background-white">
        <div className="no-access-keys">{'You haven\'t created any keys yet.'}</div>
        <div>
          <a
            href="#"
            className="add-button access-keys-tooltip"
            onClick={showTooltip.bind(this)}
          >
            {'What is this?'}
          </a>
        </div>
      </div>
    </div>
  </div>
);

NoKeys.propTypes = {
  showTooltip: PropTypes.func
};

export default NoKeys;

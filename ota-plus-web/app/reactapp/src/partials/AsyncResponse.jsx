/** @format */

import PropTypes from 'prop-types';
import React from 'react';

const AsyncResponse = ({ action, handledStatus, successMsg, errorMsg, id }) => (
  <span>
    {action.status !== null && (handledStatus === 'all' || handledStatus === action.status) ? (
      <div id={id} className={`alert ${action.status === 'success' ? 'alert-success' : 'alert-danger'}`}>
        {action.status === 'success' ? successMsg : errorMsg || 'An error occured. Please try again.'}
      </div>
    ) : null}
  </span>
);

AsyncResponse.propTypes = {
  id: PropTypes.string,
  action: PropTypes.shape({}).isRequired,
  handledStatus: PropTypes.string.isRequired,
  successMsg: PropTypes.string,
  errorMsg: PropTypes.string,
};

export default AsyncResponse;

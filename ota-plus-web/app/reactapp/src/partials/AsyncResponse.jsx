/** @format */

import React, { Component, PropTypes } from 'react';

const AsyncResponse = ({ action, handledStatus, successMsg, errorMsg, id }) => {
  return (
    <span>
      {action.status !== null && (handledStatus == 'all' || handledStatus == action.status) ? (
        <div id={id} className={'alert ' + (action.status == 'success' ? 'alert-success' : 'alert-danger')}>
          {action.status == 'success' ? successMsg : errorMsg ? errorMsg : 'An error occured. Please try again.'}
        </div>
      ) : null}
    </span>
  );
};

AsyncResponse.propTypes = {
  action: PropTypes.object.isRequired,
  handledStatus: PropTypes.string.isRequired,
  successMsg: PropTypes.string,
  errorMsg: PropTypes.string,
};

export default AsyncResponse;

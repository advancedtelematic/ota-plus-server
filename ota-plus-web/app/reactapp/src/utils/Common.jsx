/** @format */

import _ from 'underscore';

const doLogout = () => {
  document.getElementById('logout').submit();
};

const resetAll = (asyncCollection, isFetching = false) => {
  _.each(asyncCollection, async => {
    resetAsync(async, isFetching);
  });
};

const resetAsync = (obj, isFetching = false) => {
  obj.isFetching = isFetching;
  obj.status = null;
  obj.data = null;
  obj.code = null;
};

const handleAsyncSuccess = response => {
  return {
    status: 'success',
    code: response.status,
    data: response.data,
    isFetching: false,
  };
};

const handleAsyncError = error => {
  error.response = error.response || { status: null, data: {} };

  if (error.response.status === 401) {
    doLogout();
  }

  return {
    status: 'error',
    code: error.response.status,
    data: error.response.data,
    isFetching: false,
  };
};

export { doLogout, resetAll, resetAsync, handleAsyncSuccess, handleAsyncError };

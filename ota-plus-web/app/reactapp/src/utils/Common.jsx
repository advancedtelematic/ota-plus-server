const doLogout = () => {
  document.getElementById('logout').submit();
}

const resetAsync = (obj, isFetching = false) => {
  obj.isFetching = isFetching;
  obj.status = null;
  obj.data = null;
  obj.code = null;
}

const handleAsyncSuccess = (response) => {
  let resp = {
    status: 'success',
    code: response.status,
    data: response.data,
    isFetching: false
  };
  return resp;
}

const handleAsyncError = (error) => {
  error.response = error.response || {status: null, data: {}};

  if(error.response.status === 401) {
    doLogout();
  }

  let resp = {
    status: 'error',
    code: error.response.status,
    data: error.response.data,
    isFetching: false
  };
  return resp;
}

export {
  doLogout,
  resetAsync,
  handleAsyncSuccess,
  handleAsyncError
};

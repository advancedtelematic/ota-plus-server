import {
  HTTP_CODE_404_NOT_FOUND,
  HTTP_CODE_503_SERVICE_UNAVAILABLE,
  HTTP_CODE_504_GATEWAY_TIMEOUT
} from '../constants/httpCodes';

// eslint-disable-next-line import/prefer-default-export
export const getDeviceHttpStatusErrorMessage = (errorCode) => {
  let message;
  switch (errorCode) {
    case HTTP_CODE_404_NOT_FOUND:
      message = 'Device not provisioned successfully';
      break;
    case HTTP_CODE_503_SERVICE_UNAVAILABLE:
    case HTTP_CODE_504_GATEWAY_TIMEOUT:
      message = 'Please try again later';
      break;
    default:
      message = 'Never seen online';
      break;
  }
  return message;
};

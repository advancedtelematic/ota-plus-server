/** @format */

import PropTypes from 'prop-types';
import { observe } from 'mobx';
import { PropTypes as MobxPropTypes } from 'mobx-react';

const AsyncStatusCallbackHandler = (store, actionName, callbackFunc) => {
  return observe(store, change => {
    if (change.name === actionName && change.oldValue.status !== change.object[change.name].status && change.object[change.name].status === 'success') {
      callbackFunc.call();
    }
  });
};

AsyncStatusCallbackHandler.propTypes = {
  store: MobxPropTypes.observableObject.isRequired,
  actionName: PropTypes.string.isRequired,
  callbackFunc: PropTypes.func.isRequired,
};

export default AsyncStatusCallbackHandler;

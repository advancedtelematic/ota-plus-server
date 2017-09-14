import React, { PropTypes } from 'react';
import { observe } from 'mobx';
import { PropTypes as MobxPropTypes} from 'mobx-react';

const AsyncConflictCallbackHandler = (store, actionName, callbackFunc) => {
      return observe(store, (change) => {
        switch (change.object[change.name].code) {
            case 200:
            case 201:
            case 404:
            case 409:
            case 502:
              callbackFunc.call();
              break;
        }
    });
}

AsyncConflictCallbackHandler.propTypes = {
    store: MobxPropTypes.observableObject.isRequired,
      actionName: PropTypes.string.isRequired,
      callbackFunc: PropTypes.func.isRequired
};

export default AsyncConflictCallbackHandler;

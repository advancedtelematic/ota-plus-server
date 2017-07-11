import React, { PropTypes } from 'react';
import { observe } from 'mobx';
import { PropTypes as MobxPropTypes} from 'mobx-react';

const AsyncConflictCallbackHandler = (store, actionName, callbackFunc) => {
      return observe(store, (change) => {
        if(change.object[change.name].code === 409 || change.object[change.name].code === 200) {
              callbackFunc.call();
        }
    });
}

AsyncConflictCallbackHandler.propTypes = {
    store: MobxPropTypes.observableObject.isRequired,
      actionName: PropTypes.string.isRequired,
      callbackFunc: PropTypes.func.isRequired
};

export default AsyncConflictCallbackHandler;
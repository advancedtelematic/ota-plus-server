/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncResponse } from '../../../partials';
import UpdatesWizardDetailList from './step2/UpdatesWizardDetailList';
import UpdateDetails from '../UpdateDetails';

@inject('stores')
@observer
class Step2 extends Component {
  componentWillMount() {
    const { stores } = this.props;
    const { softwareStore } = stores;
    softwareStore.fetchPackages();
  }

  render() {
    const { wizardData, onStep2DataSelect, showDetails, stores } = this.props;
    const { updatesStore } = stores;
    return (
      <div className="update-modal">
        <AsyncResponse
          handledStatus="error"
          action={updatesStore.updatesCreateAsync}
          errorMsg={
            updatesStore.updatesCreateAsync.status !== 200
            && updatesStore.updatesCreateAsync.data
            && updatesStore.updatesCreateAsync.data.description
          }
        />
        <div className="updates-container clearfix">
          {showDetails ? (
            <UpdateDetails updateItem={showDetails} isEditable={false} />
          ) : (
            <UpdatesWizardDetailList wizardData={wizardData} onStep2DataSelect={onStep2DataSelect} />
          )}
        </div>
      </div>
    );
  }
}

Step2.propTypes = {
  wizardData: PropTypes.shape({}),
  onStep2DataSelect: PropTypes.func,
  showDetails: PropTypes.bool,
  stores: PropTypes.shape({})
};

export default Step2;

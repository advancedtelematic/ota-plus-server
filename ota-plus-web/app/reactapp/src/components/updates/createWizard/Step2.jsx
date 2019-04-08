/** @format */

import React, { Component } from 'react';
import { AsyncResponse } from '../../../partials';
import { observer, inject } from 'mobx-react';
import UpdatesWizardDetailList from './step2/UpdatesWizardDetailList';
import UpdateDetails from '../UpdateDetails';

@inject('stores')
@observer
class Step2 extends Component {
  componentWillMount() {
    const { softwareStore } = this.props.stores;
    softwareStore.fetchPackages();
  }

  render() {
    const { wizardData, onStep2DataSelect, showDetails } = this.props;
    const { updatesStore } = this.props.stores;
    return (
      <div className='update-modal'>
        <AsyncResponse
          handledStatus='error'
          action={updatesStore.updatesCreateAsync}
          errorMsg={updatesStore.updatesCreateAsync.status !== 200 && updatesStore.updatesCreateAsync.data && updatesStore.updatesCreateAsync.data.description}
        />
        <div className='updates-container clearfix'>
          {showDetails ? <UpdateDetails updateItem={showDetails} isEditable={false} /> : <UpdatesWizardDetailList wizardData={wizardData} onStep2DataSelect={onStep2DataSelect} />}
        </div>
      </div>
    );
  }
}

export default Step2;

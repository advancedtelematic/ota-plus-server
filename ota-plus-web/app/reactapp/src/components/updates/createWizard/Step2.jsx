/** @format */

import React, { Component } from 'react';
import { AsyncResponse } from '../../../partials';
import { observer, inject } from 'mobx-react';
import { Step2UpdateList } from './step2';
import UpdateDetails from '../UpdateDetails';

@inject('stores')
@observer
class Step2 extends Component {
  componentWillMount() {
    const { packagesStore } = this.props.stores;
    packagesStore.fetchPackages();
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
          {showDetails ? <UpdateDetails updateItem={showDetails} isEditable={false} /> : <Step2UpdateList wizardData={wizardData} onStep2DataSelect={onStep2DataSelect} />}
        </div>
      </div>
    );
  }
}

export default Step2;

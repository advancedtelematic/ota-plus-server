/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { DashboardContainer, SanityCheckContainer, Terms } from '../containers';
import { Loader } from '../partials';

const title = 'Dashboard';

@inject('stores')
@observer
class Dashboard extends Component {
  static propTypes = {
    stores: PropTypes.object,
    addNewWizard: PropTypes.func,
    uiAutoFeatureActivation: PropTypes.bool,
  };

  componentDidMount() {
    const { stores, uiAutoFeatureActivation } = this.props;
    const { provisioningStore, devicesStore, softwareStore } = stores;
    if (!uiAutoFeatureActivation) {
      provisioningStore.sanityCheckCompleted = true;
    }
    provisioningStore.namespaceSetup();
    devicesStore.fetchDevices();
    softwareStore.fetchPackages();
  }
  componentWillUnmount() {
    const { stores } = this.props;
    const { devicesStore, softwareStore, campaignsStore } = stores;
    devicesStore._reset();
    softwareStore._reset();
    campaignsStore._reset();
  }
  render() {
    const { stores, addNewWizard } = this.props;
    const { userStore, provisioningStore } = stores;
    const isTermsAccepted = userStore._isTermsAccepted();
    const { sanityCheckCompleted } = provisioningStore;

    return (
      <FadeAnimation display='flex'>
        {isTermsAccepted ? (
          sanityCheckCompleted ? (
            <MetaData title={title}>
              <DashboardContainer addNewWizard={addNewWizard} />
            </MetaData>
          ) : provisioningStore.namespaceSetupFetchAsync.isFetching ? (
            <div className='wrapper-center'>
              <Loader />
            </div>
          ) : (
                <SanityCheckContainer />
              )
        ) : userStore.contractsFetchAsync.isFetching ? (
          <div className='wrapper-center'>
            <Loader />
          </div>
        ) : (
              <Terms />
            )}
      </FadeAnimation>
    );
  }
}



export default Dashboard;

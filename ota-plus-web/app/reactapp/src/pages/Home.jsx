/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observe, observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { MetaData, FadeAnimation, AsyncStatusCallbackHandler } from '../utils';
import { HomeContainer, SanityCheckContainer, Terms } from '../containers';
import { Loader } from '../partials';

const title = 'Home';

@inject('stores')
@observer
class Home extends Component {
  componentWillMount() {
    const { uiAutoFeatureActivation } = this.props;
    const { provisioningStore, devicesStore, packagesStore } = this.props.stores;
    if (!uiAutoFeatureActivation) {
      provisioningStore.sanityCheckCompleted = true;
    }
    provisioningStore.namespaceSetup();
    devicesStore.fetchDevices();
    packagesStore.fetchPackages();
  }
  componentWillUnmount() {
    const { devicesStore, packagesStore, campaignsStore } = this.props.stores;
    devicesStore._reset();
    packagesStore._reset();
    campaignsStore._reset();
  }
  render() {
    const { uiUserProfileMenu, addNewWizard } = this.props;
    const { userStore, provisioningStore } = this.props.stores;
    const isTermsAccepted = userStore._isTermsAccepted();
    const { sanityCheckCompleted } = provisioningStore;
    return (
      <FadeAnimation display='flex'>
        {isTermsAccepted ? (
          sanityCheckCompleted ? (
            <MetaData title={title}>
              <HomeContainer addNewWizard={addNewWizard} />
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

Home.propTypes = {
  stores: PropTypes.object,
};

export default Home;

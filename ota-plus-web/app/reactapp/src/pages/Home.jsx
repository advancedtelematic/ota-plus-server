/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { HomeContainer, SanityCheckContainer, Terms } from '../containers';
import { Loader } from '../partials';

const title = 'Home';

@inject('stores')
@observer
class Home extends Component {
  static propTypes = {
    stores: PropTypes.object,
    addNewWizard: PropTypes.func,
    uiAutoFeatureActivation: PropTypes.bool,
  };

  componentDidMount() {
    const { stores, uiAutoFeatureActivation } = this.props;
    const { provisioningStore, devicesStore, packagesStore } = stores;
    if (!uiAutoFeatureActivation) {
      provisioningStore.sanityCheckCompleted = true;
    }
    provisioningStore.namespaceSetup();
    devicesStore.fetchDevices();
    packagesStore.fetchPackages();
  }
  componentWillUnmount() {
    const { stores } = this.props;
    const { devicesStore, packagesStore, campaignsStore } = stores;
    devicesStore._reset();
    packagesStore._reset();
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



export default Home;

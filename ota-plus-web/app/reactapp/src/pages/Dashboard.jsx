/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { MetaData, FadeAnimation } from '../utils';
import { DashboardContainer, SanityCheckContainer, Terms } from '../containers';
import { Loader } from '../partials';
import { DEVICES_LIMIT_LATEST } from '../config';

const title = 'Dashboard';

@inject('stores')
@observer
class Dashboard extends Component {
  static propTypes = {
    stores: PropTypes.object,
    addNewWizard: PropTypes.func,
    uiAutoFeatureActivation: PropTypes.bool,
    uiUserProfileMenu: PropTypes.bool
  };

  componentDidMount() {
    const { stores, uiAutoFeatureActivation, uiUserProfileMenu } = this.props;
    const { provisioningStore, devicesStore, softwareStore } = stores;
    if (!uiAutoFeatureActivation) {
      provisioningStore.sanityCheckCompleted = true;
    }
    if (uiUserProfileMenu) {
      provisioningStore.namespaceSetup();
    }
    devicesStore.fetchDevicesWithLimit(DEVICES_LIMIT_LATEST);
    softwareStore.fetchPackagesWithLimit();
  }

  componentWillUnmount() {
    const { stores } = this.props;
    const { devicesStore, softwareStore, campaignsStore } = stores;
    devicesStore._reset();
    softwareStore._reset();
    campaignsStore._reset();
  }

  render() {
    const { stores, addNewWizard, uiUserProfileMenu } = this.props;
    const { userStore, provisioningStore } = stores;
    const isTermsAccepted = userStore.isTermsAccepted();
    const contractsCheckCompleted = userStore.contractsCheckCompleted();
    const { sanityCheckCompleted } = provisioningStore;
    const renderDashboard = (
      <MetaData title={title}>
        <DashboardContainer addNewWizard={addNewWizard} />
      </MetaData>
    );

    const renderLoader = (
      <div className='wrapper-center'>
        <Loader />
      </div>
    );

    return (
      <FadeAnimation display='flex'>
        {uiUserProfileMenu
          ? isTermsAccepted
            ? sanityCheckCompleted
              ? renderDashboard
              : provisioningStore.namespaceSetupFetchAsync.isFetching
                ? renderLoader
                : <SanityCheckContainer />
            : userStore.contractsFetchAsync.isFetching
              ? renderLoader
              : (contractsCheckCompleted ? <Terms /> : renderLoader)
          : renderDashboard
        }
      </FadeAnimation>
    );
  }
}

export default Dashboard;

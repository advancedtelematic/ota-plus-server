/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import {
  DashboardPage,
  DevicesPage,
  DevicePage,
  SoftwareRepositoryPage,
  UpdatesPage,
  CampaignsPage,
  ImpactAnalysisPage,
  ProfilePage,
  NoMatchPage,
  FireworksPage,
  SoftwareRepositoryAlpha,
  TermsAndConditions,
  HomePage,
} from './pages';
import { ProfileEditProfile, ProfileUsage, ProfileAccessKeys, ProfileOrganization } from './components/profile';

const userProfileEdit = document.getElementById('toggle-userProfileEdit').value === 'true';

const Routes = ({
  addNewWizard,
  uiUserProfileEdit,
  switchToSWRepo,
  uiUserProfileMenu,
  uiAutoFeatureActivation,
  uiCredentialsDownload
}) => (
  <Switch>
    <Route
      exact
      path="/"
      render={props => (
        <DashboardPage
          {...props}
          addNewWizard={addNewWizard}
          uiAutoFeatureActivation={uiAutoFeatureActivation}
          uiUserProfileMenu={uiUserProfileMenu}
        />
      )}
    />
    <Route
      path="/home"
      render={props => (
        <HomePage
          {...props}
          uiAutoFeatureActivation={uiAutoFeatureActivation}
          uiUserProfileMenu={uiUserProfileMenu}
        />
      )}
    />
    <Route path="/fireworks" component={FireworksPage} />
    <Route path="/devices" render={props => <DevicesPage {...props} addNewWizard={addNewWizard} />} />
    <Route path="/device/:id" component={DevicePage} />
    <Route
      path="/software-repository/:packageName?"
      render={props => <SoftwareRepositoryPage {...props} switchToSWRepo={switchToSWRepo} />}
    />
    <Route path="/updates/:updateName?" component={UpdatesPage} />
    <Route path="/campaigns/:campaignId?" render={props => <CampaignsPage {...props} addNewWizard={addNewWizard} />} />
    <Route path="/impact-analysis" component={ImpactAnalysisPage} />
    <Route path="/software-repository-alpha" component={SoftwareRepositoryAlpha} />
    <Route path="/policy" component={TermsAndConditions} />
    <Route
      path="/profile"
      render={props => (
        <ProfilePage
          {...props}
          uiUserProfileMenu={uiUserProfileMenu}
          uiUserProfileEdit={uiUserProfileEdit}
          uiCredentialsDownload={uiCredentialsDownload}
        >
          <Switch>
            <Route path="/profile/edit" component={userProfileEdit ? ProfileEditProfile : NoMatchPage} />
            <Route path="/profile/organization" component={ProfileOrganization} />
            <Route path="/profile/usage" component={ProfileUsage} />
            <Route
              path="/profile/access-keys"
              render={ownProps => <ProfileAccessKeys {...ownProps} uiCredentialsDownload={uiCredentialsDownload} />}
            />
          </Switch>
        </ProfilePage>
      )}
    />

    <Route path="*" component={NoMatchPage} />
  </Switch>
);

Routes.propTypes = {
  addNewWizard: PropTypes.func,
  uiUserProfileEdit: PropTypes.bool,
  switchToSWRepo: PropTypes.bool,
  uiAutoFeatureActivation: PropTypes.bool,
  uiUserProfileMenu: PropTypes.bool,
  uiCredentialsDownload: PropTypes.bool,
};

export default Routes;

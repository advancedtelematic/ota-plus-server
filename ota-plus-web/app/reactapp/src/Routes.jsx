/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import {
  DevicesPage,
  DevicePage,
  EnvironmentsPage,
  SoftwareRepositoryPage,
  UpdatesPage,
  CampaignsPage,
  ProfilePage,
  NoMatchPage,
  FireworksPage,
  TermsAndConditions,
  HomePage,
} from './pages';
import { ProfileEditProfile, ProfileUsage, ProfileAccessKeys } from './components/profile';
import { FEATURES } from './config';

const userProfileEdit = document.getElementById('toggle-userProfileEdit').value === 'true';

const Routes = ({
  addNewWizard,
  features,
  uiUserProfileEdit,
  uiUserProfileMenu,
  uiAutoFeatureActivation,
  uiCredentialsDownload
}) => (
  <Switch>
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
      render={props => <SoftwareRepositoryPage {...props} />}
    />
    <Route path="/updates/:updateName?" component={UpdatesPage} />
    <Route path="/campaigns/:campaignId?" render={props => <CampaignsPage {...props} addNewWizard={addNewWizard} />} />
    <Route path="/policy" component={TermsAndConditions} />
    <Route path="/environments" component={EnvironmentsPage} />
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
            {features.includes(FEATURES.USAGE) && (
              <Route path="/profile/usage" component={ProfileUsage} />
            )}
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
  features: PropTypes.arrayOf(PropTypes.string),
  uiUserProfileEdit: PropTypes.bool,
  uiAutoFeatureActivation: PropTypes.bool,
  uiUserProfileMenu: PropTypes.bool,
  uiCredentialsDownload: PropTypes.bool,
};

export default Routes;

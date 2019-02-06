/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import {
  HomePage,
  DevicesPage,
  DevicePage,
  PackagesPage,
  UpdatesPage,
  CampaignsPage,
  ImpactAnalysisPage,
  WhatsNewPage,
  ProfilePage,
  NoMatchPage,
  FireworksPage,
  SoftwareRepository,
  TermsAndConditions,
} from './pages';
import { ProfileEditProfile, ProfileUsage, ProfileAccessKeys } from './components/profile';

const userProfileEdit = document.getElementById('toggle-userProfileEdit').value === 'true';

const Routes = ({ addNewWizard, uiUserProfileEdit, switchToSWRepo, uiUserProfileMenu, uiAutoFeatureActivation, uiCredentialsDownload, activeTab, switchTab }) => (
  <Switch>
    <Route exact path='/' render={props => <HomePage {...props} addNewWizard={addNewWizard} uiAutoFeatureActivation={uiAutoFeatureActivation} />} />
    <Route path='/fireworks' component={FireworksPage} />
    <Route path='/devices' render={props => <DevicesPage {...props} addNewWizard={addNewWizard} />} />
    <Route path='/device/:id' component={DevicePage} />
    <Route path='/packages/:packageName?' render={props => <PackagesPage {...props} switchToSWRepo={switchToSWRepo} />} />
    <Route path='/updates/:updateName?' component={UpdatesPage} />
    <Route path='/campaigns/:campaignId?' render={props => <CampaignsPage {...props} addNewWizard={addNewWizard} />} />
    <Route path='/impact-analysis' component={ImpactAnalysisPage} />
    <Route path='/whats-new' component={WhatsNewPage} />
    <Route path='/software-repository' component={SoftwareRepository} />
    <Route path='/policy' component={TermsAndConditions} />
    <Route
      path='/profile'
      render={props => (
        <ProfilePage {...props} uiUserProfileMenu={uiUserProfileMenu} uiUserProfileEdit={uiUserProfileEdit} uiCredentialsDownload={uiCredentialsDownload}>
          <Switch>
            <Route path='/profile/edit' component={userProfileEdit ? ProfileEditProfile : NoMatchPage} />
            <Route path='/profile/usage' component={ProfileUsage} />
            <Route path='/profile/access-keys' render={props => <ProfileAccessKeys {...props} uiCredentialsDownload={uiCredentialsDownload} />} />
          </Switch>
        </ProfilePage>
      )}
    />

    <Route path='*' component={NoMatchPage} />
  </Switch>
);

Routes.propTypes = {
  addNewWizard: PropTypes.func,
  uiUserProfileEdit: PropTypes.bool,
  switchToSWRepo: PropTypes.bool,
  uiAutoFeatureActivation: PropTypes.bool,
  uiUserProfileMenu: PropTypes.bool,
  uiCredentialsDownload: PropTypes.bool,
  activeTab: PropTypes.string,
  switchTab: PropTypes.func,
};

export default Routes;

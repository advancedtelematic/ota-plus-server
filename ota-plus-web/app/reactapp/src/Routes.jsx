import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import MainLayout from './layouts/Main';
import { 
    HomePage,
    DevicesPage,
    DevicePage,
    PackagesPage,
    CampaignsPage,
    CampaignPage,
    ImpactAnalysisPage,
    TreehubPage,
    ProfilePage,
    NoMatchPage,
    WelcomePage,
    DestinyPage,
    FireworksPage,
    SoftwareRepository,
} from './pages';
import { 
    SoftwareRepositoryPage,
    AdvancedCampaignsPage,
    ConnectorsPage,
    GatewayPage,
    AuditorPage,
    DashboardPage,
    DeviceRegistryPage,
} from './pages/otaplus';
import { 
    LoginStep1Page,
    LoginStep2Page,
} from './pages/otaplus/login';
import {
    ProfileEditProfile,
    ProfileUsage,
    ProfileBilling,
    ProfileAccessKeys,
    ProfileUsersAndRoles,
    ProfileBlSettings,
} from './components/profile';

const Routes = () => {
    return (
        <Router history={hashHistory}>
            <Route component={MainLayout}>
                <IndexRoute component={HomePage}/>
                <Route path="/" component={HomePage}/>
                <Route path="/dashboard" component={DashboardPage}/>
                <Route path="/welcome" component={WelcomePage}/>
                <Route path="/destiny" component={DestinyPage}/>
                <Route path="/fireworks" component={FireworksPage}/>
                <Route path="/devices" component={DevicesPage}/>
                <Route path="/device/:id" component={DevicePage}/>
                <Route path="/packages(/:packageName)" component={PackagesPage}/>
                <Route path="/campaigns" component={CampaignsPage}/>
                <Route path="/campaign/:id" component={CampaignPage}/>
                <Route path="/impact-analysis" component={ImpactAnalysisPage}/>
                <Route path="/treehub" component={TreehubPage}/>
                <Route path="/software-repository" component={SoftwareRepository}/>
                <Route path="/advanced-campaigns" component={AdvancedCampaignsPage}/>
                <Route path="/connectors" component={ConnectorsPage}/>
                <Route path="/device-gateway" component={GatewayPage}/>
                <Route path="/auditor" component={AuditorPage}/>
                <Route path="/device-registry" component={DeviceRegistryPage}/>
                <Route path="/login/creds" component={LoginStep1Page}/>
                <Route path="/login/digits" component={LoginStep2Page}/>
                <Route path="/profile" component={ProfilePage}>
                    <IndexRoute component={ProfileEditProfile}/>
                    <Route path="edit" component={ProfileEditProfile} />
                    <Route path="usage" component={ProfileUsage} />
                    <Route path="billing" component={ProfileBilling} />
                    <Route path="access-keys" component={ProfileAccessKeys} />
                    <Route path="users-and-roles" component={ProfileUsersAndRoles} />
                    <Route path="bl-settings" component={ProfileBlSettings} />
                </Route>
                <Route path="*" component={NoMatchPage}/>
            </Route>
        </Router>
    );
}

export default Routes;
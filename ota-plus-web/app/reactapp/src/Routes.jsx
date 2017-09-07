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
    KeysAndPackages,
} from './pages';
import {
    ProfileEditProfile,
    ProfileUsage,
    ProfileBilling,
    ProfileAccessKeys,
} from './components/profile';

const Routes = () => {
    return (
        <Router history={hashHistory}>
            <Route component={MainLayout}>
                <IndexRoute component={HomePage}/>
                <Route path="/" component={HomePage}/>
                <Route path="/welcome" component={WelcomePage}/>
                <Route path="/keys-and-packages" component={KeysAndPackages}/>
                <Route path="/destiny" component={DestinyPage}/>
                <Route path="/fireworks" component={FireworksPage}/>
                <Route path="/devices" component={DevicesPage}/>
                <Route path="/device/:id" component={DevicePage}/>
                <Route path="/packages(/:packageName)" component={PackagesPage}/>
                <Route path="/campaigns" component={CampaignsPage}/>
                <Route path="/campaign/:id" component={CampaignPage}/>
                <Route path="/impact-analysis" component={ImpactAnalysisPage}/>
                <Route path="/treehub" component={TreehubPage}/>
                <Route path="/profile" component={ProfilePage}>
                    <IndexRoute component={ProfileEditProfile}/>
                    <Route path="edit" component={ProfileEditProfile} />
                    <Route path="usage" component={ProfileUsage} />
                    <Route path="billing" component={ProfileBilling} />
                    <Route path="access-keys" component={ProfileAccessKeys} />
                </Route>
                <Route path="*" component={NoMatchPage}/>
            </Route>
        </Router>
    );
}

export default Routes;
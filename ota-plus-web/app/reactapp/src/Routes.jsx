import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import MainLayout from './layouts/Main';
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
import {
    ProfileEditProfile,
    ProfileUsage,
    ProfileAccessKeys,
} from './components/profile';

const userProfileEdit = document.getElementById('toggle-userProfileEdit').value === "true";

const Routes = () => {
    return (
        <Router history={hashHistory}>
            <Route component={MainLayout}>
                <IndexRoute component={HomePage}/>
                <Route path="/" component={HomePage}/>
                <Route path="/fireworks" component={FireworksPage}/>
                <Route path="/devices" component={DevicesPage}/>
                <Route path="/device/:id" component={DevicePage}/>
                <Route path="/packages(/:packageName)" component={PackagesPage}/>
                <Route path="/updates(/:updateName)" component={UpdatesPage}/>
                <Route path="/campaigns(/:campaignId)" component={CampaignsPage}/>
                <Route path="/impact-analysis" component={ImpactAnalysisPage}/>
                <Route path="/whats-new" component={WhatsNewPage}/>
                <Route path="/software-repository" component={SoftwareRepository}/>
                <Route path="/policy" component={TermsAndConditions}/>
                <Route path="/profile" component={ProfilePage}>
                    <IndexRoute component={ProfileEditProfile}/>
                    <Route path="edit" component={userProfileEdit ? ProfileEditProfile : NoMatchPage} />
                    <Route path="usage" component={ProfileUsage} />
                    <Route path="access-keys" component={ProfileAccessKeys} />
                </Route>
                <Route path="*" component={NoMatchPage}/>
            </Route>
        </Router>
    );
}

export default Routes;
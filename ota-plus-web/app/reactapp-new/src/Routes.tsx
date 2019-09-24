import React from 'react';
import { Route, Switch } from 'react-router-dom';

import DashboardView from './components/dashboard/DashboardView';

/*
 * FIXME: Temporarily render dummy app routes, replace with components later on
 */

const Routes = () => (
  <Switch>
    <Route exact path="/" component={DashboardView} />
    <Route path="/devices" render={() => <>Devices</>} />
    <Route path="/devices-groups" render={() => <>Devices Groups</>} />
    <Route path="/software" render={() => <>Software versions</>} />
    <Route path="/updates" render={() => <>Update instructions</>} />
    <Route path="/campaigns" render={() => <>Campaigns</>} />
  </Switch>
);

export default Routes;

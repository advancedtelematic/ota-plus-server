import React from 'react';
import { Route, Switch } from 'react-router-dom';

/*
 * FIXME: Temporarily render dummy app routes, replace with components later on
 */

const Routes: React.FC<{}> = () => (
  <Switch>
    <Route exact path="/" render={() => <>Home</>} />
    <Route path="/devices" render={() => <>Devices</>} />
    <Route path="/devices-groups" render={() => <>Devices Groups</>} />
    <Route path="/software" render={() => <>Software versions</>} />
    <Route path="/updates" render={() => <>Update instructions</>} />
    <Route path="/campaigns" render={() => <>Campaigns</>} />
  </Switch>
);

export default Routes;

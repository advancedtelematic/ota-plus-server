/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { MetaData } from '../utils';
import { CampaignsContainer } from '../containers';
import FadeAnimation from '../utils/FadeAnimation';

const title = 'Campaigns';

@inject('stores')
@observer
class Campaigns extends Component {
  static propTypes = {
    stores: PropTypes.object,
    addNewWizard: PropTypes.func,
    activeTab: PropTypes.string,
    switchTab: PropTypes.func,
    match: PropTypes.object,
  };

  componentWillMount() {
    const { stores } = this.props;
    const { groupsStore } = stores;
    groupsStore.fetchGroups();
  }

  componentWillUnmount() {
    const { stores } = this.props;
    const { campaignsStore, packagesStore, groupsStore } = stores;
    campaignsStore._reset();
    packagesStore._reset();
    groupsStore._reset();
  }

  render() {
    const { match, addNewWizard, activeTab, switchTab } = this.props;
    const { params } = match;

    return (
      <FadeAnimation>
        <MetaData title={title}>
          <CampaignsContainer highlight={params.campaignId} activeTab={activeTab} switchTab={switchTab} addNewWizard={addNewWizard} />
        </MetaData>
      </FadeAnimation>
    );
  }
}

export default Campaigns;

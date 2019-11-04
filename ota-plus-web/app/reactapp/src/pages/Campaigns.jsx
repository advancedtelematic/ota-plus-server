/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { CampaignsContainer } from '../containers';
import FadeAnimation from '../utils/FadeAnimation';

@inject('stores')
@observer
class Campaigns extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    addNewWizard: PropTypes.func,
    match: PropTypes.shape({}),
  };

  componentDidMount() {
    const { stores } = this.props;
    const { groupsStore } = stores;
    groupsStore.fetchGroups();
  }

  componentWillUnmount() {
    const { stores } = this.props;
    const { campaignsStore, softwareStore, groupsStore } = stores;
    campaignsStore.reset();
    softwareStore.reset();
    groupsStore.reset();
  }

  render() {
    const { match, addNewWizard } = this.props;
    const { params } = match;

    return (
      <FadeAnimation>
        <div>
          <CampaignsContainer highlight={params.campaignId} addNewWizard={addNewWizard} />
        </div>
      </FadeAnimation>
    );
  }
}

export default Campaigns;

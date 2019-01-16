/** @format */

import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { MetaData, FadeAnimation } from '../utils';
import { CampaignsContainer } from '../containers';
import { translate } from 'react-i18next';

const title = 'Campaigns';

@inject('stores')
@observer
class Campaigns extends Component {
  static propTypes = {
    addNewWizard: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired,
    switchTab: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { groupsStore } = this.props.stores;
    groupsStore.fetchGroups();
  }

  componentWillUnmount() {
    const { campaignsStore, packagesStore, groupsStore } = this.props.stores;
    campaignsStore._reset();
    packagesStore._reset();
    groupsStore._reset();
  }

  render() {
    const { addNewWizard, activeTab, switchTab } = this.props;
    const { campaignId } = this.props.params;
    return (
      <FadeAnimation>
        <MetaData title={title}>
          <CampaignsContainer higlight={campaignId} activeTab={activeTab} switchTab={switchTab} addNewWizard={addNewWizard} />
        </MetaData>
      </FadeAnimation>
    );
  }
}

export default translate()(Campaigns);

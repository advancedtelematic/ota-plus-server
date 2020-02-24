/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { withTranslation } from 'react-i18next';

import { MetaData, FadeAnimation } from '../utils';
import { DevicesContainer } from '../containers';
import { DEVICES_LIMIT_PER_PAGE } from '../config';

@DragDropContext(HTML5Backend)
@inject('stores')
@observer
class Devices extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    addNewWizard: PropTypes.func,
    t: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { stores } = this.props;
    const { devicesStore, groupsStore } = stores;
    const { selectedGroup } = groupsStore;
    const groupId = selectedGroup.id || null;
    const ungrouped = groupsStore.selectedGroup.ungrouped || null;
    devicesStore.fetchDevices(
      '', groupId, ungrouped, DEVICES_LIMIT_PER_PAGE, (devicesStore.devicesPageNumber - 1) * DEVICES_LIMIT_PER_PAGE
    );
    devicesStore.fetchUngroupedDevicesCount();
    groupsStore.fetchGroups();
  }

  componentWillUnmount() {
    const { stores } = this.props;
    const { devicesStore, groupsStore } = stores;
    devicesStore.reset();
    groupsStore.reset();
  }

  render() {
    const { addNewWizard, stores, t } = this.props;
    const { groupsStore } = stores;
    let title = t('groups.all_devices');
    if (groupsStore.selectedGroup.ungrouped) {
      title = t('groups.ungrouped_devices');
    } else if (!groupsStore.selectedGroup.ungrouped && groupsStore.selectedGroup.id) {
      title = t('groups.grouped_devices');
    }
    return (
      <FadeAnimation>
        <MetaData title={title}>
          <DevicesContainer addNewWizard={addNewWizard} />
        </MetaData>
      </FadeAnimation>
    );
  }
}

export default withTranslation()(Devices);

/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { MetaData, FadeAnimation } from '../utils';
import { DevicesContainer } from '../containers';

const title = 'Devices';

@DragDropContext(HTML5Backend)
@inject('stores')
@observer
class Devices extends Component {
  static propTypes = {
    stores: PropTypes.object,
    addNewWizard: PropTypes.func,
  };

  componentWillMount() {
    const { stores } = this.props;
    const { devicesStore, groupsStore } = stores;
    const { selectedGroup } = groupsStore;
    const groupId = selectedGroup.id || null;
    devicesStore.fetchDevices('', groupId);
    groupsStore.fetchGroups();
    devicesStore.fetchUngroupedDevices();
  }

  componentWillUnmount() {
    const { stores } = this.props;
    const { devicesStore, groupsStore } = stores;
    devicesStore._reset();
    groupsStore._reset();
  }

  render() {
    const { addNewWizard } = this.props;
    return (
      <FadeAnimation>
        <MetaData title={title}>
          <DevicesContainer addNewWizard={addNewWizard} />
        </MetaData>
      </FadeAnimation>
    );
  }
}

export default Devices;

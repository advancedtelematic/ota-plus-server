/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { GroupsHeader, GroupsList, GroupsArtificialList } from '../groups';

const GroupsPanel = ({ showCreateGroupModal, selectGroup, onDeviceDrop }) => (
  <div className='groups-panel'>
    <GroupsHeader showCreateGroupModal={showCreateGroupModal} />
    <GroupsArtificialList selectGroup={selectGroup} onDeviceDrop={onDeviceDrop} />
    <GroupsList selectGroup={selectGroup} onDeviceDrop={onDeviceDrop} />
  </div>
);

GroupsPanel.propTypes = {
  showCreateGroupModal: PropTypes.func.isRequired,
  selectGroup: PropTypes.func.isRequired,
  onDeviceDrop: PropTypes.func.isRequired,
};

export default GroupsPanel;

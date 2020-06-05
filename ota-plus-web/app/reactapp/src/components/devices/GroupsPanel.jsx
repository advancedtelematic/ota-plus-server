/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { GroupsHeader, GroupsList, GroupsArtificialList } from '../groups';

const GroupsPanel = ({ features, showCreateGroupModal, selectGroup, onDeviceDrop, uploadDeviceCustomFields }) => (
  <div className="groups-panel">
    <GroupsHeader
      features={features}
      showCreateGroupModal={showCreateGroupModal}
      uploadDeviceCustomFields={uploadDeviceCustomFields}
    />
    <GroupsArtificialList selectGroup={selectGroup} onDeviceDrop={onDeviceDrop} />
    <GroupsList selectGroup={selectGroup} onDeviceDrop={onDeviceDrop} />
  </div>
);

GroupsPanel.propTypes = {
  features: PropTypes.arrayOf(PropTypes.string),
  showCreateGroupModal: PropTypes.func.isRequired,
  selectGroup: PropTypes.func.isRequired,
  onDeviceDrop: PropTypes.func.isRequired,
  uploadDeviceCustomFields: PropTypes.func.isRequired
};

export default GroupsPanel;

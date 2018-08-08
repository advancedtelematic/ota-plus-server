import React, { Component, PropTypes } from 'react';
import { FlatButton } from 'material-ui';
import { GroupsHeader, GroupsList, GroupsArtificialList } from '../groups';

const GroupsPanel = ({ showCreateGroupModal, selectGroup, onDeviceDrop }) => {
    return (
        <div className="groups-panel">
            <GroupsHeader 
                showCreateGroupModal={showCreateGroupModal}
            />
            <GroupsArtificialList                  
                selectGroup={selectGroup}
                onDeviceDrop={onDeviceDrop}
            />
            <GroupsList                  
                selectGroup={selectGroup}
                onDeviceDrop={onDeviceDrop}
            />
        </div>
    );
}

GroupsPanel.propTypes = {
    showCreateGroupModal: PropTypes.func.isRequired,
    selectGroup: PropTypes.func.isRequired,
    onDeviceDrop: PropTypes.func.isRequired,
}

export default GroupsPanel;
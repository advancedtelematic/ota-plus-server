import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { FlatButton } from 'material-ui';
import GroupsList from './GroupsList';

@observer
class GroupsPanel extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { devicesStore, groupsStore, showCreateGroupModal, showRenameGroupModal, selectedGroup, selectGroup, onDeviceDrop } = this.props;
        return (
            <div className="groups-panel">
                <div className="wrapper-btn">
                    <FlatButton
                        label="Add new group"
                        type="button"
                        className="btn-dashed"
                        onClick={showCreateGroupModal}
                    />
                </div>
                <GroupsList
                    devicesStore={devicesStore}
                    groupsStore={groupsStore}
                    selectedGroup={selectedGroup}
                    selectGroup={selectGroup}
                    showRenameGroupModal={showRenameGroupModal}
                    onDeviceDrop={onDeviceDrop}
                />
            </div>
        );
    }
}

GroupsPanel.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired,
    showCreateGroupModal: PropTypes.func.isRequired,
    showRenameGroupModal: PropTypes.func.isRequired,
    selectedGroup: PropTypes.object.isRequired,
    selectGroup: PropTypes.func.isRequired,
    onDeviceDrop: PropTypes.func.isRequired,
}

export default GroupsPanel;
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
        const { devicesStore, groupsStore, showCreateGroupModal, selectGroup, onDeviceDrop } = this.props;
        return (
            <div className="groups-panel">
                <div className="heading">
                    <div className="title">
                        Groups
                    </div>
                    <a href="#" className="add-button light" id="add-new-group" onClick={showCreateGroupModal}>
                        <span>
                            +
                        </span>
                        <span>
                            Add group
                        </span>
                    </a>
                </div>
                <GroupsList
                    devicesStore={devicesStore}
                    groupsStore={groupsStore}
                    selectGroup={selectGroup}
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
    selectGroup: PropTypes.func.isRequired,
    onDeviceDrop: PropTypes.func.isRequired,
}

export default GroupsPanel;
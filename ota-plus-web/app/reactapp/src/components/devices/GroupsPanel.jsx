import React, { Component, PropTypes } from 'react';
import { FlatButton } from 'material-ui';
import { GroupsHeader, GroupsClassicList, GroupsSmartList, GroupsArtificialList, GroupsDefaultList } from '../groups';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';

@inject("stores")
@observer
class GroupsPanel extends Component {
    @observable expandedSection = 'classic';

    constructor(props) {
        super(props);
        this.toggleSection = this.toggleSection.bind(this);
    }
    toggleSection(name) {
        this.expandedSection = this.expandedSection !== name ? name : '';
    }
    render() {
        const { showCreateGroupModal, selectGroup, onDeviceDrop } = this.props;
        const { featuresStore } = this.props.stores;
        const { alphaPlusEnabled } = featuresStore;
        return (
            <div className="groups-panel">
                <GroupsHeader 
                    showCreateGroupModal={showCreateGroupModal}
                />
                <GroupsArtificialList                  
                    selectGroup={selectGroup}
                    onDeviceDrop={onDeviceDrop}
                />
                {alphaPlusEnabled ?
                    <span>
                        <GroupsClassicList
                            selectGroup={selectGroup}
                            onDeviceDrop={onDeviceDrop}
                            toggleSection={this.toggleSection}
                            expandedSection={this.expandedSection}
                        />
                        <GroupsSmartList
                            selectGroup={selectGroup}
                            onDeviceDrop={onDeviceDrop}
                            toggleSection={this.toggleSection}
                            expandedSection={this.expandedSection}
                        />
                    </span>
                :
                    <GroupsDefaultList                  
                        selectGroup={selectGroup}
                        onDeviceDrop={onDeviceDrop}
                    />
                }
                
            </div>
        );
    }
}

GroupsPanel.propTypes = {
    showCreateGroupModal: PropTypes.func.isRequired,
    selectGroup: PropTypes.func.isRequired,
    onDeviceDrop: PropTypes.func.isRequired,
}

export default GroupsPanel;
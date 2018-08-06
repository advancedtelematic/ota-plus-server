import React, { Component, PropTypes } from 'react';
import { FlatButton } from 'material-ui';
import { GroupsHeader, GroupsStaticList, GroupsAutomaticList, GroupsArtificialList, GroupsDefaultList } from '../groups';
import { observer, inject } from 'mobx-react';

const GroupsPanel = inject("stores")(observer(({ showCreateGroupModal, selectGroup, onDeviceDrop, stores }) => {
    const { alphaPlusEnabled } = stores.featuresStore;
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
                    <GroupsStaticList                  
                        selectGroup={selectGroup}
                        onDeviceDrop={onDeviceDrop}
                    />
                    <GroupsAutomaticList
                        selectGroup={selectGroup}
                        onDeviceDrop={onDeviceDrop}
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
}));

GroupsPanel.propTypes = {
    showCreateGroupModal: PropTypes.func.isRequired,
    selectGroup: PropTypes.func.isRequired,
    onDeviceDrop: PropTypes.func.isRequired,
}

export default GroupsPanel;
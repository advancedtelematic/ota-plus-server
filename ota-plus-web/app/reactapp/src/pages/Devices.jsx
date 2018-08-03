import React, { Component, PropTypes } from 'react';
import { observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import { MetaData, FadeAnimation } from '../utils';
import { DevicesContainer } from '../containers';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'underscore';

const title = "Devices";

@DragDropContext(HTML5Backend)
@inject("stores")
@observer
class Devices extends Component {
    constructor(props) {
        super(props);
        const { groupsStore, devicesStore } = props.stores;
        this.groupsFetchHandler = observe(groupsStore, (change) => {
            if(change.name === 'groupsFetchAsync' && !change.object[change.name].isFetching) {
                if(devicesStore.deviceFleets.length) {
                    if(groupsStore.activeFleet) {
                        props.toggleFleet(groupsStore.activeFleet);
                    } else {
                        props.toggleFleet(_.first(devicesStore.deviceFleets), true);
                    }
                }
            }
        });
    }
    componentWillMount() {
        const { devicesStore, groupsStore } = this.props.stores;
        const { selectedGroup } = groupsStore;
        const groupId = selectedGroup.id || null;
        devicesStore.fetchDevices('', groupId);        
        groupsStore.fetchGroups();
    }
    componentWillUnmount() {
        const { devicesStore, groupsStore } = this.props.stores;
        this.groupsFetchHandler();
        devicesStore._reset();
        groupsStore._reset();
    }
    render() {
        const { addNewWizard } = this.props;
        return (
            <FadeAnimation>
                <MetaData 
                    title={title}>
                    <DevicesContainer 
                        addNewWizard={addNewWizard}
                    />
                </MetaData>
            </FadeAnimation>
        );
    }
}

Devices.propTypes = {
    stores: PropTypes.object,
}

export default Devices;

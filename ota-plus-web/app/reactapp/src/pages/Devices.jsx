import React, { Component, PropTypes } from 'react';
import { observe } from 'mobx';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { MetaData, FadeAnimation } from '../utils';
import { DevicesContainer } from '../containers';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'underscore';

const title = "Devices";

@DragDropContext(HTML5Backend)
@observer
class Devices extends Component {
    constructor(props) {
        super(props);

        this.groupsFetchHandler = observe(props.groupsStore, (change) => {
            if(change.name === 'groupsFetchAsync' && !change.object[change.name].isFetching) {
                if(props.devicesStore.deviceFleets.length) {
                    if(props.groupsStore.activeFleet) {
                        props.toggleFleet(props.groupsStore.activeFleet);
                    } else {
                        props.toggleFleet(_.first(props.devicesStore.deviceFleets), true);
                    }
                }
            }
        });
    }
    componentWillMount() {
        const { devicesStore, groupsStore } = this.props;
        const selectedGroup = groupsStore.selectedGroup;
        const groupId = selectedGroup.id || null;
        devicesStore.fetchDevices('', groupId);        
        groupsStore.fetchGroups();
    }
    componentWillUnmount() {
        this.groupsFetchHandler();
        this.props.devicesStore._reset();
        this.props.groupsStore._reset();
    }
    render() {
        const { devicesStore, groupsStore, alphaPlusEnabled, addNewWizard } = this.props;
        return (
            <FadeAnimation>
                <MetaData 
                    title={title}>
                    <DevicesContainer 
                        devicesStore={devicesStore}
                        groupsStore={groupsStore}
                        alphaPlusEnabled={alphaPlusEnabled}
                        addNewWizard={addNewWizard}
                    />
                </MetaData>
            </FadeAnimation>
        );
    }
}

Devices.propTypes = {
    devicesStore: PropTypes.object,
    groupsStore: PropTypes.object
}

export default Devices;

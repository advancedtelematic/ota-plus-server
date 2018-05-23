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
                    props.toggleFleet(_.first(props.devicesStore.deviceFleets));
                }
            }
        });
    }
    componentWillMount() {
        this.props.devicesStore.fetchDevices();
        this.props.groupsStore.fetchGroups();
    }
    componentWillUnmount() {
        this.groupsFetchHandler();
        this.props.devicesStore._reset();
        this.props.groupsStore._reset();
    }
    render() {
        const { devicesStore, groupsStore, alphaPlusEnabled } = this.props;
        return (
            <FadeAnimation>
                <MetaData 
                    title={title}>
                    <DevicesContainer 
                        devicesStore={devicesStore}
                        groupsStore={groupsStore}
                        alphaPlusEnabled={alphaPlusEnabled}
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

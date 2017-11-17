import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../../partials';
import _ from 'underscore';
import LastDevicesItem from './LastDevicesItem';

@observer
class LastDevices extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { devicesStore } = this.props;
        const { lastDevices } = devicesStore;
        const noDevices = 'No devices found';
        return (
            <span>
                {devicesStore.devicesFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader 
                            className="dark"
                        />
                    </div>
                :
                    Object.keys(lastDevices).length ? 
                        _.map(lastDevices, (device) => {
                            return (
                                <LastDevicesItem 
                                    key={device.uuid}
                                    device={device}
                                />
                            );
                        })
                    :
                        noDevices
                }
            </span>
        );
    }
}

LastDevices.propTypes = {
    devicesStore: PropTypes.object
}

export default LastDevices;
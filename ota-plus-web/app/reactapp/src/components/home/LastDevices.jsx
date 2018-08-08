import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Loader } from '../../partials';
import _ from 'underscore';
import LastDevicesItem from './LastDevicesItem';
import NoItems from './NoItems';

@inject("stores")
@observer
class LastDevices extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { devicesStore } = this.props.stores;
        const { lastDevices } = devicesStore;
        return (
            <span style={{height: '100%'}}>
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
                        <NoItems 
                            itemName={"device"}
                            create={null}
                        />
                }
            </span>
        );
    }
}

LastDevices.propTypes = {
    stores: PropTypes.object
}

export default LastDevices;
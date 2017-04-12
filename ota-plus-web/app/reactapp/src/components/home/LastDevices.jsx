import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../../partials';
import { resetAsync } from '../../utils/Common';
import _ from 'underscore';
import LastDevicesItem from './LastDevicesItem';
import { DevicesCreateModal } from '../devices';
import { FlatButton } from 'material-ui';

@observer
class LastDevices extends Component {
    @observable createModalShown = false;

    constructor(props) {
        super(props);
        this.showCreateModal = this.showCreateModal.bind(this);
        this.hideCreateModal = this.hideCreateModal.bind(this);
    }
    showCreateModal(e) {
        if(e) e.preventDefault();
        this.createModalShown = true;
    }
    hideCreateModal(e) {
        if(e) e.preventDefault();
        this.createModalShown = false;
        resetAsync(this.props.devicesStore.devicesCreateAsync);
    }
    render() {
        const { devicesStore } = this.props;
        const { lastDevices } = devicesStore;
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
                        <div className="wrapper-center">
                            <FlatButton
                                label="Add new device"
                                type="button"
                                className="btn-main btn-small"
                                onClick={this.showCreateModal}
                            />

                        </div>
                }
                <DevicesCreateModal 
                    shown={this.createModalShown}
                    hide={this.hideCreateModal}
                    devicesStore={devicesStore}
                />
            </span>
        );
    }
}

LastDevices.propTypes = {
    devicesStore: PropTypes.object
}

export default LastDevices;
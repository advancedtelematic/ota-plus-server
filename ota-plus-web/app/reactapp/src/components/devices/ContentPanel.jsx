import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { SubHeader } from '../../partials';
import _ from 'underscore';
import DeviceItem from './Item';
import ContentPanelHeader from './ContentPanelHeader';
import { Loader } from '../../partials';
import { InfiniteScroll } from '../../utils';

@observer
export default class ContentPanel extends Component {
    constructor(props) {
        super(props);
        this.goToDetails = this.goToDetails.bind(this);
    }

    goToDetails(deviceId, e) {
        if(e) e.preventDefault();
        this.context.router.push(`/device/${deviceId}`);
    }

    render() {
        const {devicesStore, groupsStore, changeFilter } = this.props;
        return (
            <div className="content-panel">
                <ContentPanelHeader 
                    devicesFilter={devicesStore.devicesFilter}
                    changeFilter={changeFilter}
                />
                <div className="wrapper">
                    <InfiniteScroll
                        className="wrapper-infinite-scroll"
                        hasMore={devicesStore.devicesCurrentPage < devicesStore.devicesTotalCount / devicesStore.devicesLimit}
                        isLoading={devicesStore.devicesFetchAsync.isFetching}
                        useWindow={false}
                        loadMore={() => {
                            devicesStore.fetchDevices(devicesStore.devicesFilter, devicesStore.devicesGroupFilter)
                        }}
                    >
                        {devicesStore.devicesTotalCount ?
                            <div className="inner-container">
                                {_.map(devicesStore.preparedDevices, (device) => {
                                    return (
                                        <DeviceItem
                                            groupsStore={groupsStore}
                                            devicesStore={devicesStore}
                                            device={device}
                                            goToDetails={this.goToDetails}
                                            key={device.uuid}
                                        />
                                    );
                                })}
                            </div>
                        :
                            devicesStore.devicesFetchAsync.isFetching ?
                                <div className="wrapper-center">
                                    <Loader />
                                </div>
                            :
                                <span className="content-empty">
                                    <div className="wrapper-center">
                                        Oops, there are no devices to show.
                                    </div>
                                </span>
                        }
                    </InfiniteScroll>
                </div>
            </div>
        );
    }
}

ContentPanel.contextTypes = {
    router: React.PropTypes.object.isRequired
}

ContentPanel.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired,
    changeFilter: PropTypes.func.isRequired
}


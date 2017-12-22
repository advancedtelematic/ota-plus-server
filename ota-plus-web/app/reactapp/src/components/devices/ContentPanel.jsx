import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { SubHeader } from '../../partials';
import _ from 'underscore';
import DeviceItem from './Item';
import ContentPanelHeader from './ContentPanelHeader';
import { Loader } from '../../partials';
import { InfiniteScroll } from '../../utils';
import GroupNameHeader from '../groups/GroupNameHeader';

@observer
export default class ContentPanel extends Component {
    @observable boxWidth = 350;

    constructor(props) {
        super(props);
        this.goToDetails = this.goToDetails.bind(this);
    }

    goToDetails(deviceId, e) {
        if(e) e.preventDefault();
        this.context.router.push(`/device/${deviceId}`);
    }

    render() {
        const {devicesStore, groupsStore, showRenameModal, changeSort, changeFilter } = this.props;
        return (
            <div className="content-panel">
                <ContentPanelHeader 
                    devicesSort={devicesStore.devicesSort}
                    changeSort={changeSort}
                    devicesFilter={devicesStore.devicesFilter}
                    changeFilter={changeFilter}
                />
                <GroupNameHeader
                    groupsStore={groupsStore}
                    devicesStore={devicesStore}
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
                        {devicesStore.devicesCount ?
                            <div ref="innerContainer">
                                {_.map(devicesStore.preparedDevices, (device) => {
                                    return (
                                        <DeviceItem
                                            groupsStore={groupsStore}
                                            devicesStore={devicesStore}
                                            device={device}
                                            width={this.boxWidth}
                                            showRenameModal={showRenameModal}
                                            goToDetails={this.goToDetails}
                                            key={device.uuid}
                                        />
                                    );
                                })}
                                {devicesStore.devicesFetchAsync.isFetching ?
                                    <div className="wrapper-center">
                                        <Loader />
                                    </div>
                                :
                                    null
                                }
                            </div>
                        :
                            devicesStore.devicesFetchAsync.isFetching ?
                                <div className="wrapper-center">
                                    <Loader />
                                </div>
                            :
                                devicesStore.devicesRememberedFetchAsync.isFetching ?
                                    <div className="wrapper-center">
                                        <Loader />
                                    </div>
                                :
                                    devicesStore.devicesFetchAfterDragAndDropAsync.isFetching ?
                                        <div className="wrapper-center">
                                            <Loader />
                                        </div>
                                    :
                                    <span className="content-empty">
                                        <div className="wrapper-center font-big">
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
    showRenameModal: PropTypes.func.isRequired,
    changeSort: PropTypes.func.isRequired,
    changeFilter: PropTypes.func.isRequired
}


import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { SubHeader } from '../../partials';
import _ from 'underscore';
import DeviceItem from './Item';
import ContentPanelHeader from './ContentPanelHeader';
import { Loader } from '../../partials';
import { InfiniteScroll } from '../../utils';

const minBoxWidth = 350;

@observer
class ContentPanel extends Component {
    @observable boxWidth = 350;
    @observable howManyBoxesPerRow = 4;

    constructor(props) {
        super(props);
        this.setBoxesWidth = this.setBoxesWidth.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
    }
    componentDidMount() {
        this.setBoxesWidth();
        window.addEventListener("resize", this.setBoxesWidth);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.setBoxesWidth);
    }
    setBoxesWidth() {
        let containerWidth = this.refs.innerContainer.getBoundingClientRect().width;
        let howManyBoxesPerRow = Math.floor(containerWidth / minBoxWidth);
        this.boxWidth = Math.floor(containerWidth / howManyBoxesPerRow);
        this.howManyBoxesPerRow = howManyBoxesPerRow;
    }
    goToDetails(deviceId, e) {
        if(e) e.preventDefault();
        this.context.router.push(`/device/${deviceId}`);
    }
    render() {
        const { devicesStore, groupsStore, showRenameModal, showCreateModal, changeSort, changeFilter } = this.props;
        return (
            <div className="content-panel">
                <ContentPanelHeader 
                    showCreateModal={showCreateModal}
                    devicesSort={devicesStore.devicesSort}
                    changeSort={changeSort}
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
                        {devicesStore.devicesCount ?
                            <div ref="innerContainer">
                                {_.map(devicesStore.preparedDevices, (device) => {
                                    return (
                                        <DeviceItem
                                            groupsStore={groupsStore}
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
    showRenameModal: PropTypes.func.isRequired,
    showCreateModal: PropTypes.func.isRequired,
    changeSort: PropTypes.func.isRequired,
    changeFilter: PropTypes.func.isRequired
}

export default ContentPanel;
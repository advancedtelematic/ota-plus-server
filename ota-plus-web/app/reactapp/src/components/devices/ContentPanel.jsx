import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { SubHeader } from '../../partials';
import _ from 'underscore';
import DeviceItem from './Item';
import BarChart from './BarChart';
import Stats from './Stats';
import ContentPanelHeader from './ContentPanelHeader';
import { Loader } from '../../partials';
import { InfiniteScroll } from '../../utils';

const connections = {
  "live": {
    "0": 560,
    "1": 300,
    "2": 245,
    "3": 198,
    "4": 237,
    "5": 564,
    "6": 2545,
    "7": 3253,
    "8": 5284,
    "9": 4573,
    "10": 3142,
    "11": 2573,
    "12": 1642,
    "13": 3573,
    "14": 3235,
    "15": 3463,
    "16": 4074,
    "17": 5036,
    "18": 4546,
    "19": 4055,
    "20": 2573,
    "21": 2024,
    "22": 944,
    "23": 553
  },
  "limit": "6.000",
  "max": "5.603",
  "avg": "3.740",
  "trend": "up"
};

const statsData = {
  "provisioning": 1,
  "check": 88,
  "update": 11
};

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
        const {devicesStore, groupsStore, changeFilter, alphaPlusEnabled } = this.props;
        return (
            <div className="content-panel">
                <ContentPanelHeader 
                    devicesFilter={devicesStore.devicesFilter}
                    changeFilter={changeFilter}
                />
                <div className="devices-wrapper">
                    <div className={"devices-list" + (alphaPlusEnabled ? " devices-list--alpha" : "")}>
                        {alphaPlusEnabled ?
                            <div className="devices-heading devices-heading--absolute">
                                Test devices
                            </div>
                        :
                            null
                        }
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
                                                alphaPlusEnabled={alphaPlusEnabled}
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
                    {alphaPlusEnabled ?
                        <div className="wrapper-dashboard">
                            <div className="devices-heading devices-heading--margin">
                                Dashboard
                            </div>
                            <div className="dashboard-container">
                                <div className="top">
                                    <div className="dashboard-top">
                                        <div className="devices-heading">
                                            Simultaneous connections
                                        </div>
                                        560/600
                                        <div className="icon-up"></div>
                                    </div>
                                    <div className="dashboard-top">
                                        <div className="devices-heading">
                                            Total devices
                                        </div>
                                        134.000
                                    </div>
                                    <div className="dashboard-top">
                                        <div className="devices-heading">
                                            Total connections
                                        </div>
                                        69.000
                                        <div className="icon-up"></div>
                                    </div>
                                </div>
                                <div className="bottom">
                                    <div className="dashboard-content">
                                        <div className="devices-heading">
                                            Live connections
                                        </div>
                                        <div className="dashboard-data">
                                            <BarChart 
                                                connections={connections}
                                            />
                                        </div>
                                    </div>
                                    <div className="dashboard-content">
                                        <div className="devices-heading">
                                            Certificate rollover
                                        </div>
                                        <div className="dashboard-data">
                                            <Stats 
                                                data={statsData}
                                            />
                                        </div>
                                    </div>
                                    <div className="dashboard-content">
                                        <div className="devices-heading">
                                            Connections
                                        </div>
                                        <div className="dashboard-data">
                                            <Stats 
                                                data={statsData}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    :
                        null
                    }
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


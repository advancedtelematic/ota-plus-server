import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import {
    ActiveCampaigns,
    DraftCampaigns,
    LastDevices,
    LastPackages
} from '../components/home';

@observer
class Home extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { devicesStore, packagesStore, campaignsStore, groupsStore } = this.props;
        return (
            <span>
                <div className="boxes-row">
                    <div className="column">
                        <div className="panel panel-lightgrey">
                            <div className="panel-heading">
                                Recently created devices
                            </div>
                            <div className="panel-body">
                                <LastDevices 
                                    devicesStore={devicesStore}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="panel panel-lightgrey">
                            <div className="panel-heading">
                                Recently uploaded packages
                            </div>
                            <div className="panel-body">
                                <LastPackages 
                                    packagesStore={packagesStore}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="panel panel-lightgrey">
                            <div className="panel-heading">
                                Draft campaigns
                            </div>
                            <div className="panel-body">
                                <DraftCampaigns 
                                    campaignsStore={campaignsStore}
                                    packagesStore={packagesStore}
                                    groupsStore={groupsStore}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="boxes-row">
                    <div className="column">
                        <div className="panel panel-lightgrey">
                            <div className="panel-heading">
                                Active campaigns
                            </div>
                            <div className="panel-body">
                                <ActiveCampaigns 
                                    campaignsStore={campaignsStore}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        );
    }
}

Home.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    campaignsStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired
}

export default Home;
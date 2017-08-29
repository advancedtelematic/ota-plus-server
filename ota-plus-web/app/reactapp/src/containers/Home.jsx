import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {
    ActiveCampaigns,
    DraftCampaigns,
    LastDevices,
    LastPackages
} from '../components/home';
import { FlatButton } from 'material-ui';

@observer
class Home extends Component {
    @observable uploadToTuf = true;

    constructor(props) {
        super(props);
        this.toggleTufUpload = this.toggleTufUpload.bind(this);
    }
    toggleTufUpload(e) {
        if(e) e.preventDefault();
        this.uploadToTuf = !this.uploadToTuf;
    }
    render() {
        const { devicesStore, hardwareStore, groupsStore, packagesStore, campaignsStore, addNewWizard } = this.props;
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
                                    hardwareStore={hardwareStore}
                                    devicesStore={devicesStore}
                                    toggleTufUpload={this.toggleTufUpload}
                                    uploadToTuf={this.uploadToTuf}
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
                                <div className="wrapper-center">
                                    <FlatButton
                                        label="Add new campaign"
                                        type="button"
                                        className="btn-main btn-small btn-add"
                                        onClick={addNewWizard.bind(this, null)}
                                    />
                                </div>
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
                                    groupsStore={groupsStore}
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
    hardwareStore: PropTypes.object.isRequired,
    groupsStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    campaignsStore: PropTypes.object.isRequired
}

export default Home;
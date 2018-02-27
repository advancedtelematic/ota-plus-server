import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {
    ActiveCampaigns,
    LastDevices,
    LastPackages
} from '../components/home';
import { FlatButton } from 'material-ui';
import { resetAsync } from '../utils/Common';
import { PackagesCreateModal } from '../components/packages';


@observer
class Home extends Component {
    @observable packagesCreateModalShown = false;

    constructor(props) {
        super(props);
        this.showPackagesCreateModal = this.showPackagesCreateModal.bind(this);
        this.hidePackagesCreateModal = this.hidePackagesCreateModal.bind(this);
    }
    showPackagesCreateModal(e) {
        if(e) e.preventDefault();
        this.packagesCreateModalShown = true;
    }
    hidePackagesCreateModal(e) {
        if(e) e.preventDefault();
        this.packagesCreateModalShown = false;
    }
    render() {
        const { devicesStore, hardwareStore, packagesStore, campaignsStore, addNewWizard } = this.props;
        const allDevicesCount = devicesStore.directorDevicesCount;
        const lastDevicesTitle = 'Latest created devices';
        const lastPackagesTitle = 'Latest added packages';
        const activeCampaignsTitle = 'Active campaigns';
        return (
            <span>
                <div className="boxes-row">
                    <div className="column">
                        <div className="panel panel-lightgrey">
                            <div className="panel-heading">
                                <div className="title font-medium-bold">
                                    {lastDevicesTitle}
                                </div>
                                <div className="add">
                                    {allDevicesCount > 0 ?
                                        <a href="https://docs.atsgarage.com/index.html" className="btn-main btn-small btn-add" id="add-new-device" target="_blank" >
                                            <span>
                                                Add new device
                                            </span>
                                        </a>
                                    :
                                        null
                                    }
                                </div>
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
                                <div className="title font-medium-bold">
                                    {lastPackagesTitle}
                                </div>
                                <div className="add">
                                    <FlatButton
                                        label="Add new package"
                                        type="button"
                                        id="add-new-package"
                                        className="btn-main btn-small btn-add"
                                        onClick={this.showPackagesCreateModal}
                                    />
                                </div>
                            </div>
                            <div className="panel-body">
                                <LastPackages 
                                    packagesStore={packagesStore}
                                    hardwareStore={hardwareStore}
                                    devicesStore={devicesStore}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="panel panel-lightgrey">
                            <div className="panel-heading">
                                <div className="title font-medium-bold">
                                    {activeCampaignsTitle}
                                </div>
                                <div className="add">
                                    <FlatButton
                                        label="Add new campaign"
                                        id="add-new-campaign"
                                        type="button"
                                        className="btn-main btn-small btn-add"
                                        onClick={addNewWizard.bind(this, null)}
                                    />
                                </div>
                            </div>
                            <div className="panel-body">
                                <ActiveCampaigns 
                                    campaignsStore={campaignsStore}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {this.packagesCreateModalShown ?
                    <PackagesCreateModal 
                        shown={this.packagesCreateModalShown}
                        hide={this.hidePackagesCreateModal}
                        packagesStore={packagesStore}
                        hardwareStore={hardwareStore}
                        devicesStore={devicesStore}
                    />
                :
                    null
                }
            </span>
        );
    }
}

Home.propTypes = {
    devicesStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object.isRequired,
    packagesStore: PropTypes.object.isRequired,
    campaignsStore: PropTypes.object.isRequired
}

Home.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Home;
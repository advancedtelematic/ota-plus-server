import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {
    ActiveCampaigns,
    LastDevices,
    LastPackages
} from '../components/home';
import { FlatButton } from 'material-ui';
import { Dropdown } from '../partials';
import { resetAsync } from '../utils/Common';
import { PackagesCreateModal } from '../components/packages';
import { Link } from 'react-router';

@observer
class Home extends Component {
    @observable packagesCreateModalShown = false;
    @observable deviceSubmenuShown = false;
    @observable packageSubmenuShown = false;
    @observable campaignSubmenuShown = false;

    constructor(props) {
        super(props);
        this.showPackagesCreateModal = this.showPackagesCreateModal.bind(this);
        this.hidePackagesCreateModal = this.hidePackagesCreateModal.bind(this);
        this.toggleDeviceSubmenu = this.toggleDeviceSubmenu.bind(this);
        this.togglePackageSubmenu = this.togglePackageSubmenu.bind(this);
        this.toggleCampaignSubmenu = this.toggleCampaignSubmenu.bind(this);
        this.hideSubmenus = this.hideSubmenus.bind(this);
    }
    showPackagesCreateModal(e) {
        if(e) e.preventDefault();
        this.packagesCreateModalShown = true;
    }
    hidePackagesCreateModal(e) {
        if(e) e.preventDefault();
        this.packagesCreateModalShown = false;
    }
    toggleDeviceSubmenu(e,) {
        if(e) e.preventDefault();
        this.deviceSubmenuShown = !this.deviceSubmenuShown;
        this.packageSubmenuShown = false;
        this.campaignSubmenuShown= false;
    }
    togglePackageSubmenu(e) {
        if(e) e.preventDefault();
        this.packageSubmenuShown = !this.packageSubmenuShown;
        this.deviceSubmenuShown = false;
        this.campaignSubmenuShown = false;
    }
    toggleCampaignSubmenu(e) {
        if(e) e.preventDefault();
        this.campaignSubmenuShown = !this.campaignSubmenuShown;
        this.packageSubmenuShown = false;
        this.deviceSubmenuShown = false;
    }
    hideSubmenus() {
        this.campaignSubmenuShown = false;
        this.packageSubmenuShown = false;
        this.deviceSubmenuShown = false;
    }
    render() {
        const { devicesStore, hardwareStore, packagesStore, campaignsStore, addNewWizard } = this.props;
        return (
            <div className="home-content">
                <div className="box box-left">
                    <div className="block">
                        <div className="heading">
                            <div className="col">
                                Welcome
                            </div>
                        </div>
                        <div className="body">
                            <div className="top">
                                <div className="title">
                                    Welcome to HERE OTA Connect!
                                </div>
                                <div className="subtitle">
                                    HERE OTA Connect lets you manage updates on your embedded devices from the cloud.
                                </div>
                            </div>
                            <div className="overview">
                                <div style={{height: '100%'}}>
                                    <div className="guide-title">
                                        How it works
                                    </div>

                                    <div className="steps-container">
                                        <div className="step">
                                            <div className="step-text">
                                                Step 1
                                            </div>
                                            <img src="/assets/img/onboarding_step_one.svg" alt="Image" />
                                            <div className="step-title">
                                                Integrate our open source client
                                            </div>
                                            <div className="step-desc">
                                                Add a Yocto layer to an existing project, or follow a quickstart guide if you're new to Yocto/OpenEmbedded.
                                            </div>
                                        </div>

                                        <div className="step">
                                            <div className="step-text">
                                                Step 2
                                            </div>
                                            <img src="/assets/img/onboarding_step_two.svg" alt="Image" />
                                            <div className="step-title">
                                                Manage your devices
                                            </div>
                                            <div className="step-desc">
                                                Auto-update test bench devices with every new build, define target groups, and manage full filesystem revisions with ease.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="get-started">
                                <div style={{height: '100%'}}>
                                    <div className="guide-title">
                                        Getting started
                                    </div>
                                    
                                    <div className="steps-container">
                                        <div className="step">
                                            <div className="step-text">
                                                Start fresh
                                            </div>
                                            <img src="/assets/img/icons/black/start_fresh.svg" alt="Image" />
                                            <div className="step-title">
                                                Try out a quickstart project
                                            </div>
                                            <div className="step-desc">
                                                New to Yocto? We'll take you through a starter project step by step.
                                            </div>
                                            <div className="step-link">
                                                <a href="https://docs.atsgarage.com/quickstarts/raspberry-pi.html" className="add-button" target="_blank" id="user-new-yocto-docs">
                                                    Quickstart guide
                                                </a>
                                            </div>
                                        </div>

                                        <div className="step">
                                            <div className="step-text">
                                                Integrate
                                            </div>
                                            <img src="/assets/img/icons/black/integrate.svg" alt="Image" />
                                            <div className="step-title">
                                                Integrate with existing project
                                            </div>
                                            <div className="step-desc">
                                                Add the meta-updater layer into your existing Yocto project and OTA-enable your devices.
                                            </div>
                                            <div className="step-link">
                                                <a href="https://docs.atsgarage.com/quickstarts/adding-ats-garage-updating-to-an-existing-yocto-project.html" id="user-existing-yocto-docs" className="add-button" target="_blank">
                                                    Integration guide
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="box box-right">
                    <div className="block block-device">
                        <div className="heading">
                            <div className="col">
                                Last created devices
                            </div>
                            <div className="col">
                                Seen online
                            </div>
                            <div className="col">
                                Status
                            </div>
                            <div className="dots" onClick={this.toggleDeviceSubmenu}>
                                <span></span>
                                <span></span>
                                <span></span>


                                <Dropdown
                                    show={this.deviceSubmenuShown}
                                    hideHandler={this.hideSubmenus}
                                >
                                    <li className="device-dropdown-item">
                                        <a className="device-dropdown-item" href="https://docs.atsgarage.com/quickstarts/start-intro.html" target="_blank" onClick={(e) => e.stopPropagation()}>
                                            Add device
                                        </a>
                                    </li>
                                    <li className="device-dropdown-item">
                                        <Link
                                            to="/devices">
                                            View all
                                        </Link>
                                    </li>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="body">
                            <LastDevices 
                                devicesStore={devicesStore}
                            />
                        </div>
                    </div>
                    <div className="block block-package">
                        <div className="heading">
                            <div className="col">
                                Last added packages
                            </div>
                            <div className="col">
                                Version
                            </div>
                            <div className="col">
                                Created at
                            </div>
                            <div className="dots" onClick={this.togglePackageSubmenu}>
                                <span></span>
                                <span></span>
                                <span></span>

                                <Dropdown
                                    show={this.packageSubmenuShown}
                                    hideHandler={this.hideSubmenus}
                                >
                                    <li className="package-dropdown-item">
                                        <a className="package-dropdown-item" href="#" onClick={this.showPackagesCreateModal}>
                                            Add package
                                        </a>
                                    </li>
                                    <li className="package-dropdown-item">
                                        <Link
                                            to="/packages">
                                            View all
                                        </Link>
                                    </li>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="body">
                            <LastPackages 
                                packagesStore={packagesStore}
                                showPackagesCreateModal={this.showPackagesCreateModal}
                            />
                        </div>
                    </div>
                    <div className="block block-campaign">
                        <div className="heading">
                            <div className="col">
                                Active campaigns
                            </div>
                            <div className="col">
                                Finished
                            </div>
                            <div className="col">
                                Failure rate
                            </div>
                            <div className="dots" onClick={this.toggleCampaignSubmenu}>
                                <span></span>
                                <span></span>
                                <span></span>

                                <Dropdown
                                show={this.campaignSubmenuShown}
                                hideHandler={this.hideSubmenus}
                                >
                                    <li className="campaign-dropdown-item">
                                        <a className="campaign-dropdown-item" href="#" onClick={addNewWizard.bind(this, null)}>
                                            Add campaign
                                        </a>
                                    </li>
                                    <li className="campaign-dropdown-item">
                                        <Link
                                            to="/campaigns">
                                            View all
                                        </Link>
                                    </li>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="body">
                            <ActiveCampaigns 
                                campaignsStore={campaignsStore}
                                addNewWizard={addNewWizard}
                            />
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

            </div>
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
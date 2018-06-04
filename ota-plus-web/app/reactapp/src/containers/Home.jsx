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
        const { devicesStore, hardwareStore, packagesStore, campaignsStore } = this.props;
        return (
            <div className="home">
                <div className="home__box home__box--left">
                    <div className="home__tutorial">
                        <div className="home__heading">
                            <div className="home__heading-col">
                                Welcome
                            </div>
                        </div>
                        <div className="home__body home__body--left">
                            <div className="home__tutorial-top">
                                <div className="home__tutorial-title">
                                    Welcome to HERE OTA Connect!
                                </div>
                                <div className="home__tutorial-subtitle">
                                    HERE OTA Connect lets you manage updates on your embedded devices from the cloud.
                                </div>
                            </div>
                            <div className="home__tutorial-overview">
                                <div className="home__tutorial-wrapper">
                                    <div className="home__tutorial-title home__tutorial-title--small">
                                        How it works
                                    </div>
                                    <div className="home__tutorial-steps">
                                        <div className="home__tutorial-step">
                                            <div className="home__tutorial-step-name">
                                                Step 1
                                            </div>
                                            <img className="home__tutorial-step-image" src="/assets/img/onboarding_step_one.svg" alt="Image" />
                                            <div className="home__tutorial-step-title">
                                                Integrate our open source client
                                            </div>
                                            <div className="home__tutorial-step-desc">
                                                Add a Yocto layer to an existing project, or follow a quickstart guide if you're new to Yocto/OpenEmbedded.
                                            </div>
                                        </div>

                                        <div className="home__tutorial-step">
                                            <div className="home__tutorial-step-name">
                                                Step 2
                                            </div>
                                            <img className="home__tutorial-step-image" src="/assets/img/onboarding_step_two.svg" alt="Image" />
                                            <div className="home__tutorial-step-title">
                                                Manage your devices
                                            </div>
                                            <div className="home__tutorial-step-desc">
                                                Auto-update test bench devices with every new build, define target groups, and manage full filesystem revisions with ease.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="home__tutorial-start">
                                <div className="home__tutorial-wrapper">
                                    <div className="home__tutorial-title home__tutorial-title--small">
                                        Getting started
                                    </div>
                                    
                                    <div className="home__tutorial-steps">
                                        <div className="home__tutorial-step">
                                            <div className="home__tutorial-step-name">
                                                Start fresh
                                            </div>
                                            <img className="home__tutorial-start-image" src="/assets/img/icons/black/start_fresh.svg" alt="Image" />
                                            <div className="home__tutorial-step-title">
                                                Try out a quickstart project
                                            </div>
                                            <div className="home__tutorial-step-desc">
                                                New to Yocto? We'll take you through a starter project step by step.
                                            </div>
                                            <div className="home__tutorial-step-link">
                                                <a href="https://docs.atsgarage.com/quickstarts/raspberry-pi.html" className="add-button" target="_blank" id="user-new-yocto-docs">
                                                    Quickstart guide
                                                </a>
                                            </div>
                                        </div>

                                        <div className="home__tutorial-step">
                                            <div className="home__tutorial-step-name">
                                                Integrate
                                            </div>
                                            <img className="home__tutorial-start-image" src="/assets/img/icons/black/integrate.svg" alt="Image" />
                                            <div className="home__tutorial-step-title">
                                                Integrate with existing project
                                            </div>
                                            <div className="home__tutorial-step-desc">
                                                Add the meta-updater layer into your existing Yocto project and OTA-enable your devices.
                                            </div>
                                            <div className="home__tutorial-step-link">
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
                <div className="home__box home__box--right">
                    <div className="home__list home__list--devices">
                        <div className="home__heading">
                            <div className="home__heading-col">
                                Last created devices
                            </div>
                            <div className="home__heading-col">
                                Seen online
                            </div>
                            <div className="home__heading-col">
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
                        <div className="home__body home__body--right">
                            <LastDevices 
                                devicesStore={devicesStore}
                            />
                        </div>
                    </div>
                    <div className="home__list home__list--packages">
                        <div className="home__heading">
                            <div className="home__heading-col">
                                Last added packages
                            </div>
                            <div className="home__heading-col">
                                Version
                            </div>
                            <div className="home__heading-col">
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
                        <div className="home__body home__body--right">
                            <LastPackages 
                                packagesStore={packagesStore}
                                showPackagesCreateModal={this.showPackagesCreateModal}
                            />
                        </div>
                    </div>
                    <div className="home__list home__list--campaigns">
                        <div className="home__heading">
                            <div className="home__heading-col">
                                Active campaigns
                            </div>
                            <div className="home__heading-col">
                                Finished
                            </div>
                            <div className="home__heading-col">
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
                                        <a className="campaign-dropdown-item" href="#" onClick={(e) => { e.preventDefault(); campaignsStore._addNewWizard() }}>
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
                        <div className="home__body home__body--right">
                            <ActiveCampaigns 
                                campaignsStore={campaignsStore}
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
import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader, DependenciesModal, ConfirmationModal } from '../partials';
import { SoftwareRepository } from '../pages';
import {
    PackagesCreateModal,
    PackagesFileUploaderModal, 
    PackagesHeader, 
    PackagesList,
    PackagesBlacklistModal,
    PackagesDependenciesManager
} from '../components/packages';
import { FlatButton } from 'material-ui';

@observer
class Packages extends Component {
    @observable createModalShown = false;
    @observable fileUploaderModalShown = false;
    @observable fileDropped = null;
    @observable blacklistModalShown = false;
    @observable blacklistAction = {};
    @observable copied = false;
    @observable dependenciesModalShown = false;
    @observable dependenciesManagerShown = false;
    @observable activeVersionFilepath = null;
    @observable activeManagerVersion = null;
    @observable deleteConfirmationShown = false;
    @observable expandedPackageName = null;
    @observable itemToDelete = null;
    @observable itemToDeleteType = null;

    constructor(props) {
        super(props);
        this.showCreateModal = this.showCreateModal.bind(this);
        this.showFileUploaderModal = this.showFileUploaderModal.bind(this);
        this.hideCreateModal = this.hideCreateModal.bind(this);
        this.hideFileUploaderModal = this.hideFileUploaderModal.bind(this);
        this.showBlacklistModal = this.showBlacklistModal.bind(this);
        this.hideBlacklistModal = this.hideBlacklistModal.bind(this);
        this.onFileDrop = this.onFileDrop.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
        this.showDependenciesModal = this.showDependenciesModal.bind(this);
        this.hideDependenciesModal = this.hideDependenciesModal.bind(this);
        this.showDependenciesManager = this.showDependenciesManager.bind(this);
        this.hideDependenciesManager = this.hideDependenciesManager.bind(this);
        this.showDeleteConfirmation = this.showDeleteConfirmation.bind(this);
        this.hideDeleteConfirmation = this.hideDeleteConfirmation.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.setExpandedPackageName = this.setExpandedPackageName.bind(this);
    }
    setExpandedPackageName(name) {
        this.expandedPackageName = name;
    }
    deleteItem(e) {        
        if(e) e.preventDefault();
        if(this.itemToDeleteType === 'package') {
            this.props.packagesStore.deletePackage(this.itemToDelete);
        }
        if(this.itemToDeleteType === 'version') {
            this.props.packagesStore.deleteVersion(this.itemToDelete);
        }
        this.hideDeleteConfirmation();
    }
    showDeleteConfirmation(itemName, itemType, e) {
        if(e) e.preventDefault();
        this.itemToDelete = itemName;
        this.itemToDeleteType = itemType;
        this.deleteConfirmationShown = true;
    }
    hideDeleteConfirmation(e) {
        if(e) e.preventDefault();
        this.deleteConfirmationShown = false;
    }
    showDependenciesModal(activeVersionFilepath, e) {
        if(e) e.preventDefault();
        this.dependenciesModalShown = true;
        this.activeVersionFilepath = activeVersionFilepath;
    }
    hideDependenciesModal(e) {
        if(e) e.preventDefault();
        this.dependenciesModalShown = false;
        this.activeVersionFilepath = null;
    }
    showDependenciesManager(activeManagerVersion, e) {
        if(e) e.preventDefault();
        this.dependenciesManagerShown = true;
        this.activeManagerVersion = activeManagerVersion;
    }
    hideDependenciesManager(e) {
        if(e) e.preventDefault();
        this.dependenciesManagerShown = false;
        this.activeManagerVersion = null;
    }
    showCreateModal(files, e) {
        if(e) e.preventDefault();
        this.createModalShown = true;
        this.fileDropped = (files ? files[0] : null);
    }
    showFileUploaderModal(e) {
        if(e) e.preventDefault();
        this.fileUploaderModalShown = true;
    }
    hideFileUploaderModal(e) {
        if(e) e.preventDefault();
        this.fileUploaderModalShown = false;
    }
    handleCopy(e) {
        if(e) e.preventDefault();
        this.copied = true;
    }
    hideCreateModal(e) {
        if(e) e.preventDefault();
        this.createModalShown = false;
        this.fileDropped = null;
    }
    showBlacklistModal(name, version, mode, e) {
        if(e) e.preventDefault();
        this.blacklistModalShown = true;
        this.blacklistAction = {
            name: name,
            version: version,
            mode: mode
        };
    }
    hideBlacklistModal(e) {
        if(e) e.preventDefault();
        this.blacklistModalShown = false;
        this.blacklistAction = {};
        this.props.packagesStore._resetBlacklistActions();
    }
    onFileDrop(files) {
        this.showCreateModal(files);
    }
    render() {
        const { packagesStore, hardwareStore, highlightedPackage, featuresStore, devicesStore, campaignsStore, alphaPlusEnabled, switchToSWRepo } = this.props;
        return (
            <span ref="component">
                {packagesStore.packagesFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                :
                    packagesStore.packagesCount ?
                        <span>
                            {!switchToSWRepo ?
                                <PackagesHeader
                                    showCreateModal={this.showCreateModal}
                                    showFileUploaderModal={this.showFileUploaderModal}
                                    alphaPlusEnabled={alphaPlusEnabled}
                                /> : ''}
                            {!switchToSWRepo ?
                                <PackagesList
                                    showBlacklistModal={this.showBlacklistModal}
                                    packagesStore={packagesStore}
                                    onFileDrop={this.onFileDrop}
                                    alphaPlusEnabled={alphaPlusEnabled}
                                    highlightedPackage={highlightedPackage}
                                    showDependenciesModal={this.showDependenciesModal}
                                    showDependenciesManager={this.showDependenciesManager}
                                    showDeleteConfirmation={this.showDeleteConfirmation}
                                    expandedPackageName={this.expandedPackageName}
                                    setExpandedPackageName={this.setExpandedPackageName}
                                />
                            : <SoftwareRepository/>}
                        </span>
                    :
                        <div className="wrapper-center">
                            <div className="page-intro">
                                <div>
                                    <img src="/assets/img/icons/white/packages.svg" alt="Icon" />
                                </div>
                                <div>
                                    You haven't created any packages yet.
                                </div>
                                <div>
                                    <a href="#" className="add-button light" id="add-new-package" onClick={this.showCreateModal.bind(this, null)}>
                                        <span>
                                            +
                                        </span>
                                            <span>
                                            Add new package
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                }
                {this.createModalShown ?
                    <PackagesCreateModal 
                        shown={this.createModalShown}
                        hide={this.hideCreateModal}
                        packagesStore={packagesStore}
                        fileDropped={this.fileDropped}
                        hardwareStore={hardwareStore}
                        devicesStore={devicesStore}
                    />
                :
                    null
                }
                {this.fileUploaderModalShown ?
                    <PackagesFileUploaderModal 
                        shown={this.fileUploaderModalShown}
                        hide={this.hideFileUploaderModal}
                        handleCopy={this.handleCopy}
                        copied={this.copied}
                        featuresStore={featuresStore}
                    />
                :
                    null
                }
                {this.deleteConfirmationShown ?
                    <ConfirmationModal
                        modalTitle={
                            <div className="text-red">
                                Delete package
                            </div>
                        }
                        shown={this.deleteConfirmationShown}
                        hide={this.hideDeleteConfirmation}
                        deleteItem={this.deleteItem}
                        topText={
                            <div className="delete-modal-top-text">
                                {this.itemToDeleteType === 'package' ?
                                    <span>
                                        Remove <b>{this.expandedPackageName}</b> permanently?
                                    </span>
                                : this.itemToDeleteType === 'version' ?
                                    <span>
                                        Remove <b>{this.expandedPackageName}</b> v.<b>{this.itemToDelete}</b> permanently?
                                    </span>
                                :
                                    null
                                }
                            </div>
                        }
                        bottomText={
                            <div className="delete-modal-bottom-text">
                                If the package is part of any active campaigns, any devices that haven't installed it yet fail the campaign.
                            </div>
                        }
                    />
                :
                    null
                }
                <PackagesBlacklistModal 
                    shown={this.blacklistModalShown}
                    hide={this.hideBlacklistModal}
                    blacklistAction={this.blacklistAction}
                    packagesStore={packagesStore}
                />
                {this.dependenciesModalShown ?
                    <DependenciesModal 
                        shown={this.dependenciesModalShown}
                        hide={this.hideDependenciesModal}
                        activeItemName={this.activeVersionFilepath}
                        packagesStore={packagesStore}
                        campaignsStore={campaignsStore}
                        devicesStore={devicesStore}
                    />
                :
                    null
                }
                {this.dependenciesManagerShown ?
                    <PackagesDependenciesManager 
                        shown={this.dependenciesManagerShown}
                        hide={this.hideDependenciesManager}
                        packages={packagesStore.preparedPackages}
                        activePackage={this.activeManagerVersion}
                        packagesStore={packagesStore}
                    />
                :
                    null
                }
            </span>
        );
    }
}

Packages.propTypes = {
    packagesStore: PropTypes.object.isRequired,
    hardwareStore: PropTypes.object.isRequired,
    highlightedPackage: PropTypes.string
}

export default Packages;
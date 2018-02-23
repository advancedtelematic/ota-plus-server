import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader, DependenciesModal } from '../partials';
import { 
    PackagesTooltip, 
    PackagesCreateModal,
    PackagesFileUploaderModal, 
    PackagesHeader, 
    PackagesList,
    PackagesBlacklistModal,
    PackagesDependenciesManager
} from '../components/packages';
import { FlatButton } from 'material-ui';
import _ from 'underscore';

@observer
class Packages extends Component {
    @observable tooltipShown = false;
    @observable createModalShown = false;
    @observable fileUploaderModalShown = false;
    @observable fileDropped = null;
    @observable blacklistModalShown = false;
    @observable blacklistAction = {};
    @observable uploadToTuf = true;
    @observable copied = false;
    @observable dependenciesModalShown = false;
    @observable dependenciesManagerShown = false;
    @observable activeVersionFilepath = null;
    @observable activeManagerVersion = null;

    constructor(props) {
        super(props);
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
        this.showCreateModal = this.showCreateModal.bind(this);
        this.showFileUploaderModal = this.showFileUploaderModal.bind(this);
        this.hideCreateModal = this.hideCreateModal.bind(this);
        this.hideFileUploaderModal = this.hideFileUploaderModal.bind(this);
        this.showBlacklistModal = this.showBlacklistModal.bind(this);
        this.hideBlacklistModal = this.hideBlacklistModal.bind(this);
        this.onFileDrop = this.onFileDrop.bind(this);
        this.toggleTufUpload = this.toggleTufUpload.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
        this.showDependenciesModal = this.showDependenciesModal.bind(this);
        this.hideDependenciesModal = this.hideDependenciesModal.bind(this);
        this.showDependenciesManager = this.showDependenciesManager.bind(this);
        this.hideDependenciesManager = this.hideDependenciesManager.bind(this);
    }
    componentWillMount() {
        const { packagesStore } = this.props;
    }
    showTooltip(e) {
        if(e) e.preventDefault();
        this.tooltipShown = true;
    }
    hideTooltip(e) {
        if(e) e.preventDefault();
        this.tooltipShown = false;
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
    toggleTufUpload(e) {
        if(e) e.preventDefault();
        this.uploadToTuf = !this.uploadToTuf;
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
        const { packagesStore, hardwareStore, highlightedPackage, featuresStore, devicesStore, campaignsStore, alphaPlusEnabled } = this.props;
        return (
            <span ref="component">
                {packagesStore.overallPackagesCount === null || packagesStore.packagesFetchAsync.isFetching || packagesStore.packagesTufFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                :
                    packagesStore.overallPackagesCount ?
                        <span>
                            <PackagesHeader
                                showCreateModal={this.showCreateModal}
                                showFileUploaderModal={this.showFileUploaderModal}
                            />
                            <PackagesList 
                                showBlacklistModal={this.showBlacklistModal}
                                packagesStore={packagesStore}
                                onFileDrop={this.onFileDrop}
                                alphaPlusEnabled={alphaPlusEnabled}
                                highlightedPackage={highlightedPackage}
                                showDependenciesModal={this.showDependenciesModal}
                                showDependenciesManager={this.showDependenciesManager}
                            />
                            {packagesStore.overallPackagesCount && packagesStore.packagesFetchAsync.isFetching ? 
                                <div className="wrapper-loader">
                                    <Loader />
                                </div>
                            :  
                                null
                            }
                        </span>
                    :
                        <div className="wrapper-center">
                            <div className="page-intro">
                                <div>You haven't created any packages yet.</div>
                                <div>
                                    <FlatButton
                                        label="Add new package"
                                        type="button"
                                        className="btn-main"
                                        onClick={this.showCreateModal.bind(this, null)}
                                    />
                                </div>
                            </div>
                        </div>
                }
                <PackagesTooltip 
                    shown={this.tooltipShown}
                    hide={this.hideTooltip}
                />
                <PackagesCreateModal 
                    shown={this.createModalShown}
                    hide={this.hideCreateModal}
                    packagesStore={packagesStore}
                    fileDropped={this.fileDropped}
                    toggleTufUpload={this.toggleTufUpload}
                    uploadToTuf={this.uploadToTuf}
                    hardwareStore={hardwareStore}
                    devicesStore={devicesStore}
                />
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
import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Loader } from '../partials';
import { 
    PackagesTooltip, 
    PackagesCreateModal, 
    PackagesHeader, 
    PackagesList,
    PackagesBlacklistModal,
    PackagesStatsModal
} from '../components/packages';
import { FlatButton } from 'material-ui';

@observer
class Packages extends Component {
    @observable tooltipShown = false;
    @observable createModalShown = false;
    @observable fileDropped = null;
    @observable blacklistModalShown = false;
    @observable blacklistAction = {};
    @observable statsPackageName = null;
    @observable uploadToTuf = false;
    @observable statsModalShown = false;
    @observable statsPackageName = null;

    constructor(props) {
        super(props);
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
        this.showStatsModal = this.showStatsModal.bind(this);
        this.hideStatsModal = this.hideStatsModal.bind(this);
        this.showCreateModal = this.showCreateModal.bind(this);
        this.hideCreateModal = this.hideCreateModal.bind(this);
        this.showBlacklistModal = this.showBlacklistModal.bind(this);
        this.hideBlacklistModal = this.hideBlacklistModal.bind(this);
        this.changeSort = this.changeSort.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.changeType = this.changeType.bind(this);
        this.onFileDrop = this.onFileDrop.bind(this);
        this.toggleTufUpload = this.toggleTufUpload.bind(this);
    }
    showTooltip(e) {
        if(e) e.preventDefault();
        this.tooltipShown = true;
    }
    hideTooltip(e) {
        if(e) e.preventDefault();
        this.tooltipShown = false;
    }
    showStatsModal(name, e) {
        if(e) e.preventDefault();
        this.statsModalShown = true;
        this.statsPackageName = name;
    }
    hideStatsModal(e) {
        if(e) e.preventDefault();
        this.statsModalShown = false;
        this.statsPackageName = null;
    }
    showCreateModal(files, e) {
        if(e) e.preventDefault();
        this.createModalShown = true;
        this.fileDropped = (files ? files[0] : null);
    }
    toggleTufUpload(e) {
        if(e) e.preventDefault();
        this.uploadToTuf = !this.uploadToTuf;
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
    changeSort(sort, e) {
        if(e) e.preventDefault();
        this.props.packagesStore._preparePackages(sort);
    }
    changeFilter(filter) {
        this.props.packagesStore.fetchPackages(filter);
    }
    changeType(type) {
        this.props.packagesStore._preparePackages(this.props.packagesStore.packagesSort, type);
    }
    onFileDrop(files) {
        this.showCreateModal(files);
    }
    render() {

        const { packagesStore, hardwareStore, highlightedPackage } = this.props;
        return (
            <span ref="component">
                {packagesStore.overallPackagesCount === null && packagesStore.packagesFetchAsync.isFetching ?
                    <div className="wrapper-center">
                        <Loader />
                    </div>
                :
                    packagesStore.overallPackagesCount ?
                        <span>
                            <PackagesHeader
                                showCreateModal={this.showCreateModal}
                                packagesSort={packagesStore.packagesSort}
                                changeSort={this.changeSort}
                                packagesFilter={packagesStore.packagesFilter}
                                changeFilter={this.changeFilter}
                                changeType={this.changeType}
                            />
                            <PackagesList 
                                showBlacklistModal={this.showBlacklistModal}
                                packagesStore={packagesStore}
                                onFileDrop={this.onFileDrop}
                                highlightedPackage={highlightedPackage}
                                showStatsModal={this.showStatsModal}
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
                                <a href="#" onClick={this.showTooltip}>What is this?</a>
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
                />
                <PackagesBlacklistModal 
                    shown={this.blacklistModalShown}
                    hide={this.hideBlacklistModal}
                    blacklistAction={this.blacklistAction}
                    packagesStore={packagesStore}
                />
                <PackagesStatsModal
                    shown={this.statsModalShown}
                    hide={this.hideStatsModal}
                    packagesStore={packagesStore}
                    packageName={this.statsPackageName}
                />
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
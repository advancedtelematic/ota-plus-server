import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import _ from 'underscore';

@observer
class ListItemVersion extends Component {
    constructor(props) {
        super(props);
        this.handlePackageVersionClick = this.handlePackageVersionClick.bind(this);
    }
    handlePackageVersionClick() {
        const { showPackageDetails, version } = this.props;
        showPackageDetails(version);
    }
    isPackageBlacklisted(version) {
        const { packagesStore } = this.props;
        let isPackageBlacklisted = _.find(packagesStore.blacklist, (dev) => {
            return (dev.packageId.name === version.id.name) && (dev.packageId.version === version.id.version);
        });
        return isPackageBlacklisted ? isPackageBlacklisted : false;
    }
    render() {
        const { 
            packagesStore, 
            version, 
            queuedPackage, 
            installedPackage, 
        } = this.props;
        let blacklistedPackage = this.isPackageBlacklisted(version);
        let isSelected = version.filepath === packagesStore.expandedPackage.filepath;
        return (
            <li className={"software-panel__version" + (isSelected ? " software-panel__version--selected" : "")} id={isSelected ? "image-" + version.id.version.substring(0,8) + "-selected" : "image-" + version.id.version.substring(0,8)} onClick={this.handlePackageVersionClick}>
                <div className="software-panel__version-left">
                    <div className="software-panel__version-block">
                        <span className="software-panel__version-subtitle">Hash / version:</span> 
                        <span className="software-panel__version-value" id={"version-value-" + version.id.version.substring(0,8)}>{version.id.version}</span>
                    </div>
                    <div className="software-panel__version-block">
                        <span className="software-panel__version-subtitle">Created at:</span>
                        <span className="software-panel__version-value">{moment(version.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}</span>
                    </div>
                </div>
                <div className="software-panel__version-right">
                    {blacklistedPackage && version.id.version === installedPackage ?
                        <img className="software-panel__version-icon" src="/assets/img/icons/red_cross.svg" id={"image-blacklisted-and-installed-" + version.id.version.substring(0,8)} alt="Icon" />
                    :
                        blacklistedPackage ?
                            <img className="software-panel__version-icon" src="/assets/img/icons/ban_red.png" id={"image-blacklisted-" + version.id.version.substring(0,8)} alt="Icon" />
                        : version.filepath === queuedPackage ?
                            <i className="software-panel__version-icon software-panel__version-icon--queued fa fa-dot-circle-o fa-stack-2x" aria-hidden="true" id={"image-queued-" + version.id.version.substring(0,8)}></i>
                        : version.id.version === installedPackage ?
                            <img className="software-panel__version-icon" src="/assets/img/icons/green_tick.svg" id={"image-installed-" + version.id.version.substring(0,8)} alt="Icon" />
                        :
                            null
                    }
                </div>
            </li>
        );
    }
}

ListItemVersion.propTypes = {
    packagesStore: PropTypes.object.isRequired,
    version: PropTypes.object.isRequired,
    queuedPackage: PropTypes.string,
    installedPackage: PropTypes.string,
}

export default ListItemVersion;

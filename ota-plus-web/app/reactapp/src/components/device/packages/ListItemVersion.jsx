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
            <li className={isSelected ? " selected" : ""} id={isSelected ? "image-" + version.id.version.substring(0,8) + "-selected" : "image-" + version.id.version.substring(0,8)} onClick={this.handlePackageVersionClick}>
                <div className="left-box">
                    <div>
                        <span className="sub-title">Hash / version:</span> 
                        <span className="value" id={"version-value-" + version.id.version.substring(0,8)}>{version.id.version}</span>
                    </div>
                    <div>
                        <span className="sub-title">Created at:</span>
                        <span className="value">{moment(version.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}</span>
                    </div>
                </div>
                <div className="right-box">
                    {blacklistedPackage && version.id.version === installedPackage ?
                        <span className="blacklisted-installed" id={"image-blacklisted-and-installed-" + version.id.version.substring(0,8)}>
                            <img src="/assets/img/icons/red_cross.svg" alt="" />
                        </span>
                    :
                        blacklistedPackage ?
                            <span className="blacklisted" id={"image-blacklisted-" + version.id.version.substring(0,8)}>
                                <img src="/assets/img/icons/ban_red.png" alt="" />
                            </span>
                        : version.filepath === queuedPackage ?
                            <span className="fa-stack queued" id={"image-queued-" + version.id.version.substring(0,8)}>
                                <i className="fa fa-dot-circle-o fa-stack-2x" aria-hidden="true"></i>
                            </span>
                        : version.id.version === installedPackage ?
                            <span className="installed" id={"image-installed-" + version.id.version.substring(0,8)}>
                                <img src="/assets/img/icons/green_tick.svg" alt="" />
                            </span>                                            
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

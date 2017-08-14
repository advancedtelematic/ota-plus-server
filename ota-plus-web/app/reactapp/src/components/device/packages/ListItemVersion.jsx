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
        this.props.loadPackageVersionProperties(this.props.version);
        this.props.togglePackageVersion(this.props.version.id.version);
    }
    isPackageBlacklisted(version) {
        let isPackageBlacklisted = _.find(this.props.packagesStore.blacklist, (dev) => {
            return (dev.packageId.name === version.id.name) && (dev.packageId.version === version.id.version);
        });
        return isPackageBlacklisted ? isPackageBlacklisted : false;
    }
    render() {
        const { version, queuedPackage, installedPackage, expandedPack, loadPackageVersionProperties, selectedPackageVersion } = this.props;
        let blacklistedPackage = this.isPackageBlacklisted(version);
        let expandedPackUuid = expandedPack ? expandedPack.uuid : null;
        return (
            <li className={selectedPackageVersion === version.id.version ? "selected" : ""} id={version.uuid === expandedPackUuid ? "image-" + version.id.version.substring(0,8) + "-selected" : "image-" + version.id.version.substring(0,8)} onClick={this.handlePackageVersionClick}>
                <div className="left-box">
                      <div className="hash">
                        <span className="text">Hash / version:</span> <span className="value" id={"version-value-" + version.id.version.substring(0,8)}>{version.id.version}</span>
                      </div>
                      <div className="created_at">
                        <span className="text">Created at:</span> <span className="value">{moment(version.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}</span>
                      </div>
                      {version.inDirector ?
                        <div className="updated_at">
                            <span className="text">Updated at:</span> <span className="value">{moment(version.updatedAt).format("ddd MMM DD YYYY, h:mm:ss A")}</span>
                        </div>
                      :
                        null
                      }
                </div>
                <div className="right-box">
                    {blacklistedPackage && version.id.version === installedPackage ?
                        <span className="blacklisted-installed" id={"image-blacklisted-and-installed-" + version.id.version.substring(0,8)}>
                            <img src="/assets/img/icons/red_cross.png" alt="" />
                        </span>
                    :
                        blacklistedPackage ?
                            <span className="blacklisted" id={"image-blacklisted-" + version.id.version.substring(0,8)}>
                                <img src="/assets/img/icons/ban_red.png" alt="" />
                            </span>
                        :
                        version.id.version === queuedPackage || version.id.version === installedPackage ?
                            version.id.version === queuedPackage ?
                                <span className="fa-stack queued" id={"image-queued-" + version.id.version.substring(0,8)}>
                                    <i className="fa fa-dot-circle-o fa-stack-2x" aria-hidden="true"></i>
                                </span>
                            :
                                <span className="installed" id={"image-installed-" + version.id.version.substring(0,8)}>
                                    <img src="/assets/img/icons/check.png" alt="" />
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
    expandedPack: PropTypes.object,
    loadPackageVersionProperties: PropTypes.func.isRequired,
    togglePackageVersion: PropTypes.func.isRequired,
}

export default ListItemVersion;

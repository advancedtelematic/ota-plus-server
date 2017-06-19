import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';

@observer
class ListItemVersion extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { packagesStore, device, version, queuedPackage, installedPackage, isAutoInstallEnabled, packageVersion, loadPackageVersionProperties } = this.props;
        return (
            <li className={version.uuid === packageVersion.uuid ? "selected" : ""} id={version.uuid === packageVersion.uuid ? "image-" + version.id.version.substring(0,8) + "-selected" : "image-" + version.id.version.substring(0,8)} onClick={loadPackageVersionProperties.bind(this, version.uuid)}>
                <div className="left-box">
                      <div className="hash">
                        <span className="text">Hash / version:</span> <span className="value" id={"version-value-" + version.id.version.substring(0,8)}>{version.id.version}</span>
                      </div>
                      <div className="created_at">

                        <span className="text">Created at:</span> <span className="value">{moment(version.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}</span>
                      </div>
                </div>
                <div className="right-box">
                    {version.isBlackListed && version.id.version === installedPackage ?
                        <span className="blacklisted-installed" id={"image-blacklisted-and-installed-" + version.id.version.substring(0,8)}>
                            <img src="/assets/img/icons/red_cross.png" alt="" />
                        </span>
                    :
                        version.isBlackListed ?
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
    packageVersion: PropTypes.object.isRequired,
    loadPackageVersionProperties: PropTypes.func.isRequired,
}

export default ListItemVersion;

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
            <li className={version.uuid === packageVersion.uuid ? "selected" : ""} onClick={loadPackageVersionProperties.bind(this, version)}>
                <div className="left-box">
                      <div className="hash">
                        <span className="text">Hash / version:</span> <span className="value">{version.id.version}</span>
                      </div>
                      <div className="created_at">

                        <span className="text">Created at:</span> <span className="value">{moment(version.createdAt).format("ddd MMM DD YYYY, h:mm:ss A")}</span>
                      </div>
                </div>
                <div className="right-box">
                    {version.isBlackListed && version.id.version === installedPackage ? 
                        <span className="blacklisted-installed">
                            <img src="/assets/img/icons/red_cross.png" alt="" />
                        </span>
                    :
                        version.isBlackListed ?
                            <span className="blacklisted">
                                <img src="/assets/img/icons/ban_red.png" alt="" />
                            </span>
                        : 
                        version.id.version === queuedPackage || version.id.version === installedPackage ?
                            version.id.version === queuedPackage ?
                                <span className="fa-stack queued">
                                    <i className="fa fa-dot-circle-o fa-stack-2x" aria-hidden="true"></i>
                                </span>
                            :
                                <span className="installed">
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

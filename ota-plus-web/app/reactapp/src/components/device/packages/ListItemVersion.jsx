import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class ListItemVersion extends Component {
    constructor(props) {
        super(props);        
    }
    render() {
        const { version, queuedPackage, installedPackage, isAutoInstallEnabled, packageVersionUuid, loadPackageVersionProperties } = this.props;

        return (
            <li className={version.uuid === packageVersionUuid ? "selected" : ""} onClick={loadPackageVersionProperties.bind(this, version.uuid)}>
                <div className="left-box">
                      <div className="hash">
                        <span className="text">Hash:</span> <span className="value">XXXXXXXXXXXXXXXXXXXXXXXXXXX</span>
                      </div>
                      <div className="created_at">
                        <span className="text">Created at:</span> <span className="value">23.01.2017</span>
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
    isAutoInstallEnabled: PropTypes.bool.isRequired,
    packageVersionUuid: PropTypes.string,
    loadPackageVersionProperties: PropTypes.func.isRequired,
}

export default ListItemVersion;

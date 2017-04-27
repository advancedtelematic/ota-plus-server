import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class PackagesListItemVersion extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { version, setWizardData, isChosen } = this.props;
        return (
            <li className={version.isBlackListed ? "blacklist" : ""}>
                <div className="left-box" title={version.id.name}>
                    {version.id.name}
                </div>
                <div className="right-box">
                    <span title={version.id.version} className="version-name" id="wizard-package-version">
                        {version.id.version}
                    </span>
                    {version.isBlackListed ?
                        <button className="btn-blacklist" id="wizard-package-blacklisted"></button>
                    : 
                        <button className={"btn-checkbox" + (isChosen ? " checked" : "")} id="wizard-select-package" onClick={setWizardData.bind(this, version.id.name, version.id.version)}>
                            <i className="fa fa-check" aria-hidden="true"></i>
                        </button>
                    }
                </div>
            </li>
        );
    }
}

PackagesListItemVersion.propTypes = {
    version: PropTypes.object.isRequired,
    setWizardData: PropTypes.func.isRequired,
    isChosen: PropTypes.bool.isRequired
}

export default PackagesListItemVersion;
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class PackagesListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { pack, togglePackage, setWizardData, chosen } = this.props;
        return (
            <span>
                <div className={"item director" + (chosen && chosen.packageName === pack.packageName ? " chosen" : "")} id={"button-package-" + pack.packageName} onClick={togglePackage.bind(this, pack.packageName)} title={pack.packageName} ref="item">
                    <button className={"btn-checkbox" + (chosen && chosen.packageName === pack.packageName ? " checked" : "")} id={"wizard-select-package-" + pack.packageName} onClick={setWizardData.bind(this, pack)}>
                        <i className="fa fa-check" aria-hidden="true"></i>
                    </button>
                    <div className="info">
                        <span className="name">
                            {pack.packageName}
                        </span>
                        <div className="in-director">
                            <img src="/assets/img/icons/black/lock.svg" alt="Director" />
                        </div>
                    </div>
                </div>
            </span>
        );
    }
}

PackagesListItem.propTypes = {
    pack: PropTypes.object.isRequired,
    togglePackage: PropTypes.func.isRequired,
    setWizardData: PropTypes.func.isRequired,
}

export default PackagesListItem;
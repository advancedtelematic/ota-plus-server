import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';

@observer
class ListItem extends Component {
    constructor(props) {
        super(props);
        this.countInstalledOnEcus = this.countInstalledOnEcus.bind(this);
        this.countPackVersionsNumber = this.countPackVersionsNumber.bind(this);
    }
    countInstalledOnEcus() {
        let installedOnEcus = 0;
        _.each(this.props.pack.versions, (version, index) => {
            installedOnEcus += version.installedOnEcus;
        });
        return installedOnEcus;
    }
    countPackVersionsNumber() {
        return this.props.pack.versions.length;
    }
    render() {
        const { pack, togglePackage, showStatsModal } = this.props;
        let installedOnEcus = this.countInstalledOnEcus();
        let packVersionsNumber = this.countPackVersionsNumber();
        const directorBlock = (
            <span>
                <div className="in-director">
                    <img src="/assets/img/icons/black/lock.png" alt="Director" />
                </div>
                <div className="installed-on-ecus">
                    Installed on {installedOnEcus} Ecu(s)
                </div>
                <div className="package-versions-nr" id="package-versions-nr">
                    {packVersionsNumber === 1 ?
                        packVersionsNumber + " version"
                    :
                        packVersionsNumber + " versions"
                    }
                </div>
                <div className="btn-status" id="package-stats" onClick={showStatsModal.bind(this, pack.packageName)}>Stats</div>
            </span>
        );
        const legacyBlock = (
            <span>
                <div className="package-versions-nr" id="package-versions-nr">
                    {packVersionsNumber === 1 ?
                        packVersionsNumber + " version"
                    :
                        packVersionsNumber + " versions"
                    }
                </div>
            </span>
        );
        return (
            <button className="item" id={"button-package-" + pack.packageName} onClick={togglePackage.bind(this, pack.packageName)}>
                {pack.packageName}
                {pack.inDirector ?
                    directorBlock
                :
                    legacyBlock
                }
            </button>
        );
    }
}

ListItem.propTypes = {
    pack: PropTypes.object.isRequired,
    togglePackage: PropTypes.func.isRequired,
    showStatsModal: PropTypes.func.isRequired,
   
}

export default ListItem;
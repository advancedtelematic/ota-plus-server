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
        const { pack, togglePackage, hide } = this.props;
        let installedOnEcus = this.countInstalledOnEcus();
        let packVersionsNumber = this.countPackVersionsNumber();
        const directorBlock = (
            <div className="director">
                <div className="package-name">
                    {pack.packageName}
                </div> 
                <div className="in-director">
                    <img src="/assets/img/icons/black/lock.png" alt="Director" />
                </div>
                <div className="package-versions-nr" id="package-versions-nr">
                    {packVersionsNumber === 1 ?
                        packVersionsNumber + " version"
                    :
                        packVersionsNumber + " versions"
                    }
                </div>
                <div className="installed-on-ecus">
                    <span id={"package-" + pack.packageName + "-installed-on-ecus"}>
                        Installed on <span id={"package-" + pack.packageName + "-installed-on-ecus-count"}>{installedOnEcus}</span> Ecu(s)
                    </span>
                </div>
            </div>
        );
        const legacyBlock = (
            <div className="legacy">
                <div className="package-name">
                    {pack.packageName}
                </div>
                <div className="package-versions-nr" id="package-versions-nr">
                    {packVersionsNumber === 1 ?
                        packVersionsNumber + " version"
                    :
                        packVersionsNumber + " versions"
                    }
                </div>
            </div>
        );
        return (
            <div className={hide ? "item shadow" : "item"} id={"button-package-" + pack.packageName} onClick={togglePackage.bind(this, pack.packageName)}>
                {pack.inDirector ?
                    directorBlock
                :
                    legacyBlock
                }
            </div>
        );
    }
}

ListItem.propTypes = {
    pack: PropTypes.object.isRequired,
    togglePackage: PropTypes.func.isRequired
}

export default ListItem;
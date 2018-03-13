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
        const { pack, togglePackage, expandedPackageName } = this.props;
        let installedOnEcus = this.countInstalledOnEcus();
        let packVersionsNumber = this.countPackVersionsNumber();
        const directorBlock = (
            <div className="c-package__teaser director">
                <div className="c-package__name">
                    {pack.packageName}
                </div> 
                <div className="c-package__icon">
                    <img src="/assets/img/icons/black/lock.svg" alt="Director" />
                </div>
                <div className="c-package__versions-nr" id="package-versions-nr">
                    {packVersionsNumber === 1 ?
                        packVersionsNumber + " version"
                    :
                        packVersionsNumber + " versions"
                    }
                </div>
                <div className="c-package__installed">
                    <span id={"package-" + pack.packageName + "-installed-on-ecus"}>
                        Installed on <span id={"package-" + pack.packageName + "-installed-on-ecus-count"}>{installedOnEcus}</span> Ecu(s)
                    </span>
                </div>                
            </div>
        );
        return (
            expandedPackageName === pack.packageName ?
                <div className="c-package__item c-package__item--expanded item" id={"button-package-" + pack.packageName} onClick={togglePackage.bind(this, pack.packageName)}>
                    <div className="wrapper-center">
                        <img src="assets/img/icons/black/arrow-up.svg" alt="Icon" />
                    </div>
                </div>
            :
                <div className="c-package__item item" id={"button-package-" + pack.packageName} onClick={togglePackage.bind(this, pack.packageName)}>
                    {directorBlock}
                </div>
        );
    }
}

ListItem.propTypes = {
    pack: PropTypes.object.isRequired,
    togglePackage: PropTypes.func.isRequired
}

export default ListItem;
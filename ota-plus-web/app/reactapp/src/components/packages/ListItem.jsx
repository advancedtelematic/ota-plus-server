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
        const { pack, togglePackage } = this.props;
        let installedOnEcus = this.countInstalledOnEcus();
        let packVersionsNumber = this.countPackVersionsNumber();
        const directorBlock = (
            <div className="c-package__teaser director">
                <div className="c-package__name" id={`target_package_${pack.packageName}`}>
                    {pack.packageName}
                </div> 
                <div className="c-package__icon">
                    <img src="/assets/img/icons/black/lock.svg" alt="Director" />
                </div>
                <div className="c-package__versions-nr" id={`package_versions_count_${packVersionsNumber}`}>
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
                <div className="c-package__more-info">
                    More info
                </div>
            </div>
        );
        return (
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
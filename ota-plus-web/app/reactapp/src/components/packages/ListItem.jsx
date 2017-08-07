import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';

@observer
class ListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { pack, togglePackage, showStatsModal } = this.props;
        let installedOnEcus = 0;
        _.each(pack.versions, (version, index) => {
            installedOnEcus += version.installedOnEcus;
        });
        return (
            <button className="item" id={"button-package-" + pack.packageName} onClick={togglePackage.bind(this, pack.packageName)}>
                {pack.packageName}
                {pack.inDirector ?
                    <span>
                        <div className="in-director">
                            <img src="/assets/img/icons/black/lock.png" alt="Director" />
                        </div>
                        <div className="installed-on-ecus">
                            Installed on {installedOnEcus} Ecu(s)
                        </div>
                    </span>
                :
                    null
                }
                <div className="package-versions-nr" id="package-versions-nr">
                    {pack.versions.length === 1 ?
                        pack.versions.length + " version"
                    :
                        pack.versions.length + " versions"
                    }
                </div>
                {pack.inDirector ?
                    <div className="btn-status" id="package-stats" onClick={showStatsModal.bind(this, pack.packageName)}>Stats</div>
                :
                    null
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
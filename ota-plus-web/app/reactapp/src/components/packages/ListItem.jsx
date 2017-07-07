import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class ListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { pack, togglePackage } = this.props;
        return (
            <button className="item" id={"button-package-" + pack.packageName} onClick={togglePackage.bind(this, pack.packageName)}>
                {pack.packageName}
                {pack.inDirector ?
                    <div className="in-director">
                        <img src="/assets/img/icons/black/lock.png" alt="Director" />
                    </div>
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
            </button>
        );
    }
}

ListItem.propTypes = {
    pack: PropTypes.object.isRequired,
    togglePackage: PropTypes.func.isRequired,
   
}

export default ListItem;
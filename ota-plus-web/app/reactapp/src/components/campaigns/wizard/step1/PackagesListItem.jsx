import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class PackagesListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { pack, togglePackage } = this.props;
        return (
            <button className="item" id={"button-package-" + pack.packageName} onClick={togglePackage.bind(this, pack.packageName)} title={pack.packageName}>
                {pack.packageName}
            </button>
        );
    }
}

PackagesListItem.propTypes = {
    pack: PropTypes.object.isRequired,
    togglePackage: PropTypes.func.isRequired
}

export default PackagesListItem;
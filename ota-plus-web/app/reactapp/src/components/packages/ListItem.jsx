import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class ListItem extends Component {
    constructor(props) {
        super(props);
        this.showStatsModal = this.showStatsModal.bind(this);
    }
    showStatsModal(e) {
        if(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        this.props.showStatsModal(this.props.pack.packageName);
    }
    render() {
        const { pack, togglePackage } = this.props;
        return (
            <button className="item" id={"button-package-" + pack.packageName} onClick={togglePackage.bind(this, pack.packageName)}>
                {pack.packageName}
                {this.props.showStatsButton ? 
                    <div className="btn-status" id="package-stats" onClick={this.showStatsModal}>
                        Stats
                    </div>
                : '' }
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
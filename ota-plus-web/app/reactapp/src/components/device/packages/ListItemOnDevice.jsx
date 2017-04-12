import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class ListItemOnDevice extends Component {
    constructor(props) {
        super(props);
    }    
    render() {
        const { pack, showPackageBlacklistModal } = this.props;
        return (
            <button className="item ondevice" id={"ondevice-package-" + pack.id.name}>
                <div className="name">
                    {pack.id.name}
                </div>

                <div className="actions">
                    <div className="version">
                        v {pack.id.version}
                    </div>
                    {pack.isBlackListed ?
                        <button 
                            className="btn-blacklist edit" 
                            onClick={showPackageBlacklistModal.bind(this, pack.id.name, pack.id.version, 'edit')} 
                            title="Edit blacklisted package version" 
                            id={"button-edit-blacklisted-package-" + pack.id.name + "-" + pack.id.version}>
                        </button>
                    : 
                        <button 
                            className="btn-blacklist" 
                            onClick={showPackageBlacklistModal.bind(this, pack.id.name, pack.id.version, 'add')} 
                            title="Blacklist package version" 
                            id={"button-blacklist-package-" + pack.id.name + "-" + pack.id.version}>
                        </button>
                    }
                </div>
            </button>
        );
    }
}

ListItemOnDevice.propTypes = {
    pack: PropTypes.object.isRequired,
    showPackageBlacklistModal: PropTypes.func.isRequired,
}

export default ListItemOnDevice;
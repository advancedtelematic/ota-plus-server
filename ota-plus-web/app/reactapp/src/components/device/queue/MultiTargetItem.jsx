import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class MultiTargetITem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { item, hardwareId, updateId, cancelInstallation } = this.props;
        let hash = item.image.fileinfo.hashes.sha256;
        return (
            <li id={"queued-entry-" + hash} className="multi-target-entry">
                <div className="name">
                    Version hash: {hash}
                </div>

                <div className="itemactions">
                    <div className="version">
                        {hash}
                    </div>
                </div>

                <div className="desc">
                    <div>
                        Update identifier: {updateId}
                    </div>
                </div>
            </li>
        );
    }
}

MultiTargetITem.propTypes = {
}

export default MultiTargetITem;
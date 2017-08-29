import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class MultiTargetITem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { item, hardwareId, updateId, length } = this.props;
        let hash = item.image.fileinfo.hashes.sha256;
        return (
            <li id={"queued-entry-" + hash} className="multi-target-entry">
                <div className="desc">
                    <div>
                        Update ID {updateId}
                    </div>
                </div>

                <div className="result">
                    <div className="ecu">
                        ECU Serial: {hardwareId}
                    </div>
                    <div className="name">
                        Target: {hash}
                    </div>
                    <div className="length">
                        Length: {length}
                    </div>
                </div>
            </li>
        );
    }
}

MultiTargetITem.propTypes = {
}

export default MultiTargetITem;
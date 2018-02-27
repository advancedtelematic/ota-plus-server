import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class MultiTargetITem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { item, hardwareId, updateId, length, cancelMtuUpdate, inFlight, alphaPlusEnabled, showSequencer } = this.props;
        const hash = item.image.fileinfo.hashes.sha256;
        return (
            <li id={"queued-entry-" + hash} className={"multi-target-entry font-small" + (inFlight ? " pending" : "")}>
                <div className="desc">
                    Update ID <span id={"update-id-" + updateId}>{updateId}</span>
                </div>

                <div className="result">
                    <div className="left">
                        <div className="ecu">
                            <span id={"ecu-serial-title-" + updateId} className="title">
                                ECU Serial:
                            </span>
                            <span id={"ecu-serial-" + updateId}>
                                {hardwareId}
                            </span>
                        </div>
                        <div className="name">
                            <span id={"target-title-" + updateId} className="title">
                                Target:
                            </span>
                            <span id={"target-" + updateId}>
                                {hash}
                            </span>
                        </div>
                        <div className="length">
                            <span id={"length-title-" + updateId} className="title">
                                Length:
                            </span>
                            <span id={"length-" + updateId}>
                                {length}
                            </span>
                        </div>
                    </div>
                    <div className="right">
                        <div className="cancel">
                            {inFlight ?
                                <button id="pending" disabled>
                                    Pending <img src="/assets/img/icons/loading_dots.gif" alt="Icon" />
                                </button>
                            :
                                <button id="cancel-mtu" onClick={cancelMtuUpdate.bind(this, updateId)}>
                                    Cancel
                                </button>
                            }
                        </div>
                    </div>
                </div>
                {alphaPlusEnabled && inFlight ?
                    <a href="#" style={{'display': 'block', 'textAlign': 'center', 'marginTop': '15px'}} onClick={showSequencer.bind(this)}>
                        Live installation progress
                    </a>
                :
                    null
                }
            </li>
        );
    }
}

MultiTargetITem.propTypes = {
}

export default MultiTargetITem;
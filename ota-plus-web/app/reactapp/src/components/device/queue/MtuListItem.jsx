import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class MultiTargetITem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { item, hardwareId, updateId, status, length, cancelMtuUpdate, alphaPlusEnabled, showSequencer } = this.props;
        const hash = item.image.fileinfo.hashes.sha256;
        return (
            <li id={"queued-entry-" + hash} className="queue-modal__item">

                <div className="queue-modal__item-header">
                    <div className="queue-modal__item-update">
                        <div>
                            <span id={"update-id-title-" + updateId} className="queue-modal__item-title">
                                Update ID
                            </span>
                            <span id={"update-id-" + updateId}>
                                {updateId}
                            </span>
                        </div>
                        <div>
                            <button id="cancel-mtu" className="queue-modal__cancel-update" onClick={cancelMtuUpdate.bind(this, updateId)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                    <div className="queue-modal__item-process-status">
                        {status === "waiting" ?
                            <span>Queued, waiting for device to connect</span>
                        : status === "downloading" ?
                            <span>Downloading</span>
                        : status === "installing" ?
                            <span>Installing</span>
                        :
                            null
                        }
                        <img src="/assets/img/icons/points.gif" className="queue-modal__process-dots" alt="Icon" />
                    </div>
                </div>

                <div className="queue-modal__operations">
                    <div className="queue-modal__operation">
                        <div className="queue-modal__operation-info">
                            <div className="queue-modal__operation-info-block">
                                <span id={"ecu-serial-title-" + updateId} className="queue-modal__operation-info-title">
                                    ECU Serial:
                                </span>
                                <span id={"ecu-serial-" + updateId}>
                                    {hardwareId}
                                </span>
                            </div>
                            <div className="queue-modal__operation-info-block">
                                <span id={"target-title-" + updateId} className="queue-modal__operation-info-title">
                                    Target:
                                </span>
                                <span id={"target-" + updateId}>
                                    {hash}
                                </span>
                            </div>
                            <div className="queue-modal__operation-info-block">
                                <span id={"length-title-" + updateId} className="queue-modal__operation-info-title">
                                    Length:
                                </span>
                                <span id={"length-" + updateId}>
                                    {length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}

MultiTargetITem.propTypes = {
}

export default MultiTargetITem;
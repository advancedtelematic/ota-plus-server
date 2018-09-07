import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import moment from 'moment';
import InstallationEvents from '../InstallationEvents';

@inject("stores")
@observer
class MtuListItem extends Component {
	render() {
		const { item } = this.props;
		const { featuresStore, devicesStore } = this.props.stores;
		const { alphaPlusEnabled } = featuresStore;
		const { device } = devicesStore;
		const devicePrimaryEcu = device.directorAttributes.primary;
		const deviceSecondaryEcus = device.directorAttributes.secondary;
		return (
			<li className="queue-modal__item">
				<div className="queue-modal__item-header">
					<div className="queue-modal__item-update">
						<div>
							<span id={"update-id-title-" + item.updateId} className="queue-modal__item-title">
								Update ID
		                    </span>
							<span id={"update-id-" + item.updateId}>
								{item.updateId}
							</span>
						</div>
					</div>
					<div className="queue-modal__item-created">
						<span id={"received-at-title-" + item.updateId} className="queue-modal__item-title">
							Received at:
	                    </span>
						<span id={"received-at-" + item.updateId}>
							{moment(item.receivedAt).format("ddd MMM DD YYYY, h:mm:ss A")}
						</span>
					</div>
				</div>
				<div className="queue-modal__operations">
					{_.map(item.operationResult, (result, ecuSerial) => {
						const error = result.resultCode > 1 ? result : null;
						let hardwareId = null;
						if (devicePrimaryEcu.id === ecuSerial) {
							hardwareId = devicePrimaryEcu.hardwareId;
						}
						const serialFromSecondary = _.find(deviceSecondaryEcus, ecu => ecu.id === ecuSerial)
						if (serialFromSecondary) {
							hardwareId = serialFromSecondary.hardwareId;
						}

						return (
							<div className="queue-modal__operation" key={ecuSerial}>
								<div className="queue-modal__operation-info">
									<div className="queue-modal__operation-info-block">
										<span id={"ecu-serial-title-" + item.updateId} className="queue-modal__operation-info-title">
											ECU Serial:
			                            </span>
										<span id={"ecu-serial-" + item.updateId}>
											{ecuSerial}
										</span>
									</div>
									<div className="queue-modal__operation-info-block">
										<span id={"hardwareId-title-" + hardwareId} className="queue-modal__operation-info-title">
											Hardware id:
                                </span>
										<span id={"hardwareId-" + hardwareId}>
											{hardwareId}
										</span>
									</div>
									<div className="queue-modal__operation-info-block">
										<span id={"target-title-" + item.updateId} className="queue-modal__operation-info-title">
											Target:
			                            </span>
										<span id={"target-" + item.updateId}>
											{result.target}
										</span>
									</div>
									<div className="queue-modal__operation-info-block">
										<span id={"length-title-" + item.updateId} className="queue-modal__operation-info-title">
											Length:
			                            </span>
										<span id={"length-" + item.updateId}>
											{result.length}
										</span>
									</div>
									{alphaPlusEnabled ?
										<InstallationEvents
											updateId={item.updateId}
											error={error}
											queue={false}
										/>
										:
										null
									}

								</div>
								<div className="queue-modal__operation-status">
									<div className={`queue-modal__status-code ${!error ? 'queue-modal__status-code--success' : 'queue-modal__status-code--error'}`}>
										<span>Result code</span> <span className="queue-modal__status-code-value" id={"result-code-" + item.updateId}>{result.resultCode}</span>
									</div>
									<div className="queue-modal__status-text">
										<span id={"result-text-" + item.updateId}>{result.resultText}</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</li>
		);
	}
}

MtuListItem.propTypes = {
	stores: PropTypes.object
}

export default MtuListItem;
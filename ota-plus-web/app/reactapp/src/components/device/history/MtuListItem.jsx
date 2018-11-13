import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import moment from 'moment';
import InstallationEvents from '../InstallationEvents';
import Loader from "../../../partials/Loader";

@inject("stores")
@observer
class MtuListItem extends Component {
	render() {
		const { item, events } = this.props;
		const { devicesStore } = this.props.stores;
		const { device } = devicesStore;
		const devicePrimaryEcu = device.directorAttributes.primary;
		const deviceSecondaryEcus = device.directorAttributes.secondary;
        const errorDevice = item.resultCode > 1 ? item : null;
        return (
			<li className="overview-panel__item">
				<div className="overview-panel__item-header">
					<div className="overview-panel__item-update">
						<div>
							<span id={"update-id-title-" + item.updateId} className="overview-panel__item-title">
								Update ID
		                    </span>
							<span id={"update-id-" + item.updateId}>
								{item.updateId}
							</span>
						</div>
					</div>
					<div className="overview-panel__item-created">
						<span id={"received-at-title-" + item.updateId} className="overview-panel__item-title">
							Received at:
	                    </span>
						<span id={"received-at-" + item.updateId}>
							{moment(item.receivedAt).format("ddd MMM DD YYYY, h:mm A")}
						</span>
					</div>
				</div>
				<div className="overview-panel__operations">
					{_.map(item.operationResult, (result, ecuSerial) => {
						const errorECU = result.resultCode > 1 ? result : null;
						let hardwareId = null;
						if (devicePrimaryEcu.id === ecuSerial) {
							hardwareId = devicePrimaryEcu.hardwareId;
						}
						const serialFromSecondary = _.find(deviceSecondaryEcus, ecu => ecu.id === ecuSerial)
						if (serialFromSecondary) {
							hardwareId = serialFromSecondary.hardwareId;
						}

						return (
							<div className="overview-panel__operation" key={ecuSerial}>
								<div className="overview-panel__operation-info">
									<div className="overview-panel__operation-info-block">
										<span id={"ecu-serial-title-" + item.updateId} className="overview-panel__operation-info-title">
											ECU serial:
			                            </span>
										<span id={"ecu-serial-" + item.updateId}>
											{ecuSerial}
										</span>
									</div>
									<div className="overview-panel__operation-info-block">
										<span id={"hardwareId-title-" + hardwareId} className="overview-panel__operation-info-title">
											Hardware ID:
                                </span>
										<span id={"hardwareId-" + hardwareId}>
											{hardwareId}
										</span>
									</div>
									<div className="overview-panel__operation-info-block">
										<span id={"target-title-" + item.updateId} className="overview-panel__operation-info-title">
											Target:
			                            </span>
										<span id={"target-" + item.updateId}>
											{result.target}
										</span>
									</div>
                                    {result.length !== 0 &&
										<div className="overview-panel__operation-info-block">
											<span id={"length-title-" + item.updateId} className="overview-panel__operation-info-title">
												Length:
											</span>
											<span id={"length-" + item.updateId}>
												{result.length}
											</span>
										</div>
                                    }
									{events.length ?
                                        devicesStore.eventsFetchAsync.isFetching ?
                                            <div className="wrapper-center">
                                                <Loader/>
                                            </div>
                                            :

										<InstallationEvents
											updateId={item.updateId}
											error={errorECU}
											queue={false}
											events={events}
										/>
										:
										null
									}
								</div>
							  	<div className="overview-panel__operation-status">
								  	<div className={`overview-panel__status-code ${!errorECU ? 'overview-panel__status-code--success' : 'overview-panel__status-code--error'}`}>
									  	<span>Result code</span> <span className="overview-panel__status-code-value" id={"result-code-" + item.updateId}>{result.resultCode}</span>
								  	</div>
								  	<div className="overview-panel__status-text">
									  	<span id={"result-text-" + item.updateId}>{result.resultText}</span>
								  	</div>
							  	</div>
						  	</div>
					  	);
				  	})}
			  	</div>
				<div className="overview-panel__device-status">
					<div className={`overview-panel__status-code ${!errorDevice ? 'overview-panel__status-code--success' : 'overview-panel__status-code--error'}`}>
						<span>Result code</span> <span className="overview-panel__status-code-value" id={"result-code-" + item.updateId}>{item.resultCode}</span>
					</div>
					<div className="overview-panel__status-text">
						<span id={"result-text-" + item.resultCode}>{!errorDevice && "Installation successful"}</span>
					</div>
				</div>
			</li>
		);
	}
}

MtuListItem.propTypes = {
	stores: PropTypes.object
}

export default MtuListItem;
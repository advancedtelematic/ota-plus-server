import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import moment from 'moment';
import InstallationEvents from '../InstallationEvents';

@observer
class MtuListItem extends Component {
    render() {
    	const { item } = this.props;
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
									<InstallationEvents 
										updateId={item.updateId}
										error={error}
									/>
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
}

export default MtuListItem;
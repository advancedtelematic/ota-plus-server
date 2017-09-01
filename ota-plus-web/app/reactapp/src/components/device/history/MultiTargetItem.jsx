import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import moment from 'moment';

@observer
class MultiTargetItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
    	const { item } = this.props;
        return (
    		<li>
            	<div className="main-info">
					<div className="update-id">
						Update ID <span id={"update-id-" + item.updateId}>{item.updateId}</span>
					</div>
					<div className="created-at">
						Received at: <span id={"received-at-" + item.updateId}>{moment(item.receivedAt).format("ddd MMM DD YYYY, h:mm:ss A")}</span>
					</div>
				</div>
        		<div className="operation-results">
        			{_.map(item.operationResult, (result, ecuSerial) => {
        				return (
        					<div className="result" key={ecuSerial}>
		    					<div className="result-info">
									<div className="ecu-serial">
										ECU Serial: <span id={"ecu-serial-" + item.updateId}>{ecuSerial}</span>
									</div>
									<div className="target">
										Target: <span id={"target-" + item.updateId}>{result.target}</span>
									</div>
									<div className="length">
										Length: <span id={"length-" + item.updateId}>{result.length}</span>
									</div>
								</div>
		    					<div className="result-status">
									<div className={`code ${result.resultCode <=1 ? 'success' : 'error'}`}>
										<span>Result code</span> <span className="value" id={"result-code-" + item.updateId}>{result.resultCode}</span>
									</div>
									<div className="text">
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

MultiTargetItem.propTypes = {
}

export default MultiTargetItem;
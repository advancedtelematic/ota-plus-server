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
						Update ID {item.updateId}
					</div>
					<div className="created-at">
						Received at: {moment(item.receivedAt).format("ddd MMM DD YYYY, h:mm:ss A")}
					</div>
				</div>
        		<div className="operation-results">
        			{_.map(item.operationResult, (result, ecuSerial) => {
        				return (
        					<div className="result" key={ecuSerial}>
		    					<div className="result-info">
									<div className="ecu-serial">
										ECU Serial: {ecuSerial}
									</div>
									<div className="target">
										Target: {result.target}
									</div>
									<div className="length">
										Length: {result.length}
									</div>
								</div>
		    					<div className="result-status">
									<div className={`code ${result.resultCode <=1 ? 'success' : 'error'}`}>
										<span>Result code</span> <span className="value">{result.resultCode}</span>
									</div>
									<div className="text">
										{result.resultText}
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
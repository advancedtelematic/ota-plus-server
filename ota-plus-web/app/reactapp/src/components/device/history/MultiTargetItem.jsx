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
            	<div className="update-id">
            		Update id: {item.updateId}
        		</div>
        		<div className="created-at">        			
        			Created at: {moment(item.receivedAt).format("ddd MMM DD YYYY, h:mm:ss A")}
        		</div>
        		<div className="operation-results">
        			{_.map(item.operationResult, (result, ecuSerial) => {
        				return (
        					<div className="result" key={ecuSerial}>
		    					<div className="ecu-serial">
		    						ECU serial: {ecuSerial}
		    					</div>
		    					<div className="target">
		    						Target: {result.target}
		    					</div>
		    					<div className="length">
		    						Length: {result.length}
		    					</div>
		    					<div className="code">
		    						Result code: {result.resultCode}
		    					</div>
		    					<div className="text">
		    						Result text: {result.resultText}
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
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import ConnectorsItem from './Item';

@observer
class RightList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
    	let data = ['four', 'five', 'six']
        return (
            <div className="right-box">
                {_.map(data, (item, index) => {
                	return (
                		<ConnectorsItem 
                			key={index}
                			id={item}
                		/>
        			);
                })}
            </div>
        );
    }
}

export default RightList;
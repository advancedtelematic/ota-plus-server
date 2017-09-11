import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import ConnectorsItem from './Item';

@observer
class LeftList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
    	let data = ['one', 'two', 'three']
        return (
            <div className="left-box">
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

export default LeftList;
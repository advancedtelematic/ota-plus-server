import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class ListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { item, groupName, selectGroup } = this.props;
		return (
			<div className="list-item" onClick={selectGroup.bind(this, groupName)}>
                <div className="col">
                    {groupName}
                </div>
                <div className="col">
                    {item.totalDevices ?
                        item.totalDevices
                    :
                        0
                    }
                </div>
                <div className="col">
                    {item.connections ? 
                        <span>
                            {item.connections.max}/{item.connections.limit}
                            <div className={item.connections.trend}></div>
                        </span>
                    : 
                        0
                    }                    
                </div>
                <div className="col">
                    {item.bandwidth ? 
                        <span>
                            {item.bandwidth.connections.total}
                            <div className={item.connections.trend}></div>
                        </span>
                    : 
                        0
                    }                                
                </div>
                <div className="col">
                    {item.bandwidth ? 
                        <span>
                            {item.bandwidth.upload.total}
                            <div className={item.bandwidth.upload.trend}></div>
                        </span>
                    : 
                        0
                    }
                </div>
                <div className="col">
                    {item.bandwidth ? 
                        <span>
                            {item.bandwidth.download.total}
                            <div className={item.bandwidth.download.trend}></div>
                        </span>
                    : 
                        0
                    }
                </div>
                <div className="col">
                    {item.downtime ?
                        item.downtime
                    :
                        0
                    }
                </div>
                <div className="col">
                    {item.availability ?
                        item.availability
                    :
                        0
                    }
                </div>
                <div className="col">
                    {item.errors ? <img src="/assets/img/icons/red_cross.png" alt="Icon" /> : null}
                </div>
            </div>
        );
    }
}

export default ListItem;
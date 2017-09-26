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
                            <div className="value">
                                {item.connections.max}/{item.connections.limit}
                            </div>
                            <div className={item.connections.trend}></div>
                        </span>
                    : 
                        0
                    }                    
                </div>
                <div className="col">
                    {item.bandwidth ? 
                        <span>
                            <div className="value">
                                {item.bandwidth.connections.total}
                            </div>
                            <div className={item.connections.trend}></div>
                        </span>
                    : 
                        0
                    }                                
                </div>
                <div className="col">
                    {item.bandwidth ? 
                        <span>
                            <div className="value">
                                {item.bandwidth.upload.total}
                            </div>
                            <div className={item.bandwidth.upload.trend}></div>
                        </span>
                    : 
                        0
                    }
                </div>
                <div className="col">
                    {item.bandwidth ? 
                        <span>
                            <div className="value">
                                {item.bandwidth.download.total}
                            </div>
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
                    {item.errors ? 
                        <img src="/assets/img/icons/red_cross.png" alt="Icon" /> 
                    : item.warnings ?
                        <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                    :
                        null
                    }
                </div>
            </div>
        );
    }
}

export default ListItem;
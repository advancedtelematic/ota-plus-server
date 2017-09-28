import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';

@observer
class ListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { item, groupName, selectGroup, selectedGroup } = this.props;
		return (
			<div className={"list-item" + (selectedGroup === groupName ? " opened" : "")} onClick={item.url ? selectGroup.bind(this, groupName) : null}>
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
                    {!_.isEmpty(item.errors) ? 
                        <img src="/assets/img/icons/red_cross.png" alt="Icon" /> 
                    : !_.isEmpty(item.warnings) ?
                        <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                    :
                        "-"
                    }
                </div>
            </div>
        );
    }
}

export default ListItem;
import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { SlideAnimation } from '../../../utils';
import UpdateLog from './UpdateLog';

@observer
class ListItem extends Component {
    @observable logShown = false;
    constructor(props) {
        super(props);
        this.toggleLog = this.toggleLog.bind(this);
    }
    toggleLog() {
        this.logShown = !this.logShown;
    }
    render() {
        const { request, updateLog, packagesStore } = this.props;
        // request.cancelled= false;
        return (
            <li>
                <div className="name" title={request.packageId.name}>
                    {request.packageId.name}
                </div>

                <div className="itemactions">
                    <div className="icon">
                        <span className="fa-stack">
                            <i className="fa fa-circle fa-stack-1x"></i>
                            <i className={"fa fa-stack-1x " + (request.cancelled ? "fa-times-circle cancelled" : request.success ? "fa-check-circle success" : "fa-times-circle error")} aria-hidden="true"></i>
                        </span>
                    </div>
                    <div className="version" title={request.packageId.version}>
                        v {request.packageId.version}
                    </div>
                    <div className="status">
                        {request.cancelled ? 
                            <span>
                                cancelled
                            </span>
                        :
                            request.success ?
                                <span>
                                    installed
                                </span>
                            :
                                <span>
                                    not installed
                                </span>
                        }
                    </div>
                    <button 
                        disabled={!updateLog}
                        onClick={this.toggleLog}>
                        Log
                    </button>
                </div>
                <SlideAnimation changeDisplay={false}>
                    {updateLog && this.logShown ?
                        <UpdateLog 
                            request={request}
                            updateLog={updateLog}
                        />
                    :
                        null
                    }
                </SlideAnimation>
            </li>
        );
    }
}

ListItem.propTypes = {
    request: PropTypes.object.isRequired,
    updateLog: PropTypes.object,
    packagesStore: PropTypes.object.isRequired
}

export default ListItem;
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { Loader } from '../../../partials';
import { SlideAnimation } from '../../../utils';

@observer
class UpdateLog extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { request, updateLog } = this.props;
        const time = new Date(request.completionTime);
        const emptyLog = (
            <span>Log is empty</span>
        );
        return (
            <div className="log">
                <div className="desc">
                    {request.cancelled ? 
                        <span>Installation</span>
                    :
                        <span>Package</span>
                    }
                    &nbsp;
                    {request.success ?
                        ""
                    :
                        "not"
                    }
                    &nbsp;
                    installed on {time.toDateString() + ' ' + time.toLocaleTimeString()}
                </div>
                <div className="result">
                    {updateLog.resultText ?
                        updateLog.resultText
                    :
                        emptyLog
                    }
                </div>
            </div>
        );
    }
}

UpdateLog.propTypes = {
    request: PropTypes.object.isRequired,
    updateLog: PropTypes.object.isRequired
}

export default UpdateLog;
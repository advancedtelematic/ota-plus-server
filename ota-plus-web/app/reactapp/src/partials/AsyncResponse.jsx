import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class AsyncResponse extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { action, handledStatus, successMsg, errorMsg } = this.props;        
        return (
            <span>
                {action.status !== null && (handledStatus == "all" || handledStatus == action.status) ?
                    <div className={"alert " + (action.status == "success" ? "alert-success" : "alert-danger")}>
                        {action.status == "success" ? 
                            successMsg
                        : 
                            errorMsg ? 
                                errorMsg 
                            :
                                "An error occured. Please try again."
                        }
                    </div>
                : null}
            </span>
        );
    }
}

AsyncResponse.propTypes = {
    action: PropTypes.object.isRequired,
    handledStatus: PropTypes.string.isRequired,
    successMsg: PropTypes.string,
    errorMsg: PropTypes.string
}

export default AsyncResponse;
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class ListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { request, cancelInstallation } = this.props;
        return (
            <li id={"queued-entry-" + request.packageId.name}>
                <div className="name">
                    {request.packageId.name}
                </div>

                <div className="itemactions">
                    <div className="version">
                        {request.packageId.version}
                    </div>
                    <button onClick={cancelInstallation.bind(this, request.requestId)}>
                        Cancel
                    </button>
                </div>

                <div className="desc">
                    {request.status == 'InFlight' ?
                        <div>
                            Installation started on: {new Date(request.updatedAt).toDateString()} {new Date(request.updatedAt).toLocaleTimeString()}
                        </div>
                    :
                        null
                    }
                    <div>
                        Update identifier: {request.requestId}
                    </div>
                </div>
            </li>
        );
    }
}

ListItem.propTypes = {
    request: PropTypes.object.isRequired,
    cancelInstallation: PropTypes.func.isRequired
}

export default ListItem;
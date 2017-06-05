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
            <li id={"queued-entry-" + request.packageId.name} className={request.status == "InFlight" ? "in-flight" : null}>
                <div className="name">
                    {request.packageId.name}
                </div>

                <div className="itemactions">
                    <div className="version">
                        {request.packageId.version}
                    </div>
                    {request.status == 'InFlight' ?
                        <button disabled>
                            In progress <img src="/assets/img/icons/loading_dots.gif" alt="Icon" />
                        </button>
                    :
                        <button onClick={cancelInstallation.bind(this, request.requestId)}>
                            Cancel
                        </button>
                    }
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
                        Queued on: {request.createdAt}
                    </div>
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
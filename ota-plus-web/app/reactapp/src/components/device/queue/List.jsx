import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import { Loader } from '../../../partials';
import ListItem from './ListItem';

@observer
class List extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { cancelInstallation, packagesStore } = this.props;
        return (
            <ul className={"list queue" + (!packagesStore.deviceQueue.length ? " empty" : "")}>
                {packagesStore.packagesDeviceQueueFetchAsync.isFetching ?
                    <div className="wrapper-loader">
                        <Loader />
                    </div>
                :
                    packagesStore.deviceQueue.length ? 
                        _.map(packagesStore.deviceQueue, (request, index) => {
                            return (
                                <ListItem 
                                    request={request}
                                    cancelInstallation={cancelInstallation}
                                    key={index}
                                />
                            );
                        })
                    :
                        <div className="wrapper-center">
                            Installation queue is empty. <br />
                            Click on a package you want to install and 
                            select a version to add it to the queue.
                        </div>
                }
            </ul>
        );
    }
}

List.propTypes = {
    cancelInstallation: PropTypes.func.isRequired,
    packagesStore: PropTypes.object.isRequired
}

export default List;
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
        const { packagesStore, cancelInstallation } = this.props;
        const emptyQueue = (
            <div className="queue-empty-center">
                Installation queue is empty. <br />
                Click on a package you want to install and
                select a version to add it to the queue.
            </div>
        );
        return (
            <div>
                {packagesStore.packagesDeviceQueueFetchAsync.isFetching ?
                    <ul className={"list queue" + (!packagesStore.deviceQueue.length ? " empty" : "")}>
                        <div className="wrapper-loader">
                            <Loader />
                        </div>
                    </ul>
                :
                    packagesStore.deviceQueue.length ?
                        <ul className={"list queue font-small" + (!packagesStore.deviceQueue.length ? " empty" : "")}>
                            {_.map(packagesStore.deviceQueue, (request, index) => {
                                return (
                                    <ListItem
                                        request={request}
                                        cancelInstallation={cancelInstallation}
                                        key={index}
                                    />
                                );
                            })}
                        </ul>
                    :
                        emptyQueue
                }
            </div>
        );
    }
}
List.propTypes = {
    packagesStore: PropTypes.object.isRequired,
    cancelInstallation: PropTypes.func.isRequired,
}
export default List;
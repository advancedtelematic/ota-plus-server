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
        const { packagesStore } = this.props;
        return (
            <ul className={"list history" + (!packagesStore.deviceHistory.length ? " empty" : "")}>
                {packagesStore.packagesDeviceHistoryFetchAsync.isFetching || packagesStore.packagesDeviceUpdatesLogsFetchAsync.isFetching ?
                    <div className="wrapper-loader">
                        <Loader />
                    </div>
                :
                    packagesStore.deviceHistory.length ?
                        _.map(packagesStore.deviceHistory, (request, index) => {
                            const foundUpdateLog = _.findWhere(packagesStore.deviceUpdatesLogs, {updateId: request.updateId});
                            return (
                                <ListItem 
                                    request={request}
                                    updateLog={foundUpdateLog}
                                    packagesStore={packagesStore}
                                    key={index}
                                />
                            );
                        })
                    :
                        <div className="wrapper-center">
                            Installation history is empty. <br />
                            The installation of the queued packages will start 
                            automatically when your device connects.
                        </div>
                }
            </ul>
        );
    }
}

List.propTypes = {
    packagesStore: PropTypes.object.isRequired
}

export default List;
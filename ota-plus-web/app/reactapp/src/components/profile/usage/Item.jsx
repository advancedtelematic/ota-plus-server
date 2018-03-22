import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import { Loader } from '../../../partials';

@observer
class Item extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        const { userStore, fetch, date } = this.props;
        if(fetch.active.status === null && !fetch.active.isFetching) {
            const startTime = date;
            const startTimeTmp = moment(startTime);
            const endTimeTmp = moment(startTimeTmp).add(1, 'months');
            userStore.fetchActivatedDeviceCount(startTimeTmp, endTimeTmp);
            userStore.fetchActiveDeviceCount(startTimeTmp, endTimeTmp);
            userStore.fetchConnectedDeviceCount(startTimeTmp.format('YYYY'), startTimeTmp.format('MM'));
        }
    }
    render() {
        const {usage, fetch, date } = this.props;
        return (
            <li className="flex-row">
                <div className="flex-column-main">
                    {date.format('MMM YYYY')}
                </div>
                <div className="flex-column" id={`target_total_activated_devices_${usage.active}`}>
                    {fetch.active.isFetching ?
                        <Loader
                            size={20}
                            thickness={2.5}
                        />
                        :
                        usage.active
                    }
                </div>
                <div className="flex-column" id={`target_total_activated_devices_${usage.active}`}>
                    {fetch.activated.isFetching ?
                        <Loader
                            size={20}
                            thickness={2.5}
                        />
                        :
                        usage.activated
                    }
                </div>
                <div className="flex-column" id={`target_total_activated_devices_${usage.numberOfDevices}`}>
                    {fetch.connected.isFetching ?
                        <Loader
                            size={20}
                            thickness={2.5}
                        />
                        :
                        usage.connected.numberOfDevices
                    }
                </div>
            </li>
        );
    }
}

Item.propTypes = {
    usage: PropTypes.object.isRequired,
    fetch: PropTypes.object.isRequired,
    userStore: PropTypes.object.isRequired,
    date: PropTypes.object.isRequired,
};

export default Item;
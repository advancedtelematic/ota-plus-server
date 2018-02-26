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
        const { level, usage, fetch, date } = this.props;
        const className = 'item level' + level;
        return (
            <div className={className}>
                <div className="panel panel-grey">
                    <div className="panel-heading">
                        {date.format('MMM YYYY')}
                    </div>
                    <div className="panel-body">
                        <div className="wrapper-center inner">
                            <div className="count">
                                {fetch.active.isFetching ?
                                    <Loader 
                                        size={20}
                                        thickness={2.5}
                                    />
                                :
                                    usage.active
                                }
                            </div>
                            <div className="desc">
                                Total activated devices
                            </div>
                            <div className="count">
                                {fetch.activated.isFetching ?
                                    <Loader 
                                        size={20}
                                        thickness={2.5}
                                    />
                                :
                                    usage.activated
                                }
                            </div>
                            <div className="desc">
                                New devices activated this month
                            </div>
                            <div className="count">
                                {fetch.connected.isFetching ?
                                    <Loader 
                                        size={20}
                                        thickness={2.5}
                                    />
                                :
                                    usage.connected.numberOfDevices
                                }
                            </div>
                            <div className="desc">
                                Devices connected this month
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Item.propTypes = {
    usage: PropTypes.object.isRequired,
    fetch: PropTypes.object.isRequired,
    userStore: PropTypes.object.isRequired,
    date: PropTypes.object.isRequired,
    level: PropTypes.number.isRequired,
};

export default Item;
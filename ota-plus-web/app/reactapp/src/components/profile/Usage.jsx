import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import { UsageCarousel } from './usage';

const startTime = moment([2017,0,1]);
const currentTime = moment();
const monthsCount = currentTime.diff(startTime, 'months');
let months = [];
for(var i = 0; i <= monthsCount; i++) {
    const date = moment(startTime).add(i, 'months');
    months.push(date.format('YYYYMM'));
}

@observer
class Usage extends Component {
    constructor(props) {
        super(props);
        this.fetchUsage = this.fetchUsage.bind(this);
    }
    componentWillMount() {
        this.props.userStore._setUsageInitial(startTime, monthsCount);
        this.fetchUsage();
    }
    fetchUsage() {
        const { userStore } = this.props;
        for(var i = monthsCount; i >= monthsCount - 2; i--) {
            const startTimeTmp = moment(startTime).add(i, 'months');
            const endTimeTmp = moment(startTimeTmp).add(1, 'months');
            userStore.fetchActivatedDeviceCount(startTimeTmp, endTimeTmp);
            userStore.fetchActiveDeviceCount(startTimeTmp, endTimeTmp);
            userStore.fetchConnectedDeviceCount(startTimeTmp.format('YYYY'), startTimeTmp.format('MM'));
        }
    }
    render() {
        const { userStore } = this.props;
        return (
            <main id="usage">
                <div className="title">
                    <img src="/assets/img/icons/black/usage.png" alt=""/>
                    Usage
                </div>

                <hr />

                <div className="carousel-container">
                    <UsageCarousel
                        userStore={userStore}
                        months={months}
                    />
                </div>
            </main>
        );
    }
}

Usage.propTypes = {
    userStore: PropTypes.object
};

export default Usage;
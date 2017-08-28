import React, { Component, PropTypes } from 'react';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import _ from 'underscore';
import moment from 'moment';
import Item from './Item';
import NoHistoryItem from './NoHistoryItem';

@observer
class Carousel extends Component {
    @observable active = 0;
    @observable direction = '';

    constructor(props) {
        super(props);
        this.moveLeft = this.moveLeft.bind(this);
        this.moveRight = this.moveRight.bind(this);
    }
    generateElements() {
        const { userStore, months } = this.props;
        const inversedMonthUsageKeys = _.sortBy(months, (month) => {
            return month;
        }).reverse();
        let elements = [];
        const firstDate = moment(inversedMonthUsageKeys[inversedMonthUsageKeys.length - 1], 'YYYYMM');
        for (var i = this.active; i <= this.active + 2; i++) {
            const level = i - this.active;
            if (i < months.length) {
                const objKey = inversedMonthUsageKeys[i];
                const usage = {
                    activated: userStore.activatedDevices.get(objKey),
                    active: userStore.activeDevices.get(objKey),
                    connected: userStore.connectedDevices.get(objKey),
                };
                const fetch = {
                    activated: userStore.activatedDevicesFetchAsync.get(objKey),
                    active: userStore.activeDevicesFetchAsync.get(objKey),
                    connected: userStore.connectedDevicesFetchAsync.get(objKey),
                };
                const date = moment(objKey, 'YYYYMM');
                elements.push(
                    <Item 
                        key={i}
                        usage={usage}
                        fetch={fetch}
                        userStore={userStore}
                        date={date}
                        level={level}
                    />
                );
            } else {
                const date = moment(firstDate).subtract(i - inversedMonthUsageKeys.length + 1, 'months');
                elements.push(
                    <NoHistoryItem
                        key={i}
                        date={date}
                        level={level}
                    />
                );
            }
        }
        return elements;
    }
    moveLeft() {
        const { userStore, months } = this.props;
        if(this.active < months.length - 1)
            this.active = this.active + 1;
        this.direction = 'left';
    }
    moveRight() {
        const { userStore, months } = this.props;
        if(this.active > 0)
            this.active = this.active - 1;
        this.direction = 'right';
    }
    render() {
        const { userStore, months } = this.props;
        return (
            <div className="months-slider">
                <div className={"arrow arrow-left" + (this.active === months.length - 1 ? " disabled" : "")} onClick={this.moveLeft}>
                    <i className="fa fa-chevron-left"></i>
                </div>
                    <ReactCSSTransitionGroup
                        transitionName={this.direction}
                        transitionEnterTimeout={1000}
                        transitionLeaveTimeout={1000}>
                        {this.generateElements()}
                    </ReactCSSTransitionGroup>
                <div className={"arrow arrow-right" + (this.active === 0 ? " disabled" : "")} onClick={this.moveRight}>
                    <i className="fa fa-chevron-right"></i>
                </div>
            </div>
        );
    }
}

Carousel.propTypes = {
    userStore: PropTypes.object.isRequired,
    months: PropTypes.array.isRequired,
};

export default Carousel;
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import moment from 'moment';
import _ from 'underscore';

const activeColor = "#48DAD0";
const inActiveColor = "#F3F3F4";

@observer
class Barchart extends Component {
    render() {
        const { connections } = this.props;
        const currentDay = moment().format("MMM Do");
        const currentHour = moment().hour();
        const currentMinutes = moment().minutes();
        const nextDay = moment().add(1, 'days').format("MMM Do");
        return (
            <div className="bar-chart">
                <div className="br">
                    {_.map(connections.live, (count, hour) => {
                        let bgColor = hour < currentHour ? activeColor : inActiveColor;
                        let percentageFilled = (hour == currentHour) ? currentMinutes / 60 * 100 : 100;
                        let limit = connections.limit.split('.').join("");
                        return (
                            <div className={"bar" + (count === 0 ? " empty" : "")} 
                                 style={{
                                    height: count / limit * 100 + "%",
                                    backgroundColor: bgColor,
                                 }}
                                 key={hour}
                                 data-hour={hour}
                            >
                                {percentageFilled !== 100 ?
                                    <div className="bar-wrapper"
                                         style={{
                                            height: percentageFilled + "%",
                                            backgroundColor: activeColor,
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0
                                         }}>
                                    </div>
                                :
                                    null
                                }
                            </div>
                        );                                        
                    })}
                </div>
                <div className="period">
                    <div className="start">
                        0h
                    </div>
                    <div className="end">
                        23h
                    </div>
                </div>
                <div className="legends">
                    <ul className="value-legend">
                        <li>
                            <div className="title-box">value</div>
                            <div>value</div>
                        </li>
                        <li>
                            <div className="title-box">value</div>
                            <div>value</div>
                        </li>
                        <li>
                            <div className="title-box">value</div>
                            <div>value</div>
                        </li>
                    </ul>
                    <ul className="color-legend">
                        <li>
                            <div className="title-box">Reported</div>
                            <div className="color-box" style={{backgroundColor: activeColor}}></div> 
                        </li>
                        <li>
                            <div className="title-box">Forecast</div>
                            <div className="color-box" style={{backgroundColor: inActiveColor}}></div> 
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
};

export default Barchart;
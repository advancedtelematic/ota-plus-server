import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import moment from 'moment';
import _ from 'underscore';



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
                        let bgColor = hour < currentHour ? '#e7a539' : 'grey';
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
                                            backgroundColor: '#e7a539',
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0
                                         }}>
                                    </div>
                                :
                                    null
                                }
                                {hour % 3 === 0  ?
                                    <a href="#" className="anchor">
                                    </a>
                                :
                                    null
                                }
                            </div>
                        );                                        
                    })}
                    <a href="#" className="anchor">
                    </a>
                </div>                                    
                <div className="x-axis">
                    <div className="time">
                        <div className="value">
                            {currentDay}
                        </div>
                    </div>
                    <div className="time">
                        <div className="value">
                            03AM
                        </div>
                    </div>
                    <div className="time">
                        <div className="value">
                            06AM
                        </div>
                    </div>
                    <div className="time">
                        <div className="value">
                            09AM
                        </div>
                    </div>
                    <div className="time">
                        <div className="value">
                            12PM
                        </div>
                    </div>
                    <div className="time">
                        <div className="value">
                            03PM
                        </div>
                    </div>
                    <div className="time">
                        <div className="value">
                            06PM
                        </div>
                    </div>
                    <div className="time">
                        <div className="value">
                            09PM
                        </div>
                    </div>
                    <div className="time">
                        <div className="value">
                            {nextDay}
                        </div>
                    </div>
                </div>
                <div className="y-axis">
                    <div className="devices">
                        <div className="value" style={{'left': connections.limit.length > 3 ? '-28px' : '-20px'}}>
                            {connections.limit}
                        </div>
                    </div>
                    <div className="devices">
                        <div className="value" style={{'left': connections.limit.length > 3 ? '-28px' : '-20px'}}>
                            {(connections.limit.split('.').join("") / 2).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Barchart;
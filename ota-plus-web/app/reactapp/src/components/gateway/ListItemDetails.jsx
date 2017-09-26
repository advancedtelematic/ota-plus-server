import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import moment from 'moment';

const currentHour = moment().hour();
const currentMinutes = moment().minutes();
const currentDay = moment().format("MMM Do");
const nextDay = moment().add(1, 'days').format("MMM Do");


@observer
class ListItemDetails extends Component {
    constructor(props) {
        super(props);
        this.resizeAxis = this.resizeAxis.bind(this);
    }
    resizeAxis() {
        let anchors = document.getElementsByClassName('anchor');
        let timeElements = document.getElementsByClassName('time');
        let barEl = document.getElementsByClassName('bar')[0];
        let barElements = document.getElementsByClassName('bar');
        let xAxisContainer = document.getElementsByClassName('x-axis')[0];
        let leftPos = [];
        let leftPosReduced = [];
        let barsWidth = 0;
        _.each(anchors, (anchor, index) => {
            leftPos.push(anchor.getBoundingClientRect().left);
        });
        _.each(leftPos, (pos, index) => {
            leftPosReduced.push(pos - 15);
        });
        _.each(timeElements, (elem, index) => {
            elem.style.left = leftPosReduced[index] + "px";
        });
        _.each(barElements, (elem, index) => {
            barsWidth += elem.offsetWidth + 1;
        });
        xAxisContainer.style.width = barsWidth + "px";
    }
    componentDidMount() {
        window.addEventListener("resize", this.resizeAxis);
        this.resizeAxis();
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeAxis);
    }
    render() {
        const { item } = this.props;
		return (
            <div className="details">
                {!_.isEmpty(item) ?
                    <span>
                        <div className="top">
                            <div className="alerts">
                                <div className="name">Alerts</div>
                                {item.errors ? 
                                    _.map(item.errors, (error, index) => {
                                        return (
                                            <div className="message">
                                                <span className="icon">
                                                    <img src="/assets/img/icons/red_cross.png" alt="Icon" />
                                                </span>
                                                {error}
                                            </div>
                                        );
                                    })
                                :
                                    null
                                }
                                {item.warnings ? 
                                    _.map(item.warnings, (warning, index) => {
                                        return (
                                            <div className="message">
                                                <span className="icon">
                                                    <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                                                </span>
                                                {warning}
                                            </div>
                                        );
                                    })
                                :
                                    null
                                }
                            </div>
                            <div className="url">
                                {item.url}
                            </div>
                        </div>
                        <div className="bottom">
                            <div className="item">
                                <div className="name">Live connections</div>
                                <div className="br">
                                    {_.map(item.connections.live, (count, hour) => {
                                        let bgColor = hour < currentHour ? '#e7a539' : 'grey';
                                        let percentageFilled = hour == currentHour ? currentMinutes / 60 * 100 : 100;
                                        return (
                                            <div className={"bar" + (count === 0 ? " empty" : "")} 
                                                 style={{
                                                    height: count / item.connections.limit * 100 + "%",
                                                    backgroundColor: bgColor,
                                                    position: 'relative'
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
                            </div>
                            <div className="item">
                                <div className="data">
                                    <div className="name">Certificate rollover</div>
                                    <div className="field">expired: {item.expired}</div>
                                    <div className="field">soon expired: {item.expireSoon}</div>
                                    <div className="field">period: {item.rotation}</div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="data">
                                    <div className="name">Connections</div>
                                    <div className="field">provisioning: {item.bandwidth.connections.provisioning}</div>
                                    <div className="field">check: {item.bandwidth.connections.check}</div>
                                    <div className="field">update: {item.bandwidth.connections.update}</div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="data">
                                    <div className="name">Upload</div>
                                    <div className="field">provisioning: {item.bandwidth.upload.provisioning}</div>
                                    <div className="field">check: {item.bandwidth.upload.check}</div>
                                    <div className="field">update: {item.bandwidth.upload.update}</div>
                                </div>
                            </div>
                            <div className="item">
                                <div className="data">
                                    <div className="name">Download</div>
                                    <div className="field">provisioning: {item.bandwidth.download.provisioning}</div>
                                    <div className="field">check: {item.bandwidth.download.check}</div>
                                    <div className="field">update: {item.bandwidth.download.update}</div>
                                </div>
                            </div>
                        </div>
                    </span>
                :
                    <div className="wrapper-center">
                        Empty
                    </div>
                }
            </div>
        );
    }
}

export default ListItemDetails;
import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import moment from 'moment';
import GatewayStats from './Stats';
import BarChart from './Barchart';

@observer
class ListItemDetails extends Component {
    constructor(props) {
        super(props);
        this.resizeAxis = this.resizeAxis.bind(this);
        this.styleYAxis = this.styleYAxis.bind(this);
        this.resizeTopSection = this.resizeTopSection.bind(this);
        this.slugify = this.slugify.bind(this);
    }
    resizeAxis() {
        let selectedGroupName = this.slugify(this.props.selectedGroup);

        let anchors = document.querySelectorAll('.' + selectedGroupName + ' .anchor');
        let timeElements = document.querySelectorAll('.' + selectedGroupName + ' .time');
        let barEl = document.querySelectorAll('.' + selectedGroupName + ' .bar')[0];

        let barElements = document.querySelectorAll('.' + selectedGroupName + ' .bar');
        let xAxisContainer = document.querySelectorAll('.' + selectedGroupName + ' .x-axis')[0];
        let leftPos = [];
        let leftPosReduced = [];
        let barsWidth = 0;
        _.each(anchors, (anchor, index) => {
            leftPos.push(anchor.getBoundingClientRect().left);
        });

        let leftDetailsPadding = parseInt(window.getComputedStyle(document.querySelectorAll('.' + selectedGroupName + '.details')[0], null).getPropertyValue('padding-left'), 10);
        let leftItemPadding = parseInt(window.getComputedStyle(document.querySelectorAll('.' + selectedGroupName + ' .item')[1], null).getPropertyValue('padding-left'), 10);
        let barChartLeftPadding = parseInt(window.getComputedStyle(document.querySelectorAll('.' + selectedGroupName + ' .bar-chart')[0], null).getPropertyValue('padding-left'), 10);
        let firstItemWidth = document.querySelectorAll('.' + selectedGroupName + ' .item')[0].getBoundingClientRect().width;
        let substractValue = firstItemWidth + leftDetailsPadding + leftItemPadding + barChartLeftPadding;
        _.each(leftPos, (pos, index) => {
            switch(index) {
                case 0:
                    leftPosReduced.push(pos - substractValue);
                    break;
                default:
                    leftPosReduced.push(pos - substractValue - 1);
                    break;
            }
        });
        _.each(timeElements, (elem, index) => {
            elem.style.left = leftPosReduced[index] + "px";
        });
        _.each(barElements, (elem, index) => {
            barsWidth += elem.offsetWidth + 1;
        });

        xAxisContainer.style.width = barsWidth + "px";
    }
    styleYAxis() {
        let selectedGroupName = this.slugify(this.props.selectedGroup);

        let devicesYAxis = document.querySelectorAll('.' + selectedGroupName + ' .devices');
        let yAxisHeight = document.querySelectorAll('.' + selectedGroupName + ' .y-axis')[0].getBoundingClientRect().height;
        _.each(devicesYAxis, (deviceCount, index) => {
            deviceCount.style.height = yAxisHeight / 2 + "px";
        });
    }
    componentDidMount() {
        window.addEventListener("resize", this.resizeAxis);
        window.addEventListener("resize", this.resizeTopSection);
        this.resizeAxis();
        this.styleYAxis();
        this.resizeTopSection();
    }
    resizeTopSection() {
        let selectedGroupName = this.slugify(this.props.selectedGroup);

        let leftPos = document.querySelectorAll('.' + selectedGroupName + ' #certificate-rollover')[0].getBoundingClientRect().left;
        document.querySelectorAll('.' + selectedGroupName + ' .top')[0].style.marginLeft = leftPos + "px";
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeAxis);
        window.removeEventListener("resize", this.resizeTopSection);
    }
    slugify(text) {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
    }
    render() {        
        const { item, selectedGroup } = this.props;        
		return (
            <div className={"details " + this.slugify(selectedGroup)}>
                {!_.isEmpty(item) ?
                    <span>
                        <div className="top">
                            <div className="alerts">
                                <div className="name">Alerts</div>
                                {!_.isEmpty(item.warnings) ? 
                                    _.map(item.warnings, (warning, index) => {
                                        return (
                                            <div className="message" key={index}>
                                                <span className="icon">
                                                    <img src="/assets/img/icons/warning.svg" alt="Icon" />
                                                </span>
                                                {warning}
                                            </div>
                                        );
                                    })
                                :
                                    null
                                }
                                {!_.isEmpty(item.errors) ? 
                                    _.map(item.errors, (error, index) => {
                                        return (
                                            <div className="message" key={index}>
                                                <span className="icon">
                                                    <img src="/assets/img/icons/red_cross.svg" alt="Icon" />
                                                </span>
                                                {error}
                                            </div>
                                        );
                                    })
                                :
                                    null
                                }
                                {_.isEmpty(item.warnings) && _.isEmpty(item.errors) ?
                                    <div className="message">
                                        <span className="icon">
                                            <img src="/assets/img/icons/green_tick.svg" alt="Icon" />
                                        </span>
                                        none reported!
                                    </div>
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
                                <div className="data">
                                    <div className="name" id="certificate-rollover">Certificate rollover</div>
                                    <div className="field">
                                        <span className="text">period: </span>
                                        <span className="value">{item.certificateRollover.rotation}</span>
                                    </div>
                                    <div className="field">
                                        <span className="text">soon expired: </span>
                                        <span className="value">{item.certificateRollover.expireSoon}</span>
                                    </div>
                                    <div className="field">
                                        <span className="text">expired: </span>
                                        <span className="value">{item.certificateRollover.expired}</span>
                                    </div>
                                </div>
                                <div className="stats">
                                    <GatewayStats 
                                        data={item.certificateRollover.stats}
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="data">
                                    <div className="name">Live connections</div>
                                    <div className="field">
                                        <span className="text">limit: </span>
                                        <span className="value">{item.connections.limit}</span>
                                    </div>
                                    <div className="field">
                                        <span className="text">peak: </span>
                                        <span className="value">{item.connections.max}</span>
                                    </div>
                                    <div className="field">
                                        <span className="text">avg: </span>
                                        <span className="text">{item.connections.avg}</span>
                                    </div>
                                </div>
                                <BarChart
                                    connections={item.connections}
                                />
                                <div className="stats">
                                    <ul>
                                        <li>
                                            <div className="color-box" style={{backgroundColor: "#e7a539"}}></div> 
                                            <div className="title-box">reported</div>
                                        </li>
                                        <li>
                                            <div className="color-box" style={{backgroundColor: "grey"}}></div> 
                                            <div className="title-box">forecast</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="item">
                                <div className="data">
                                    <div className="name">Connections</div>
                                    <div className="field">
                                        <span className="text">provisioning: </span>
                                        <span className="value">{item.bandwidth.connections.provisioning}</span>
                                    </div>
                                    <div className="field">
                                        <span className="text">check: </span>
                                        <span className="value">{item.bandwidth.connections.check}</span>
                                    </div>
                                    <div className="field">
                                        <span className="text">update:</span>
                                        <span className="value">{item.bandwidth.connections.update}</span>
                                    </div>
                                </div>
                                <div className="stats">
                                    <GatewayStats
                                        data={item.bandwidth.connections.stats}
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="data">
                                    <div className="name">Upload</div>
                                    <div className="field">
                                        <span className="text">provisioning:</span> 
                                        <span className="value">{item.bandwidth.upload.provisioning}</span>
                                    </div>
                                    <div className="field">
                                        <span className="text">check:</span>
                                        <span className="value">{item.bandwidth.upload.check}</span>
                                    </div>
                                    <div className="field">
                                        <span className="text">update:</span>
                                        <span className="value">{item.bandwidth.upload.update}</span>
                                    </div>
                                </div>
                                <div className="stats">
                                    <GatewayStats
                                        data={item.bandwidth.upload.stats}
                                    />
                                </div>
                            </div>
                            <div className="item">
                                <div className="data">
                                    <div className="name">Download</div>
                                    <div className="field">
                                        <span className="text">provisioning:</span>
                                        <span className="value">{item.bandwidth.download.provisioning}</span>
                                    </div>
                                    <div className="field">
                                        <span className="text">check:</span>
                                        <span className="value">{item.bandwidth.download.check}</span>
                                    </div>
                                    <div className="field">
                                        <span className="text">update:</span>
                                        <span className="value">{item.bandwidth.download.update}</span>
                                    </div>
                                </div>
                                <div className="stats">
                                    <GatewayStats
                                        data={item.bandwidth.download.stats}
                                    />
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
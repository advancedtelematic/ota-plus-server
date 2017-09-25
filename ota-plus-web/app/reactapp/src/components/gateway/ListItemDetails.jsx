import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';
import moment from 'moment';

const currentHour = moment().hour();
const currentMinutes = moment().minutes();

@observer
class ListItemDetails extends Component {
    constructor(props) {
        super(props);
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
                                    let bgColor = hour <= currentHour ? '#e7a539' : 'grey';
                                    let percentageFilled = hour - currentHour === 1 ? currentMinutes / 60 * 100 : 100;
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
                                        </div>
                                    );
                                })}
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
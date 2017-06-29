import React, { Component, PropTypes } from 'react';
import { observer, observable } from 'mobx-react';
import _ from 'underscore';

@observer
class OverlayItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { hardware, mainLevel } = this.props;
        let result;
        if (this.props.mainLevel) {
            if (!_.isUndefined(hardware.id) && (!_.isUndefined(hardware.description) || !_.isUndefined(hardware.class))) {
                result = (
                    <li>
                        <div className="header">
                            <span className="name">
                                {hardware.description ? hardware.description : hardware.class}
                            </span>
                        </div>
                        <div>
                            <div className="details-header">
                                <span>
                                    <strong>General Informations</strong>
                                </span>
                            </div>
                            <div className="row">
                                <div className="col-md-6 col-md-offset-1">
                                    <table className="table">
                                        <tbody>
                                            {_.map(hardware, function(d, i) {
                                                if(i !== 'children' && typeof(hardware[i]) !== 'object') {
                                                    return (
                                                        <tr key={i}>
                                                            <th>{i}:</th>
                                                            <td>{d}</td>
                                                        </tr>
                                                    );
                                                } else if(typeof(hardware[i]) === 'object') {
                                                    {_.map(hardware[i], function(dd, ii) {
                                                        return (
                                                            <tr key={ii}>
                                                                <th>{ii}:</th>
                                                                <td>{dd}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                }
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <ul>
                            <OverlayItem
                              hardware={hardware.children}
                              mainLevel={false}
                            />
                        </ul>
                    </li>
                );
            } else {
                result = (
                    <div className="text-center center-xy padding-15">
                          This device hasn’t reported any information about
                          its hardware or system components yet.
                    </div>
                );
            }
        } else {
            result = (
                <li>
                    {_.map(hardware, function(child, i) {
                        if(!_.isUndefined(child.id) && (!_.isUndefined(child.description) || !_.isUndefined(child.class))) {
                            return (
                                <span key={"components-list-menu-" + child['id-nr'] + "-" + child.class}>
                                    <div className="header">
                                        <span className="name">
                                            {!_.isUndefined(child.description) ? child.description : child.class}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="details-header">
                                            <span>
                                                <strong>General Informations</strong>
                                            </span>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 col-md-offset-1">
                                                <table className="table">
                                                    <tbody>
                                                        {_.map(child, function(d, i) {
                                                            let res;
                                                            if(i !== 'children' && typeof(child[i]) !== 'object') {
                                                                return (
                                                                    <tr key={i}>
                                                                        <th>{i}:</th>
                                                                        <td>{d}</td>
                                                                    </tr>
                                                                );
                                                            } else if(i !== 'children' && typeof(child[i]) === 'object') {
                                                                return _.map(child[i], function(dd, ii) {
                                                                    return (
                                                                        <tr key={ii}>
                                                                            <th>{ii}:</th>
                                                                            <td>{dd}</td>
                                                                        </tr>
                                                                    );
                                                                })
                                                            }
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    {!_.isUndefined(child.children) && typeof child.children === 'object' ? 
                                        <ul>
                                            <OverlayItem
                                                hardware={child.children}
                                                mainLevel={false}
                                            />
                                        </ul>
                                    : null}
                                </span>
                            );
                        } else {
                            return false;
                        }
                    })}
                </li>
            );
        }
        return (
            result
        );
    }
}

OverlayItem.propTypes = {
    hardware: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
    mainLevel: PropTypes.bool.isRequired,
}

export default OverlayItem;

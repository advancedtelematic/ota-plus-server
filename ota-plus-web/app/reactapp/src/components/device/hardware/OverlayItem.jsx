import React, { Component, PropTypes } from 'react';
import { observer, observable } from 'mobx-react';
import _ from 'underscore';

@observer
class OverlayItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { data, mainLevel } = this.props;
        let result;
        if (this.props.mainLevel) {
            if (!_.isUndefined(data.id) && (!_.isUndefined(data.description) || !_.isUndefined(data.class))) {
                result = (
                    <li>
                        <div className="header">
                            <span className="name">
                                {data.description ? data.description : data.class}
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
                                            {_.map(data, function(d, i) {
                                                if(i !== 'children' && typeof(data[i]) !== 'object') {
                                                    return (
                                                        <tr key={i}>
                                                            <th>{i}:</th>
                                                            <td>{d}</td>
                                                        </tr>
                                                    );
                                                } else if(typeof(data[i]) === 'object') {
                                                    {_.map(data[i], function(dd, ii) {
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
                              data={data.children}
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
                    {_.map(data, function(child, i) {
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
                                                data={child.children}
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

OverlayItem.propTypes = {}

export default OverlayItem;

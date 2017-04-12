import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import _ from 'underscore';

@observer
class Overlay extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { hardware, hideDetails } = this.props;
        let general = [];
        let details = _.map(hardware, (data, index) => {
            if(index !== 'children') {
                let result;
                if(typeof data === 'object') {
                    result = _.map(data, (d, i) => {
                        return (
                            <tr key={i}>
                                <th>{i}:</th>
                                <td>{d}</td>
                            </tr>
                        );
                    });
                
                    return (
                        <div key={index}>
                            <div className="details-header">
                                <span>
                                    <strong>{index}</strong>
                                </span>
                            </div>
                            <div className="row">
                                <div className="col-md-6 col-md-offset-1">
                                    <table className="table">
                                        <tbody>
                                            {result}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    );
                } else if(index !== 'id-nr') {
                    general.push(
                        <tr key={index}>
                            <th>{index}:</th>
                            <td>{data}</td>
                        </tr>
                    );
                }
            }
        }, this);
            
        return (
            <div id="hardware-overlay">
                <div className="details">
                    <span className="title">
                        OVERVIEW
                    </span>
            
                    <button className="btn-close-hardware" onClick={hideDetails}>
                        <img src="/assets/img/icons/back.png" className="img-responsive" alt=""/>
                    </button>
            
                    <div className="header">
                        <img src="/assets/img/icons/chip.png" alt="" style={{width: '90px'}}/> <br /><br />
            
                        <span className="name">
                            {hardware.product ? 
                                hardware.product 
                            : 
                                hardware.description ? 
                                    hardware.description 
                                : 
                                    hardware.class
                            }
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
                                        {general}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {details}
                </div>
            </div>
        );
    }
}

Overlay.propTypes = {
    hardware: PropTypes.object.isRequired,
    hideDetails: PropTypes.func.isRequired
}

export default Overlay;
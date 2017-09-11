import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

@observer
class Item extends Component {
    @observable actionsShown = false;

    constructor(props) {
        super(props);
        this.toggleActions = this.toggleActions.bind(this);
}
    toggleActions() {
        this.actionsShown = !this.actionsShown;
        console.log('toggle')
    }
    render() {
        const { id } = this.props;
        return (
            <div className={"item " + (id === "five" ? "error" : "")}>
                <canvas id={"item-canvas-" + id} className="item-canvas"></canvas>
                <div className="title">
                    <span>Device XYZ</span>
                    <span className="bars">
                        <i className="fa fa-bars" onClick={this.toggleActions}></i>
                    </span>
                </div>
                <div className="details">
                    <div className="version">
                        <span className="text">Version:</span>
                        <span className="value">v.1.03</span>
                    </div>
                    <div className="hash">
                        <span className="text">Hash:</span>
                        <span className="value">DG45FFT6776H5G3RR</span>
                    </div>
                    <div className="created">
                        <span className="text">Created:</span>
                        <span className="value">Time</span>
                    </div>
                    <div className="vendor">
                        <span className="text">Vendor:</span>
                        <span className="value">XYZ</span>
                    </div>                    
                </div> 
                {this.actionsShown ?
                    <div className="actions">
                        <div className="action-item">Revoke</div>
                        <div className="action-item">Expire</div>
                        <div className="action-item">Delegate</div>
                        <div className="action-item">Rotate</div>
                    </div>
                :
                    null
                }               
            </div>
        );
    }
}

export default Item;
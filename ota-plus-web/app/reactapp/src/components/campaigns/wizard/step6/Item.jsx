import React, {Component} from 'react';
import _ from 'underscore';

export default class Item extends  Component {
    constructor(){
        super()
    }

    render() {
        const { value, selectSlot, selectedElement, moveElement, column, row } = this.props;
        return (
            <div className="item">
                <div className="entry-point"
                    onClick={_.isNull(selectedElement) ? selectSlot.bind(this, {column, row, value}) : null}
                />
                <div className="info">
                    <div className="hardware-id">
                        {value.hardwareId}
                    </div>
                    <div className="pack-name">
                        {value.name}
                    </div>
                    <div className="update-from">
                        From: {value.from}
                    </div>
                    <div className="update-to">
                        To: {value.to}
                    </div>
                </div>
                <div className="exit-nodes">
                    <div className="success"
                        onClick={!_.isNull(selectedElement) ? moveElement.bind(this, {column, row, value}) : null}
                    ></div>
                    <div className="failure"></div>
                </div>
            </div>
        );
    }
}
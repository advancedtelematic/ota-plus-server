import React, {Component} from 'react';
import _ from 'underscore';

export default class Item extends  Component {
    constructor(){
        super()
    }

    render() {
        const { value, selectSlot, selectedElement, moveElement, column, row, deselectSlot } = this.props;
        return (
            <div className="item" onClick={_.isNull(selectedElement) ? selectSlot.bind(this, {column, row, value}) : deselectSlot}>
                <div className="entry-point"/>
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
                    <div className="success"/>
                    <div className="failure"></div>
                </div>
            </div>
        );
    }
}
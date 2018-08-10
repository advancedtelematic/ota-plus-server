import React, {Component} from 'react';
import {observable} from "mobx"
import {observer} from 'mobx-react';

const populateArray = (min, max) => {
    const array = [];
    for(let i = min; i < max; i++) {
        array.push(i)
    }
    return array;
};

const timeArrays = {
    "hours": populateArray(0,24),
    "minutes": populateArray(0,60),
    "seconds": populateArray(0,60)
};

@observer
export default class TimePicker extends Component {
    @observable selectedType = null;
    @observable selectedTimeValue = {
        "hours": '00',
        "minutes": '00',
        "seconds": '00',
    };

    showOptions(type) {
        this.selectedType = type;
    }

    selectOption(type, e) {
        this.selectedTimeValue[type] = e.target.value;
        this.selectedType = null;
        this.props.onValid(this.selectedTimeValue);
    }

    render() {
        let {hours, minutes, seconds} = this.selectedTimeValue;

        const select = (type) => {
            return (
                type === this.selectedType?
                    <select className={`c-time-picker_${this.selectedType}`} onChange={this.selectOption.bind(this, this.selectedType)}>
                        {timeArrays[this.selectedType].map((value, key) => {
                            return (
                                <option value={value} key={key}>
                                    {value}
                                </option>
                            )
                        })}
                    </select> : null
            );
        };

        return (
            <div className="c-time-picker">
                <div className="c-time-picker__time-value">
                    <div className="c-time-picker__hours" onClick={this.showOptions.bind(this, 'hours')}>
                        {hours}
                        :
                        {select('hours')}
                    </div>
                    <div className="c-time-picker__minutes" onClick={this.showOptions.bind(this, 'minutes')}>
                        {minutes}
                        :
                        {select('minutes')}
                    </div>
                    <div className="c-time-picker__seconds" onClick={this.showOptions.bind(this, 'seconds')}>
                        {seconds}
                        {select('seconds')}
                    </div>
                </div>
            </div>
        )
    }
}
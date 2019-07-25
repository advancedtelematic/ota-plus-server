/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

const populateArray = (min, max) => {
  const array = [];
  for (let i = min; i < max; i += 1) {
    array.push(i);
  }
  return array;
};

const timeArrays = {
  hours: populateArray(0, 24),
  minutes: populateArray(0, 60),
  seconds: populateArray(0, 60),
};

@observer
class TimePicker extends Component {
  @observable selectedType = null;

  @observable selectedTimeValue = {
    hours: '00',
    minutes: '00',
    seconds: '00',
  };

  static propTypes = {
    id: PropTypes.string,
    defaultValue: PropTypes.string,
    onValid: PropTypes.func,
  };

  showOptions = (type) => {
    this.selectedType = type;
  };

  selectOption = (type, e) => {
    const { onValid } = this.props;
    this.selectedTimeValue[type] = e.target.value;
    this.selectedType = null;

    onValid(this.selectedTimeValue);
  };

  render() {
    const { hours, minutes, seconds } = this.selectedTimeValue;
    const { id, defaultValue } = this.props;
    const times = defaultValue.split(':');

    const select = type => (type === this.selectedType ? (
      <select className={`c-time-picker_${this.selectedType}`} onChange={this.selectOption.bind(this, this.selectedType)}>
        {timeArrays[this.selectedType].map((value, key) => (
          <option value={value} key={key}>
            {value}
          </option>
        ))}
      </select>
    ) : null);
    return (
      <div className="c-time-picker" id={id}>
        <div className="c-time-picker__time-value" id={`${id}-value`}>
          <div className="c-time-picker__hours" onClick={this.showOptions.bind(this, 'hours')} id={`${id}-hours`}>
            {`${times[0] || hours}:`}
            {select('hours')}
          </div>
          <div className="c-time-picker__minutes" onClick={this.showOptions.bind(this, 'minutes')} id={`${id}-minutes`}>
            {`${times[1] || minutes}:`}
            {select('minutes')}
          </div>
          <div className="c-time-picker__seconds" onClick={this.showOptions.bind(this, 'seconds')} id={`${id}-seconds`}>
            {times[2] || seconds}
            {select('seconds')}
          </div>
        </div>
      </div>
    );
  }
}

export default TimePicker;

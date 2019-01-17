/** @format */

import React, { Component } from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

@observer
class SequencerProgress extends Component {
  @observable progress = 0;
  @observable tmpIntervalId = null;

  constructor(props) {
    super(props);
    setTimeout(this.startProgress, props.delay * 1000);
  }

  startProgress = () => {
    const that = this;
    this.tmpIntervalId = setInterval(() => {
      if (that.progress < 100) {
        that.progress++;
      } else {
        clearInterval(that.tmpIntervalId);
      }
    }, 100 / this.props.duration);
  };

  render() {
    const { className } = this.props;
    return (
      <div className={className}>
        <div className='c-sequencer__fill' style={{ width: this.progress + '%' }}>
          <span className='c-sequencer__progress-status'>{this.progress + '%'}</span>
        </div>
      </div>
    );
  }
}

export default SequencerProgress;

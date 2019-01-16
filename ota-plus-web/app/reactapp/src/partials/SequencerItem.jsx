/** @format */

import React, { Component } from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import SequencerProgress from './SequencerProgress';

@observer
class SequencerItem extends Component {
  @observable showDropDown = false;

  toggleDropDown = e => {
    e.preventDefault();
    e.stopPropagation();
    this.showDropDown = !this.showDropDown;
  };

  render() {
    const { value, delay, duration, selectSlot, selectedElement, column, row, deselectSlot, readOnly, selectAction } = this.props;
    return (
      <span>
        <div
          className='c-sequencer__item'
          style={{
            borderColor: `${selectedElement && selectedElement.value.name === value.name ? '#7ee9da' : ''}`,
            boxShadow: `${selectedElement && selectedElement.value.name === value.name ? '0px 5px 10px -2px rgba(0,0,0,0.4)' : ''}`,
          }}
          onClick={_.isNull(selectedElement) && !readOnly ? selectSlot.bind(this, { column, row, value }) : deselectSlot}
        >
          <div className='c-sequencer__details-row'>
            <div className='c-sequencer__info'>
              <div className='c-sequencer__hardware-id'>{value.hardwareId}</div>
              <div className='c-sequencer__pack-name'>{value.name}</div>
              <div className='c-sequencer__update-from'>From: {value.from}</div>
              <div className='c-sequencer__update-to'>To: {value.to}</div>
            </div>
            <div className='c-sequencer__exit-nodes'>
              <div className='c-sequencer__failure' onClick={!readOnly ? this.toggleDropDown : null}>
                <i className={'c-sequencer__icon c-sequencer__icon--top ' + (value.selectedAction ? 'c-sequencer__icon--' + value.selectedAction : 'c-sequencer__icon--skip')} />
                {this.showDropDown ? (
                  <div className='c-sequencer__dropdown'>
                    <ul className='c-sequencer__list'>
                      <li className='c-sequencer__list-item' onClick={selectAction.bind(this, 'rollback', value)}>
                        Rollback
                        <i className='c-sequencer__icon c-sequencer__icon--rollback' />
                      </li>
                      <li className='c-sequencer__list-item' onClick={selectAction.bind(this, 'rollback-all', value)}>
                        Rollback all
                        <i className='c-sequencer__icon c-sequencer__icon--rollback-all' />
                      </li>
                      <li className='c-sequencer__list-item' onClick={selectAction.bind(this, 'skip', value)}>
                        Skip
                        <i className='c-sequencer__icon c-sequencer__icon--skip' />
                      </li>
                      <li className='c-sequencer__list-item' onClick={selectAction.bind(this, 'cancel-all', value)}>
                        Cancel all
                        <i className='c-sequencer__icon c-sequencer__icon--cancel-all' />
                      </li>
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {readOnly ? <SequencerProgress delay={delay} duration={duration} className={'c-sequencer__progress'} /> : null}
        </div>
      </span>
    );
  }
}

export default SequencerItem;

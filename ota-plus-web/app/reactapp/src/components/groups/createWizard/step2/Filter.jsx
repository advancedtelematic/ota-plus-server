/** @format */

import React, { Component } from 'react';
import { FormInput, FormSelect } from '../../../../partials/index';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';

@observer
class Filter extends Component {
  @observable expressionObject = {};

  changeType = (id, value) => {
    const { setType } = this.props;
    setType(id, value);
  };

  handleOnChange = (value, key) => {
    const { setExpressionForSingleFilter, id } = this.props;

    this.expressionObject[key] = value;
    let { name, condition, word, character, position } = this.expressionObject;
    let expressionToSend = '';

    if (name === 'Device ID') {
      name = 'deviceid';
    }

    if (position) {
      position = position[position.length - 1];
    }

    switch (condition) {
      case 'contains':
        if (name && condition && word && word.length > 0) {
          expressionToSend = (name + ' ' + condition + ' ' + word);
        }
        break;
      case 'has a character equal to':
        if (name && condition && position && character && character.length > 0) {
          expressionToSend = `${name} position(${position}) is ${character}`
        }
        break;
      case 'has a character different from':
        if (name && condition && position && character && character.length > 0) {
          expressionToSend = `${name} position(${position}) is not ${character}`;
        }
        break;
      default:
        break;
    }

    setExpressionForSingleFilter(expressionToSend, id);
  };

  render() {
    const { removeFilter, addFilter, id, options, type } = this.props;
    return (
      <div key={id} className='filter'>
        <div className='filter__block' style={{ flex: 1 }}>
          <FormSelect
            id='name-filter'
            placeholder='Data'
            appendMenuToBodyTag={true}
            options={options.nameFilterOptions}
            multiple={false}
            visibleFieldsCount={5}
            name='nameFilter'
            onChange={e => this.handleOnChange(e, 'name')}
          />
        </div>
        <div className='filter__block' style={{ flex: 2 }}>
          <FormSelect
            id='condition-filter'
            placeholder='Filter'
            appendMenuToBodyTag={true}
            options={options.extraFilterOptions}
            multiple={false}
            visibleFieldsCount={options.extraFilterOptions.length}
            name='condition'
            onChange={e => {
              this.changeType(id, e);
              this.handleOnChange(e, 'condition');
            }}
          />
        </div>

        {type === 'containsFilter' && (
          <div className='filter__block' style={{ flex: 3 }}>
            <FormInput id='word' name='word' className='input-wrapper' placeholder={'Type here'} onChange={e => this.handleOnChange(e.target.value, 'word')} />
          </div>
        )}
        {type === 'positionFilter' && (
          <div className={'filter__block filter__block--double'} style={{ display: 'flex', flex: 3 }}>
            <div className='filter__block' style={{ flex: 1 }}>
              <FormInput id='character' name='character' className='input-wrapper' placeholder={'Type here'} onChange={e => this.handleOnChange(e.target.value, 'character')} maxLength='1' />
            </div>
            <div className='filter__block' style={{ flex: 2 }}>
              <FormSelect
                id='position-filter'
                placeholder='Character position'
                appendMenuToBodyTag={true}
                options={_.range(1, 21)
                  .map(String)
                  .map(el => `in position ${el}`)}
                multiple={false}
                visibleFieldsCount={5}
                name='position'
                onChange={e => this.handleOnChange(e, 'position')}
              />
            </div>
          </div>
        )}

        <div className='filter__block filter__block--fake' id='filter-minus' onClick={removeFilter.bind(this, id)}>
          -
        </div>
        <div className='filter__block filter__block--fake' id='filter-plus' onClick={addFilter}>
          +
        </div>
      </div>
    );
  }
}

export default Filter;

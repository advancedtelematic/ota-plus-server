/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';
import { FormInput, FormSelect } from '../../../../partials/index';
import { GROUPS_FILTER_CONDITIONS, CLOSE_MODAL_ICON_RED } from '../../../../config';
import { sendAction } from '../../../../helpers/analyticsHelper';
import { OTA_DEVICES_SELECT_DEVICE_ID, OTA_DEVICES_SELECT_CUSTOM_FIELD } from '../../../../constants/analyticsActions';
import { DoubleFieldWrapper, RemoveFilterButton, FilterRow } from './smartGroup/SmartGroupWizard/styled';

const DEVICE_ID = 'Device ID';
const MAX_VISIBLE_FIELDS = 3;
const DEFAULT_VISIBLE_FIELDS = 2;

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
    let { name, position } = this.expressionObject;
    const { condition, word, character } = this.expressionObject;
    let expressionToSend = '';

    if (name === DEVICE_ID) {
      name = 'deviceid';
    } else {
      name = `tag(${name})`;
    }

    // the position equals to: "in position X", we need to get X from the string (X is a number)
    // for example: the input is "in position 13" and the output is: "13"
    if (position && position.indexOf(' ') > -1) {
      const positionArray = position.split(' ');
      position = positionArray[positionArray.length - 1];
    }

    switch (condition) {
      case GROUPS_FILTER_CONDITIONS.CONTAINS:
        if (name && condition && word && word.length > 0) {
          expressionToSend = (`${name} ${condition} ${word}`);
        }
        break;
      case GROUPS_FILTER_CONDITIONS.EQUAL_CHAR:
        if (name && condition && position && character && character.length > 0) {
          expressionToSend = `${name} position(${position}) is ${character}`;
        }
        break;
      case GROUPS_FILTER_CONDITIONS.DIFF_CHAR:
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
    const { removeFilter, id, options, t, type } = this.props;
    return (
      <FilterRow key={id}>
        <div>
          <FormSelect
            newVersion
            id="name-filter"
            placeholder={t('groups.creating.smart-group.placeholders.select')}
            appendMenuToBodyTag
            options={options.nameFilterOptions}
            multiple={false}
            visibleFieldsCount={options.nameFilterOptions.length > 1 ? MAX_VISIBLE_FIELDS : DEFAULT_VISIBLE_FIELDS}
            name="nameFilter"
            onChange={(e) => {
              sendAction(e === DEVICE_ID ? OTA_DEVICES_SELECT_DEVICE_ID : OTA_DEVICES_SELECT_CUSTOM_FIELD);
              this.handleOnChange(e, 'name');
            }}
          />
        </div>
        <div>
          <FormSelect
            newVersion
            id="condition-filter"
            placeholder={t('groups.creating.smart-group.placeholders.select')}
            appendMenuToBodyTag
            options={options.extraFilterOptions}
            multiple={false}
            visibleFieldsCount={options.extraFilterOptions.length}
            name="condition"
            onChange={(e) => {
              this.changeType(id, e.value);
              this.handleOnChange(e.value, 'condition');
            }}
          />
        </div>
        {type === 'containsFilter' && (
          <div>
            <FormInput
              id="word"
              name="word"
              className="input-wrapper"
              placeholder={t('groups.creating.smart-group.placeholders.enter-chars')}
              onChange={e => this.handleOnChange(e.target.value, 'word')}
            />
          </div>
        )}
        {type === 'positionFilter' && (
          <DoubleFieldWrapper>
            <div>
              <FormInput
                id="character"
                name="character"
                className="input-wrapper"
                placeholder={t('groups.creating.smart-group.placeholders.enter-chars')}
                onChange={e => this.handleOnChange(e.target.value, 'character')}
                maxLength="1"
              />
            </div>
            <div>
              <FormSelect
                newVersion
                id="position-filter"
                placeholder={t('groups.creating.smart-group.placeholders.select')}
                appendMenuToBodyTag
                options={_.range(1, 21)
                  .map(String)
                  .map(el => ({
                    value: `in position ${el}`,
                    text: `${t('groups.creating.smart-group.filters.position')} ${el}`
                  }))}
                multiple={false}
                visibleFieldsCount={MAX_VISIBLE_FIELDS}
                name="position"
                onChange={(e) => {
                  this.handleOnChange(e.value, 'position');
                }}
              />
            </div>
          </DoubleFieldWrapper>
        )}
        <RemoveFilterButton id="filter-minus" onClick={() => removeFilter(id)}>
          <img src={CLOSE_MODAL_ICON_RED} />
        </RemoveFilterButton>
      </FilterRow>
    );
  }
}

Filter.propTypes = {
  setType: PropTypes.func,
  setExpressionForSingleFilter: PropTypes.func,
  removeFilter: PropTypes.func,
  id: PropTypes.number,
  options: PropTypes.shape({}),
  t: PropTypes.func,
  type: PropTypes.string
};

export default withTranslation()(Filter);

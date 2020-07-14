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
import {
  DeviceFieldWrapper,
  DoubleFieldWrapper,
  FilterRow,
  FilterTypeFieldWrapper,
  RemoveFilterButton,
  ValueFieldWrapper
} from './smartGroup/SmartGroupWizard/styled';

const CONTAINS_CHAR_FILTER_KEY = 'containsFilter';
const CHAR_POSITION_FILTER_KEY = 'positionFilter';
const DEVICE_ID = 'Device ID';
const MAX_VISIBLE_FIELDS = 3;
const DEFAULT_VISIBLE_FIELDS = 2;
const DISABLED_OPACITY = 0.4;
const MIN_FILTERS_COUNT_TO_ENABLE_DELETE = 2;

@observer
class Filter extends Component {
  @observable expressionObject = {};

  constructor(props) {
    super(props);
    this.filterRef = React.createRef();
    this.typeRef = React.createRef();
    this.charInputRef = React.createRef();
    this.charPosRef = React.createRef();
  }

  changeType = (id, value) => {
    const { clusterId, setType } = this.props;
    setType(id, value, clusterId);
  };

  handleOnChange = (value, key) => {
    const { setExpressionForSingleFilter, id, clusterId } = this.props;

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

    setExpressionForSingleFilter(expressionToSend, id, clusterId);
  };

  handleRemoveClick = (id) => {
    const { filtersLength, removeFilter, type } = this.props;
    if (Object.keys(this.expressionObject).length) {
      this.filterRef.current.clearField();
      this.typeRef.current.clearField();
      if (type === CONTAINS_CHAR_FILTER_KEY) {
        this.charInputRef.current.clearField();
      }
      if (type === CHAR_POSITION_FILTER_KEY) {
        this.charInputRef.current.clearField();
        this.charPosRef.current.clearField();
      }
      this.expressionObject = {};
    }
    if (filtersLength > 1) {
      removeFilter(id);
    }
  }

  shouldDisableRemoveButton = () => {
    const { filtersLength } = this.props;
    return filtersLength < MIN_FILTERS_COUNT_TO_ENABLE_DELETE && !Object.keys(this.expressionObject).length;
  }

  render() {
    const { id, options, t, type } = this.props;

    return (
      <FilterRow key={id}>
        <DeviceFieldWrapper>
          <FormSelect
            ref={this.filterRef}
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
        </DeviceFieldWrapper>
        <FilterTypeFieldWrapper>
          <FormSelect
            ref={this.typeRef}
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
        </FilterTypeFieldWrapper>
        {type === CONTAINS_CHAR_FILTER_KEY && (
          <ValueFieldWrapper>
            <FormInput
              ref={this.charInputRef}
              id="word"
              name="word"
              className="input-wrapper"
              placeholder={t('groups.creating.smart-group.placeholders.enter-chars')}
              onChange={e => this.handleOnChange(e.target.value, 'word')}
            />
          </ValueFieldWrapper>
        )}
        {type === CHAR_POSITION_FILTER_KEY && (
          <DoubleFieldWrapper>
            <div>
              <FormInput
                ref={this.charInputRef}
                id="character"
                name="character"
                className="input-wrapper"
                onChange={e => this.handleOnChange(e.target.value, 'character')}
                maxLength="1"
              />
            </div>
            <div>
              <FormSelect
                ref={this.charPosRef}
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
        <RemoveFilterButton
          style={{ opacity: this.shouldDisableRemoveButton() && DISABLED_OPACITY }}
          id="filter-minus"
          onClick={() => this.handleRemoveClick(id)}
        >
          <img src={CLOSE_MODAL_ICON_RED} />
        </RemoveFilterButton>
      </FilterRow>
    );
  }
}

Filter.propTypes = {
  filtersLength: PropTypes.number,
  setType: PropTypes.func,
  setExpressionForSingleFilter: PropTypes.func,
  removeFilter: PropTypes.func,
  id: PropTypes.number,
  clusterId: PropTypes.number,
  options: PropTypes.shape({}),
  t: PropTypes.func,
  type: PropTypes.string
};

export default withTranslation()(Filter);

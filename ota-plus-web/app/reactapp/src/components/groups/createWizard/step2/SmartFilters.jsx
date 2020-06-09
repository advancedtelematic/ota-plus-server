/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */
/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { observable } from 'mobx';
import _ from 'lodash';

import Filter from './Filter';
import { GROUP_DATA_TYPE_EXPRESSION } from '../../../../constants/groupConstants';
import { GROUPS_FILTER_CONDITIONS, PLUS_ICON } from '../../../../config';
import {
  AddFilterButton,
  FieldLabel,
  FilterColumnHeader,
  FilterRow,
  FiltersContainer,
  FiltersHeader,
  TargetedDevicesHint,
} from './smartGroup/SmartGroupWizard/styled';

const INITIAL_FILTER_VALUES = [
  {
    id: 1,
    type: 'containsFilter',
    expression: '',
    operation: 'and',
  },
];

@inject('stores')
@observer
class SmartFilters extends Component {
  @observable lastGivenId = 1;

  @observable expressionForSmartGroup = '';

  @observable options = {
    nameFilterOptions: ['Device ID'],
    extraFilterOptions: [
      {
        value: 'contains',
        text: this.props.t('groups.creating.smart-group.filters.contains')
      },
      {
        value: 'has a character equal to',
        text: this.props.t('groups.creating.smart-group.filters.char-equal')
      },
      {
        value: 'has a character different from',
        text: this.props.t('groups.creating.smart-group.filters.char-not-equal')
      }
    ],
  };

  @observable filters = INITIAL_FILTER_VALUES;

  componentDidMount() {
    const { stores } = this.props;
    const { devicesStore } = stores;
    const { customDeviceFields } = devicesStore;
    customDeviceFields.forEach((field) => {
      this.options.nameFilterOptions.push(field);
    });
  }

  addFilter = () => {
    this.lastGivenId += 1;
    this.filters.push({
      id: this.lastGivenId,
      type: 'containsFilter',
      expression: '',
      operation: 'and',
    });
    this.setExpressionForSmartGroup();
  };

  removeFilter = (id) => {
    if (this.filters.length > 1) {
      this.filters = _.filter(this.filters, el => el.id !== id);
    }
    this.setExpressionForSmartGroup();
  };

  setType = (id, value) => {
    this.filters.forEach((el) => {
      if (el.id === id) {
        switch (value) {
          case GROUPS_FILTER_CONDITIONS.CONTAINS:
            el.type = 'containsFilter';
            break;
          case GROUPS_FILTER_CONDITIONS.EQUAL_CHAR:
            el.type = 'positionFilter';
            break;
          case GROUPS_FILTER_CONDITIONS.DIFF_CHAR:
            el.type = 'positionFilter';
            break;
          default:
            break;
        }
      }
    });
  };

  selectOperationType = (e, id, type) => {
    e.preventDefault();

    this.filters.forEach((el) => {
      if (el.id === id) {
        el.operation = type;
      }
    });
    this.setExpressionForSmartGroup();
  };

  setExpressionForSingleFilter = (expressionForSingleFilter, id) => {
    this.filters.find(el => el.id === id).expression = expressionForSingleFilter;
    this.setExpressionForSmartGroup();
  };

  setExpressionForSmartGroup = () => {
    this.expressionForSmartGroup = '';
    const { onStep2DataSelect, stores } = this.props;

    const stepValid = _.every(this.filters, el => el.expression.length >= 1);

    const { groupsStore } = stores;

    if (stepValid) {
      this.filters.map((el, index) => {
        if (index !== 0) this.expressionForSmartGroup += ` ${el.operation} `;
        this.expressionForSmartGroup += el.expression;
        return true;
      });
      groupsStore.fetchNumberOfDevicesByExpression(this.expressionForSmartGroup);
      onStep2DataSelect(GROUP_DATA_TYPE_EXPRESSION, this.expressionForSmartGroup);
    } else {
      onStep2DataSelect(GROUP_DATA_TYPE_EXPRESSION, '');
    }
  };

  render() {
    const { stores, t } = this.props;
    const { groupsStore } = stores;
    const { isFetchingDevicesCount, numberOfDevicesByExpression } = groupsStore;

    return (
      <>
        <FiltersHeader>
          <FieldLabel>{t('groups.creating.smart-group.labels.filters')}</FieldLabel>
          <AddFilterButton
            id="filter-plus"
            light="true"
            onClick={() => this.addFilter()}
          >
            <img src={PLUS_ICON} />
            {t('groups.creating.smart-group.buttons.add-filter')}
          </AddFilterButton>
        </FiltersHeader>
        <FiltersContainer scrollbarVisible={this.filters.length > 2}>
          <FilterRow>
            <FilterColumnHeader>{t('groups.creating.smart-group.filters.filter')}</FilterColumnHeader>
            <FilterColumnHeader>{t('groups.creating.smart-group.filters.type')}</FilterColumnHeader>
            <FilterColumnHeader>{t('groups.creating.smart-group.filters.value')}</FilterColumnHeader>
          </FilterRow>
          <div className="filters">
            {_.map(this.filters, (filter, index) => (
              <div key={filter.id}>
                {index !== 0 && (
                <div className="filters--operations">
                  <div
                    className="filters--operations__single"
                    onClick={e => this.selectOperationType(e, filter.id, 'and')}
                  >
                    <button
                      type="button"
                      id="filter--operation-and"
                      className={`btn-radio ${filter.operation === 'and' ? ' checked' : ''}`}
                    />
                    <span>{t('groups.creating.smart-group.operations.and')}</span>
                  </div>
                  <div
                    className="filters--operations__single"
                    onClick={e => this.selectOperationType(e, filter.id, 'or')}
                  >
                    <button
                      type="button"
                      id="filter-operation-or"
                      className={`btn-radio ${filter.operation === 'or' ? ' checked' : ''}`}
                    />
                    <span>{t('groups.creating.smart-group.operations.or')}</span>
                  </div>
                </div>
                )}
                <div>
                  <Filter
                    filtersLength={this.filters.length}
                    options={this.options}
                    id={filter.id}
                    removeFilter={this.removeFilter}
                    setType={this.setType}
                    type={filter.type}
                    setExpressionForSingleFilter={this.setExpressionForSingleFilter}
                  />
                </div>
              </div>
            ))}
          </div>
        </FiltersContainer>
        <TargetedDevicesHint>
          {isFetchingDevicesCount ? t('groups.creating.smart-group.fetching-devices') : (
            <>
              <div>{t('groups.creating.smart-group.devices-targeted')}</div>
              <div>
                {this.expressionForSmartGroup ? numberOfDevicesByExpression : '0'}
              </div>
            </>
          )}
        </TargetedDevicesHint>
      </>
    );
  }
}

SmartFilters.propTypes = {
  onStep2DataSelect: PropTypes.func,
  stores: PropTypes.shape({}),
  t: PropTypes.func
};

export default withTranslation()(SmartFilters);

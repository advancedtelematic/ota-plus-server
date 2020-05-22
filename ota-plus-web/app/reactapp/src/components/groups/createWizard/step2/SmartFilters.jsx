/* eslint-disable no-param-reassign */
/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import _ from 'lodash';

import Filter from './Filter';
import { GROUP_DATA_TYPE_EXPRESSION } from '../../../../constants/groupConstants';
import { GROUPS_FILTER_CONDITIONS } from '../../../../config';

const FETCHING_DEVICES_MSG = 'Filtering devices can take some time';

@inject('stores')
@observer
class SmartFilters extends Component {
  @observable lastGivenId = 1;

  @observable expressionForSmartGroup = '';

  @observable options = {
    nameFilterOptions: ['Device ID'],
    extraFilterOptions: ['contains', 'has a character equal to', 'has a character different from'],
  };

  @observable filters = [
    {
      id: 1,
      type: 'containsFilter',
      expression: '',
      operation: 'and',
    },
  ];

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
    const { stores } = this.props;
    const { isFetchingDevicesCount, numberOfDevicesByExpression } = stores.groupsStore;

    return (
      <div className="filters">
        <div className="filters--devices__number">
          <span className="title">Number of devices:</span>
          <span className="devices-number">
            {isFetchingDevicesCount ? FETCHING_DEVICES_MSG : (
              <>
                {this.expressionForSmartGroup ? numberOfDevicesByExpression : '0'}
                {' '}
                Devices
              </>
            )}
          </span>
        </div>
        {_.map(this.filters, (filter, index) => (
          <div key={filter.id}>
            {index !== 0 && (
            <div className="filters--operations">
              <div className="filters--operations__single" onClick={e => this.selectOperationType(e, filter.id, 'and')}>
                <button
                  type="button"
                  id="filter--operation-and"
                  className={`btn-radio ${filter.operation === 'and' ? ' checked' : ''}`}
                />
                <span>And</span>
              </div>
              <div className="filters--operations__single" onClick={e => this.selectOperationType(e, filter.id, 'or')}>
                <button
                  type="button"
                  id="filter-operation-or"
                  className={`btn-radio ${filter.operation === 'or' ? ' checked' : ''}`}
                />
                <span>Or</span>
              </div>
            </div>
            )}
            <div>
              <Filter
                options={this.options}
                id={filter.id}
                addFilter={this.addFilter}
                removeFilter={this.removeFilter}
                setType={this.setType}
                type={filter.type}
                setExpressionForSingleFilter={this.setExpressionForSingleFilter}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

SmartFilters.propTypes = {
  onStep2DataSelect: PropTypes.func,
  stores: PropTypes.shape({})
};

export default SmartFilters;

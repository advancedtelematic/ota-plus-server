/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */
/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withTranslation, Trans } from 'react-i18next';
import { observable } from 'mobx';
import { Tooltip } from 'antd';
import _ from 'lodash';

import Filter from './Filter';
import { GROUP_DATA_TYPE_EXPRESSION } from '../../../../constants/groupConstants';
import {
  AND_ICON,
  GROUPS_FILTER_CONDITIONS,
  HELP_ICON_LIGHT,
  OR_ICON,
  PLUS_ICON
} from '../../../../config';
import {
  AddFilterButton,
  ClusterHeader,
  FieldLabel,
  FilterColumnHeader,
  FilterRowHeader,
  FiltersCluster,
  FiltersContainer,
  FiltersHeader,
  RemoveClusterButton,
  TargetedDevicesHint,
} from './smartGroup/SmartGroupWizard/styled';
import { sendAction } from '../../../../helpers/analyticsHelper';
import { OTA_DEVICES_ADD_CLUSTER, OTA_DEVICES_ADD_FILTER } from '../../../../constants/analyticsActions';

const SINGLE_CLUSTER_MAX_FILTERS_HEIGHT_PX = '415px';
const MULTIPLE_CLUSTERS_MAX_FILTERS_HEIGHT_PX = '540px';
const MIN_CLUSTER_COUNT_TO_ENABLE_DELETE = 2;
const DISABLED_OPACITY = 0.4;
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

  @observable lastClusterId = 1;

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

  @observable clusters = [
    {
      id: 1,
      filters: INITIAL_FILTER_VALUES,
      operation: 'or'
    }
  ];

  componentDidMount() {
    const { stores } = this.props;
    const { devicesStore } = stores;
    const { customDeviceFields } = devicesStore;
    customDeviceFields.forEach((field) => {
      this.options.nameFilterOptions.push(field.tagId);
    });
  }

  addFilter = (clusterId) => {
    this.lastGivenId += 1;
    const selectedCluster = this.clusters.find(({ id }) => id === clusterId);
    selectedCluster.filters.push({
      id: this.lastGivenId,
      type: 'containsFilter',
      expression: '',
      operation: 'and',
    });
    this.filters.push({
      id: this.lastGivenId,
      type: 'containsFilter',
      expression: '',
      operation: 'and',
    });
    this.setExpressionForSmartGroup();
    sendAction(OTA_DEVICES_ADD_FILTER);
  };

  addCluster = () => {
    this.lastClusterId += 1;
    this.clusters.push({
      id: this.lastClusterId,
      filters: INITIAL_FILTER_VALUES,
      operation: 'or'
    });
    this.setExpressionForSmartGroup();
    sendAction(OTA_DEVICES_ADD_CLUSTER);
  };

  removeFilter = (id) => {
    this.clusters.forEach((cluster) => {
      if (cluster.filters.length > 1) {
        cluster.filters = _.filter(cluster.filters, el => el.id !== id);
      }
    });

    this.setExpressionForSmartGroup();
  };

  removeCluster = (id) => {
    if (this.clusters.length > 1) {
      this.clusters = _.filter(this.clusters, el => el.id !== id);
    }
    this.setExpressionForSmartGroup();
  };

  setType = (id, value, clusterId) => {
    const selectedCluster = this.clusters.find(cluster => cluster.id === clusterId);
    selectedCluster.filters.forEach((el) => {
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

  setExpressionForSingleFilter = (expressionForSingleFilter, id, clusterId) => {
    const selectedCluster = this.clusters.find(cluster => cluster.id === clusterId);
    selectedCluster.filters.find(el => el.id === id).expression = expressionForSingleFilter;
    this.setExpressionForSmartGroup();
  };

  setExpressionForSmartGroup = () => {
    this.expressionForSmartGroup = '';
    const { onStep2DataSelect, stores } = this.props;

    const stepValid = _.every(this.clusters, cluster => _.every(cluster.filters, el => el.expression.length >= 1));

    const { groupsStore } = stores;

    if (stepValid) {
      this.clusters.map((cluster, idx) => {
        if (idx !== 0) this.expressionForSmartGroup += ` ${cluster.operation} `;
        cluster.filters.map((el, index) => {
          if (index !== 0) this.expressionForSmartGroup += ` ${el.operation} `;
          this.expressionForSmartGroup += el.expression;

          return true;
        });
        return true;
      });
      groupsStore.fetchNumberOfDevicesByExpression(this.expressionForSmartGroup);
      onStep2DataSelect(GROUP_DATA_TYPE_EXPRESSION, this.expressionForSmartGroup);
    } else {
      onStep2DataSelect(GROUP_DATA_TYPE_EXPRESSION, '');
    }
  };

  getMaxFiltersHeight = () => this.clusters.length === 1
    ? SINGLE_CLUSTER_MAX_FILTERS_HEIGHT_PX
    : MULTIPLE_CLUSTERS_MAX_FILTERS_HEIGHT_PX;

  render() {
    const { stores, t } = this.props;
    const { groupsStore } = stores;
    const { isFetchingDevicesCount, numberOfDevicesByExpression } = groupsStore;

    return (
      <>
        <FiltersHeader>
          <FieldLabel>{t('groups.creating.smart-group.labels.filters')}</FieldLabel>
          <AddFilterButton
            id="cluster-plus"
            light="true"
            onClick={() => this.addCluster()}
          >
            <img src={PLUS_ICON} />
            {t('groups.creating.smart-group.buttons.add-cluster')}
          </AddFilterButton>
        </FiltersHeader>
        <FiltersContainer maxHeight={this.getMaxFiltersHeight()}>
          {this.clusters.map(({ id, filters }, idx) => (
            <React.Fragment key={id}>
              {idx !== 0 && (
                <div className="filters--operations">
                  <div className="filters--operations__single">
                    <div>
                      <img src={OR_ICON} />
                      <span>{t('groups.creating.smart-group.operations.or')}</span>
                    </div>
                    <Tooltip
                      title={(
                        <Trans>
                          {t('groups.tooltips.or')}
                        </Trans>
                      )}
                      arrowPointAtCenter
                      placement="left"
                    >
                      <img src={HELP_ICON_LIGHT} />
                    </Tooltip>
                  </div>
                </div>
              )}
              <FiltersCluster id={`cluster-${id}`}>
                <ClusterHeader>
                  <FilterColumnHeader>{t('groups.creating.smart-group.cluster')}</FilterColumnHeader>
                  <div>
                    <AddFilterButton
                      id="filter-plus"
                      light="true"
                      onClick={() => this.addFilter(id)}
                    >
                      <img src={PLUS_ICON} />
                      {t('groups.creating.smart-group.buttons.add-filter')}
                    </AddFilterButton>
                    <RemoveClusterButton
                      style={{ opacity: this.clusters.length < MIN_CLUSTER_COUNT_TO_ENABLE_DELETE && DISABLED_OPACITY }}
                      id="cluster-minus"
                      onClick={() => this.clusters.length > 1 && this.removeCluster(id)}
                    >
                      {t('groups.creating.smart-group.buttons.delete-cluster')}
                    </RemoveClusterButton>
                  </div>
                </ClusterHeader>
                <FilterRowHeader>
                  <FilterColumnHeader>{t('groups.creating.smart-group.filters.filter')}</FilterColumnHeader>
                  <FilterColumnHeader>{t('groups.creating.smart-group.filters.type')}</FilterColumnHeader>
                  <FilterColumnHeader>{t('groups.creating.smart-group.filters.value')}</FilterColumnHeader>
                </FilterRowHeader>
                <div className="filters">
                  {_.map(filters, (filter, index) => (
                    <div key={filter.id} id={`cluster${id}-filter-${filter.id}`}>
                      {index !== 0 && (
                      <div className="filters--operations">
                        <div className="filters--operations__single">
                          <div>
                            <img src={AND_ICON} />
                            <span>{t('groups.creating.smart-group.operations.and')}</span>
                          </div>
                          <Tooltip
                            title={(
                              <Trans>
                                {t('groups.tooltips.and')}
                              </Trans>
                            )}
                            arrowPointAtCenter
                            placement="left"
                          >
                            <img src={HELP_ICON_LIGHT} />
                          </Tooltip>
                        </div>
                      </div>
                      )}
                      <div>
                        <Filter
                          filtersLength={filters.length}
                          options={this.options}
                          id={filter.id}
                          clusterId={id}
                          removeFilter={this.removeFilter}
                          setType={this.setType}
                          type={filter.type}
                          setExpressionForSingleFilter={this.setExpressionForSingleFilter}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </FiltersCluster>
            </React.Fragment>
          ))}
        </FiltersContainer>
        <TargetedDevicesHint>
          {isFetchingDevicesCount ? t('groups.creating.smart-group.fetching-devices') : (
            <>
              <div>{t('groups.creating.smart-group.devices-targeted')}</div>
              <div id="tag-device-count">
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

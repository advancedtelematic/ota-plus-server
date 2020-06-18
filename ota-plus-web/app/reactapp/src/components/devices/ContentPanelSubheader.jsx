/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Trans, withTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { SubHeader, FormInput } from '../../partials';
import { AND_ICON_LIGHT, GROUPS_FILTER_CONDITIONS, HELP_ICON_LIGHT, OR_ICON_LIGHT } from '../../config';

const CHARACTER_POSITION_REGEXP_PATTERN = '\\((.*?)\\)';
const TAG_CHARACTER_POSITION_REGEXP_PATTERN = /\(([^)]+)\)/g;
const DEVICE_ID = 'Device ID';
const OR_CONJUNCTION = 'or';
const TAG = 'tag';

@inject('stores')
@observer
class ContentPanelSubheader extends Component {
  render() {
    const { stores, t } = this.props;
    const { groupsStore } = stores;
    const expressionsArray = groupsStore.selectedGroup.expression.split(/ and | or /);
    const operationsArray = groupsStore.selectedGroup.expression.match(/and|or/g);
    const expressionsArrayToDisplay = [];

    expressionsArray.forEach((element) => {
      const singleExpressionAfterSplit = element.split(' ');
      let singleExpressionToDisplay = [];
      if (element.search(GROUPS_FILTER_CONDITIONS.CONTAINS) > 0) {
        // line below to support old type of expression closed in parenthesis
        if (singleExpressionAfterSplit[2].charAt(singleExpressionAfterSplit[2].length - 1) === ')') {
          singleExpressionAfterSplit[2] = singleExpressionAfterSplit[2].slice(0, -1);
        }

        let customDeviceField;
        if (singleExpressionAfterSplit[0].split('(')[0] === TAG) {
          customDeviceField = singleExpressionAfterSplit.slice(0, singleExpressionAfterSplit.length - 2).join(' ');
          [, customDeviceField] = customDeviceField.match(CHARACTER_POSITION_REGEXP_PATTERN);
        }

        singleExpressionToDisplay = [
          customDeviceField || DEVICE_ID,
          GROUPS_FILTER_CONDITIONS.CONTAINS,
          singleExpressionAfterSplit[singleExpressionAfterSplit.length - 1]
        ];

        return expressionsArrayToDisplay.push({
          expression: singleExpressionToDisplay,
          type: GROUPS_FILTER_CONDITIONS.CONTAINS,
        });
      }
      if (element.search(GROUPS_FILTER_CONDITIONS.POSITION) > 0) {
        // we need to get value between () brackets
        // for example: the input is "deviceid,position(13),is,8" and the output is ["(15)", "15"]
        let character;
        if (singleExpressionAfterSplit[0].split('(')[0] === TAG) {
          [, character] = element.match(TAG_CHARACTER_POSITION_REGEXP_PATTERN);
          character = character.replace(/[()]/g, '');
        } else {
          [, character] = element.match(CHARACTER_POSITION_REGEXP_PATTERN);
        }

        const position = singleExpressionAfterSplit[singleExpressionAfterSplit.length - 1];
        let customDeviceField;
        if (singleExpressionAfterSplit[0].split('(')[0] === TAG) {
          customDeviceField = singleExpressionAfterSplit.slice(0, singleExpressionAfterSplit.length - 3).join(' ');
          [, customDeviceField] = customDeviceField.match(CHARACTER_POSITION_REGEXP_PATTERN);
        }
        if (element.search('not') < 0) {
          singleExpressionToDisplay = [customDeviceField || DEVICE_ID, GROUPS_FILTER_CONDITIONS.EQUAL_CHAR, position, `in position ${character}`];
        } else if (element.search('not') > 0) {
          singleExpressionToDisplay = [customDeviceField || DEVICE_ID, GROUPS_FILTER_CONDITIONS.DIFF_CHAR, position, `in position ${character}`];
        }

        return expressionsArrayToDisplay.push({
          expression: singleExpressionToDisplay,
          type: GROUPS_FILTER_CONDITIONS.POSITION,
        });
      }
      return true;
    });

    const Filters = expressionsArrayToDisplay.map((singleFilter, index) => (
      <div key={index} className="filters">
        <div className="filter filter--dark">
          <div className="filter__block" style={{ flex: 1 }}>
            <FormInput
              id="name-filter"
              name="nameFilter"
              defaultValue={singleFilter.expression[0]}
              isEditable={false}
            />
          </div>
          <div className="filter__block" style={{ flex: 2 }}>
            <FormInput
              id="expression-filter"
              name="expressionFilter"
              defaultValue={singleFilter.expression[1]}
              isEditable={false}
            />
          </div>

          {singleFilter.type === GROUPS_FILTER_CONDITIONS.CONTAINS && (
          <div className="filter__block" style={{ flex: 4 }}>
            <FormInput
              id="word"
              name="word"
              className="input-wrapper"
              defaultValue={singleFilter.expression[2]}
              isEditable={false}
            />
          </div>
          )}
          {singleFilter.type === GROUPS_FILTER_CONDITIONS.POSITION && (
          <div className="filter__block filter__block--double" style={{ display: 'flex', flex: 4 }}>
            <div className="filter__block" style={{ flex: 1 }}>
              <FormInput
                id="word"
                name="word"
                className="input-wrapper"
                defaultValue={singleFilter.expression[2]}
                isEditable={false}
              />
            </div>
            <div className="filter__block" style={{ flex: 1 }}>
              <FormInput
                id="word"
                name="word"
                className="input-wrapper"
                defaultValue={singleFilter.expression[3]}
                isEditable={false}
              />
            </div>
          </div>
          )}
        </div>
        {operationsArray && index < operationsArray.length ? (
          <div className={`filters--operation_dark ${operationsArray[index] === OR_CONJUNCTION ? 'filters--operation_dark__or' : ''}`}>
            <div>
              <img src={operationsArray[index] === OR_CONJUNCTION ? OR_ICON_LIGHT : AND_ICON_LIGHT} />
              {operationsArray[index]}
            </div>
            <Tooltip
              title={(
                <Trans>
                  {t(operationsArray[index] === OR_CONJUNCTION ? 'groups.tooltips.or' : 'groups.tooltips.and')}
                </Trans>
              )}
              arrowPointAtCenter
              placement="left"
            >
              <img className="tooltip-icon" src={HELP_ICON_LIGHT} />
            </Tooltip>
          </div>
        ) : ''}
      </div>
    ));

    return <SubHeader className="subheader--filters">{Filters}</SubHeader>;
  }
}

ContentPanelSubheader.propTypes = {
  stores: PropTypes.shape({}),
  t: PropTypes.func
};

export default withTranslation()(ContentPanelSubheader);

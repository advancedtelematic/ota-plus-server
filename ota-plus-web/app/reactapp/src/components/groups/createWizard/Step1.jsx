/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { map } from 'lodash';
import { withTranslation } from 'react-i18next';

import { GROUP_GROUP_TYPE_CLASSIC, GROUP_GROUP_TYPE_SMART } from '../../../constants/groupConstants';
import Option from './step1/Option';
import { GROUP_DYNAMIC_ICON, GROUP_ICON_GRAY } from '../../../config';

class Step1 extends Component {
  constructor(props) {
    super(props);
    const { t } = props;
    this.options = [
      {
        title: t('groups.creating.fixed-group-title'),
        teaser: t('groups.creating.fixed-group-teaser'),
        alias: GROUP_GROUP_TYPE_CLASSIC,
      },
      {
        title: t('groups.creating.smart-group-title'),
        teaser: t('groups.creating.smart-group-teaser'),
        alias: GROUP_GROUP_TYPE_SMART,
      },
    ];
  }

  render() {
    const { groupType, onStep1DataSelect } = this.props;
    return (
      <div className="wizard__step1">
        {map(this.options, option => (
          <Option
            key={option.alias}
            iconSrc={option.alias === GROUP_GROUP_TYPE_CLASSIC
              ? GROUP_ICON_GRAY
              : GROUP_DYNAMIC_ICON
            }
            title={option.title}
            teaser={option.teaser}
            selectOption={() => {
              onStep1DataSelect(option.alias);
            }}
            isSelected={groupType === option.alias}
          />
        ))}
      </div>
    );
  }
}

Step1.propTypes = {
  onStep1DataSelect: PropTypes.func.isRequired,
  groupType: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation()(Step1);

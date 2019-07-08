/** @format */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { Loader } from '../../../../partials';
import UpdatesWizardDetailListItem from './UpdatesWizardDetailListItem';

@inject('stores')
@observer
class UpdatesWizardDetailList extends Component {
  render() {
    const { wizardData, onStep2DataSelect, stores } = this.props;
    const { softwareStore } = stores;
    const { selectedHardwares } = wizardData;
    return (
      <span>
        {softwareStore.packagesFetchAsync.isFetching ? (
          <div className="wrapper-center">
            <Loader />
          </div>
        ) : (
          _.map(selectedHardwares, item => (
            <UpdatesWizardDetailListItem
              key={item.name}
              item={item}
              wizardData={wizardData}
              onStep2DataSelect={onStep2DataSelect}
            />
          ))
        )}
      </span>
    );
  }
}

UpdatesWizardDetailList.propTypes = {
  stores: PropTypes.shape({}),
  wizardData: PropTypes.shape({}),
  onStep2DataSelect: PropTypes.func,
};

export default UpdatesWizardDetailList;

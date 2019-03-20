/** @format */

import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { Loader } from '../../../../partials';
import UpdatesWizardDetailListItem from './UpdatesWizardDetailListItem';

@inject('stores')
@observer
class UpdatesWizardDetailList extends Component {
  render() {
    const { wizardData, onStep2DataSelect } = this.props;
    const { softwareStore } = this.props.stores;
    const selectedHardwares = wizardData.selectedHardwares;
    return (
      <span>
        {softwareStore.packagesFetchAsync.isFetching ? (
          <div className='wrapper-center'>
            <Loader />
          </div>
        ) : (
          _.map(selectedHardwares, item => {
            return <UpdatesWizardDetailListItem key={item.name} item={item} wizardData={wizardData} onStep2DataSelect={onStep2DataSelect} />;
          })
        )}
      </span>
    );
  }
}

UpdatesWizardDetailList.propTypes = {
  stores: PropTypes.object,
};

export default UpdatesWizardDetailList;

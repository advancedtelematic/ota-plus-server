/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncResponse } from '../../../partials';
import { translate } from 'react-i18next';
import _ from 'lodash';
import { observable } from 'mobx';

import { getUpdateDetails } from '../../../helpers/updateDetailsHelper';
import { NO_VERSION_INFO } from '../../../constants';

@inject('stores')
@observer
class WizardStep7 extends Component {
  @observable
  updateDetails = [];

  componentWillMount() {
    const { updatesStore } = this.props.stores;
    const { wizardData } = this.props;
    const currentUpdate = _.first(wizardData.update);
    updatesStore.fetchUpdate(currentUpdate && currentUpdate.source.id);
  }

  componentDidMount() {
    const { updatesStore, softwareStore } = this.props.stores;
    const mtuData = updatesStore && updatesStore.currentMtuData && updatesStore.currentMtuData.data;
    const { packages } = softwareStore;
    this.updateDetails = getUpdateDetails(mtuData, packages);
  }

  render() {
    const { t, wizardData } = this.props;
    const { campaignsStore, groupsStore } = this.props.stores;
    const { campaignsCreateAsync } = campaignsStore;
    return (
      <div className='step-inner'>
        <AsyncResponse
          handledStatus='error'
          action={campaignsCreateAsync}
          errorMsg={campaignsCreateAsync.status && campaignsCreateAsync.status !== 200 ? campaignsCreateAsync.data.description : null}
        />
        <div className='box-summary'>
          <div className='title'>
            {'Software & Version'}
          </div>
          <div className='desc'>
            {this.updateDetails &&
              _.map(this.updateDetails, target => {
                const { hardwareId, fromPackage, fromVersion, toPackage, toVersion } = target;
                return (
                  <div className='package-container' key={hardwareId}>
                    <div className='update-container'>
                      <span className='director-updates'>
                        <div className='update-from'>
                          <div className='text'>{'From:'}</div>
                          <div className='value' id={'from-package-name-' + fromPackage}>
                            {fromPackage || NO_VERSION_INFO}
                          </div>
                        </div>
                        <div className='update-to'>
                          <div className='text'>{'To:'}</div>
                          <div className='value' id={'to-package-name-' + toPackage}>
                            {toPackage || NO_VERSION_INFO}
                          </div>
                        </div>
                      </span>
                      <span className='director-versions'>
                        <div className='update-from'>
                          <div className='text'>{'Version:'}</div>
                          <div className='value' id={'from-package-version-' + fromVersion}>
                            {fromVersion || NO_VERSION_INFO}
                          </div>
                        </div>
                        <div className='update-to'>
                          <div className='text'>{'Version:'}</div>
                          <div className='value' id={'to-package-version-' + toVersion}>
                            {toVersion || NO_VERSION_INFO}
                          </div>
                        </div>
                      </span>
                    </div>
                    <div className='hardware-type-container'>
                      <div className='text'>{'On:'}</div>
                      <div className='value app-label' id={'package-version-' + hardwareId}>
                        {hardwareId}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className='box-summary groups'>
          <div className='title'>{'Groups & Devices'}</div>
          <div className='desc'>
            <div className='wrapper-groups'>
              {_.map(wizardData.groups, (group, index) => {
                return (
                  <div className='element-box group' key={index}>
                    <div className='icon' />
                    <div className='desc'>
                      <div className='title' id='wizard-summary-group-name'>
                        {group.groupName}
                      </div>
                      <div className='subtitle' id='wizard-summary-group-devices'>
                        {t('common.deviceWithCount', { count: groupsStore._getGroupDevices(group).length })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

WizardStep7.propTypes = {
  wizardData: PropTypes.object.isRequired,
  stores: PropTypes.object,
};

export default translate()(WizardStep7);

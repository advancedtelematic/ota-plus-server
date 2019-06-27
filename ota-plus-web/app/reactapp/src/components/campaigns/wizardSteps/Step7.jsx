/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { AsyncResponse } from '../../../partials';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import { getUpdateDetails } from '../../../helpers/updateDetailsHelper';
import { NO_VERSION_INFO } from '../../../constants';

@inject('stores')
@observer
class WizardStep7 extends Component {

  componentWillMount() {
    const { updatesStore } = this.props.stores;
    const { wizardData } = this.props;
    const currentUpdate = _.first(wizardData.update);
    updatesStore.fetchUpdate(currentUpdate && currentUpdate.source.id);
  }

  prepareUpdateDetails = () => {
    const { updatesStore, softwareStore } = this.props.stores;
    const mtuData = updatesStore && updatesStore.currentMtuData && updatesStore.currentMtuData.data;
    const { packages } = softwareStore;
    return getUpdateDetails(mtuData, packages);
  }

  render() {
    const { t, wizardData } = this.props;
    const { campaignsStore, groupsStore } = this.props.stores;
    const { campaignsCreateAsync } = campaignsStore;
    const updateDetails = this.prepareUpdateDetails();
    return (
      <div className='step-inner'>
        <AsyncResponse
          handledStatus='error'
          action={campaignsCreateAsync}
          errorMsg={campaignsCreateAsync.status && campaignsCreateAsync.status !== 200 ? campaignsCreateAsync.data.description : null}
        />
        <div className='box-summary'>
          <div className='title'>
            {t('campaigns.wizard.software_version')}
          </div>
          <div className='desc'>
            {updateDetails &&
              _.map(updateDetails, target => {
                const { hardwareId, fromPackage, fromVersion, toPackage, toVersion } = target;
                return (
                  <div className='package-container' key={hardwareId}>
                    <div className='update-container'>
                      <span className='director-updates'>
                        <div className='update-from'>
                          <div className='text'>{t('campaigns.wizard.from')}</div>
                          <div className='value' id={'from-package-name-' + fromPackage}>
                            {fromPackage || NO_VERSION_INFO}
                          </div>
                        </div>
                        <div className='update-to'>
                          <div className='text'>{t('campaigns.wizard.to')}</div>
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
          <div className='title'>{t('campaigns.wizard.groups_devices')}</div>
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
                        {t('devices.device_count', { count: groupsStore._getGroupDevicesCount(group) })}
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

export default withTranslation()(WizardStep7);

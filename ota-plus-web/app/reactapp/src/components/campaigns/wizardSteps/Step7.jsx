/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import { Row } from 'antd';

import { AsyncResponse } from '../../../partials';

import { getUpdateDetails } from '../../../helpers/updateDetailsHelper';
import { NO_VERSION_INFO } from '../../../constants';
import { HTTP_CODE_200_OK } from '../../../constants/httpCodes';
import { GROUP_TYPE, UPDATE_ICON_GRAY } from '../../../config';

@inject('stores')
@observer
class WizardStep7 extends Component {
  componentWillMount() {
    const { stores } = this.props;
    const { updatesStore } = stores;
    const { wizardData } = this.props;
    const currentUpdate = _.first(wizardData.update);
    updatesStore.fetchUpdate(currentUpdate && currentUpdate.source.id);
  }

  prepareUpdateDetails = () => {
    const { stores } = this.props;
    const { updatesStore, softwareStore } = stores;
    const mtuData = updatesStore && updatesStore.currentMtuData && updatesStore.currentMtuData.data;
    const { packages } = softwareStore;
    return getUpdateDetails(mtuData, packages);
  }

  render() {
    const { stores, t, wizardData } = this.props;
    const { campaignsStore, groupsStore } = stores;
    const { campaignsCreateAsync } = campaignsStore;
    const updateDetails = this.prepareUpdateDetails();
    return (
      <div className="step-inner">
        <AsyncResponse
          handledStatus="error"
          action={campaignsCreateAsync}
          errorMsg={campaignsCreateAsync.status && campaignsCreateAsync.status !== HTTP_CODE_200_OK
            ? campaignsCreateAsync.data.description
            : null
          }
        />
        <div className="box-summary">
          <Row className="warning">
            {t('campaigns.wizard.steps.summary.warning')}
          </Row>
          <div className="title">
            <img className="box-summary__title-icon" src={UPDATE_ICON_GRAY} />
            {t('campaigns.wizard.software_version')}
          </div>
          <div className="desc">
            {updateDetails
              && _.map(updateDetails, (target) => {
                const { hardwareId, fromPackage, fromVersion, toPackage, toVersion } = target;
                return (
                  <div className="package-container" key={hardwareId}>
                    <div className="update-container">
                      <span className="director-updates">
                        <div className="update-from">
                          <div className="text">{t('campaigns.wizard.from')}</div>
                          <div className="value" id={`from-package-name-${fromPackage}`}>
                            {fromPackage || NO_VERSION_INFO}
                          </div>
                        </div>
                        <div className="update-to">
                          <div className="text">{t('campaigns.wizard.to')}</div>
                          <div className="value" id={`to-package-name-${toPackage}`}>
                            {toPackage || NO_VERSION_INFO}
                          </div>
                        </div>
                      </span>
                      <span className="director-versions">
                        <div className="update-from">
                          <div className="text">{t('campaigns.wizard.version_colon')}</div>
                          <div className="value" id={`from-package-version-${fromVersion}`}>
                            {fromVersion || NO_VERSION_INFO}
                          </div>
                        </div>
                        <div className="update-to">
                          <div className="text">{t('campaigns.wizard.version_colon')}</div>
                          <div className="value" id={`to-package-version-${toVersion}`}>
                            {toVersion || NO_VERSION_INFO}
                          </div>
                        </div>
                      </span>
                    </div>
                    <div className="hardware-type-container">
                      <div className="text">{t('campaigns.wizard.on_colon')}</div>
                      <div className="value app-label" id={`package-version-${hardwareId}`}>
                        {hardwareId}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="box-summary groups">
          <div className="title">{t('campaigns.wizard.groups_devices')}</div>
          <div className="desc">
            <div className="wrapper-groups">
              {_.map(wizardData.groups, (group, index) => (
                <div className="element-box group" key={index}>
                  <div className={`icon icon--${group.groupType === GROUP_TYPE.STATIC ? 'default' : 'smart'}`} />
                  <div className="desc">
                    <div className="title" id="wizard-summary-group-name">
                      {group.groupName}
                    </div>
                    <div className="subtitle" id="wizard-summary-group-devices">
                      {t('devices.device_count', { count: groupsStore.getGroupDevicesCount(group) })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

WizardStep7.propTypes = {
  wizardData: PropTypes.shape({}).isRequired,
  stores: PropTypes.shape({}),
  t: PropTypes.func
};

export default withTranslation()(WizardStep7);

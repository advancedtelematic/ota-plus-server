/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Form } from 'formsy-antd';
import { withTranslation } from 'react-i18next';

import { Button, SubHeader, SearchBar } from '../../partials';
import { sendAction } from '../../helpers/analyticsHelper';
import { OTA_DEVICES_CREATE_CAMPAIGN } from '../../constants/analyticsActions';
import { UNGROUPED, isFeatureEnabled, UI_FEATURES } from '../../config';
import { DATA_TYPE } from '../../constants';

@inject('stores')
@observer
class ContentPanelHeader extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    devicesFilter: PropTypes.string,
    changeFilter: PropTypes.func.isRequired,
    addNewWizard: PropTypes.func,
    t: PropTypes.func.isRequired
  };

  render() {
    const { stores, devicesFilter, changeFilter, addNewWizard, t } = this.props;
    const { groupsStore, userStore } = stores;
    const { uiFeatures } = userStore;
    const { selectedGroup } = groupsStore;
    return (
      <SubHeader>
        {selectedGroup.id && selectedGroup.id !== UNGROUPED
          && isFeatureEnabled(uiFeatures, UI_FEATURES.CREATE_CAMPAIGN) && (
          <div className="add-group-campaign">
            <Button
              htmlType="button"
              onClick={(e) => {
                e.preventDefault();
                addNewWizard(DATA_TYPE.GROUPS);
                sendAction(OTA_DEVICES_CREATE_CAMPAIGN);
              }}
            >
              {t('devices.dashboard.create_campaign')}
            </Button>
          </div>
        )}
        <Form>
          <SearchBar value={devicesFilter} changeAction={changeFilter} id="search-devices-input" />
        </Form>
      </SubHeader>
    );
  }
}

export default withTranslation()(ContentPanelHeader);

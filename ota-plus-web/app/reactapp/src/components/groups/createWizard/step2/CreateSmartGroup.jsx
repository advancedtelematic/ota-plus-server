/** @format */

import React from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col } from 'antd';
import { withTranslation } from 'react-i18next';

import SmartFilters from './SmartFilters';
import { AsyncResponse, OTAForm, FormInput, ExternalLink } from '../../../../partials';
import { GROUP_DATA_TYPE_NAME } from '../../../../constants/groupConstants';
import {
  URL_CONFIGURING_DEVICE,
  URL_DEVICES_CUSTOM_FIELDS,
} from '../../../../constants/urlConstants';
import { sendAction } from '../../../../helpers/analyticsHelper';
import { OTA_DEVICES_SMART_CUSTOM_READ_MORE } from '../../../../constants/analyticsActions';

const CreateSmartGroup = inject('stores')(
  observer(({ stores, wizardData, onStep2DataSelect, t }) => {
    const { groupsStore } = stores;

    return (
      <OTAForm id="smart-group-create-form">
        <AsyncResponse
          handledStatus="error"
          action={groupsStore.groupsCreateAsync}
          errorMsg={groupsStore.groupsCreateAsync.data ? groupsStore.groupsCreateAsync.data.description : null}
        />
        <Row className="gutter-bottom font-size-12">
          {t('groups.creating.smart_group_description_1')}
          <ExternalLink
            key={'smart-group-custom-fields-url-link'}
            onClick={() => sendAction(OTA_DEVICES_SMART_CUSTOM_READ_MORE)}
            url={URL_DEVICES_CUSTOM_FIELDS}
            weight="medium"
          >
            {t('groups.creating.smart_group_custom_fields_url')}
          </ExternalLink>

          {'. '}
          {t('groups.creating.smart_group_description_2')}
          <ExternalLink
            key={'smart-group-custom-fields-url-link'}
            url={URL_CONFIGURING_DEVICE}
            weight="medium"
          >
            {t('groups.creating.smart_group_description_url')}
          </ExternalLink>
          {'.'}
        </Row>
        <div className="wizard__row-wrapper">
          <Row className="row">
            <Col span={24}>
              <FormInput
                name="groupName"
                className="input-wrapper"
                id="smart-group-name"
                title="Name"
                label="Name"
                placeholder="Name"
                onChange={(event) => {
                  onStep2DataSelect(GROUP_DATA_TYPE_NAME, event.target.value);
                }}
              />
            </Col>
          </Row>
        </div>
        <div className="wizard__row-wrapper">
          <Row className="row">
            <Col span={24}>
              <SmartFilters layout={[1, 1, 3]} wizardData={wizardData} onStep2DataSelect={onStep2DataSelect} />
            </Col>
          </Row>
        </div>
      </OTAForm>
    );
  }),
);

export default withTranslation()(CreateSmartGroup);

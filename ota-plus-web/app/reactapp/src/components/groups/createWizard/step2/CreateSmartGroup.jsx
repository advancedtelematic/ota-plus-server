/** @format */

import React from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col } from 'antd';
import { AsyncResponse, OTAForm, FormInput } from '../../../../partials';
import SmartFilters from './SmartFilters';

const CreateSmartGroup = inject('stores')(
  observer(({ stores, wizardData, onStep2DataSelect }) => {
    const { groupsStore } = stores;

    return (
      <OTAForm id="smart-group-create-form">
        <AsyncResponse
          handledStatus="error"
          action={groupsStore.groupsCreateAsync}
          errorMsg={groupsStore.groupsCreateAsync.data ? groupsStore.groupsCreateAsync.data.description : null}
        />
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
                onChange={(e) => {
                  onStep2DataSelect('name', e.target.value);
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

export default CreateSmartGroup;

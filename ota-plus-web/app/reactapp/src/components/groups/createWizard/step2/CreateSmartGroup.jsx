/** @format */

import React from 'react';
import { AsyncResponse, OTAForm, FormInput } from '../../../../partials';
import SmartFilters from './SmartFilters';
import { observer, inject } from 'mobx-react';
import { Row, Col } from 'antd';

const CreateSmartGroup = inject('stores')(
  observer(({ markStepAsFinished, markStepAsNotFinished, stores, setFilter }) => {
    const { groupsStore } = stores;

    return (
      <OTAForm id='smart-group-create-form'>
        <AsyncResponse handledStatus='error' action={groupsStore.groupsCreateAsync} errorMsg={groupsStore.groupsCreateAsync.data ? groupsStore.groupsCreateAsync.data.description : null} />
        <div className='wizard__row-wrapper'>
          <Row className='row'>
            <Col span={24}>
              <FormInput
                name='groupName'
                className='input-wrapper'
                id='smart-group-name'
                title={'Name'}
                label={'Name'}
                placeholder={'Name'}
                onValid={() => {
                  markStepAsFinished();
                }}
                onInvalid={() => {
                  markStepAsNotFinished();
                }}
              />
            </Col>
          </Row>
        </div>
        <div className='wizard__row-wrapper'>
          <Row className='row'>
            <Col span={24}>
              <SmartFilters layout={[1, 1, 3]} setFilter={setFilter} />
            </Col>
          </Row>
        </div>
      </OTAForm>
    );
  }),
);

export default CreateSmartGroup;

/** @format */

import PropTypes from 'prop-types';
import React from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col } from 'antd';
import { AsyncResponse, OTAForm, FormInput } from '../../../../partials';

const CreateClassicGroup = inject('stores')(
  observer(({ stores, onStep2DataSelect }) => {
    const { groupsStore } = stores;
    return (
      <OTAForm id="classic-group-create-form">
        <AsyncResponse
          handledStatus="error"
          action={groupsStore.groupsCreateAsync}
          errorMsg={groupsStore.groupsCreateAsync.data ? groupsStore.groupsCreateAsync.data.description : null}
        />
        <Row className="row">
          <Col span={20}>
            <div className="group-name-input">
              <FormInput
                name="groupName"
                className="input-wrapper"
                id="classic-group-name"
                isEditable={!groupsStore.groupsCreateAsync.isFetching}
                title="Group Name"
                label="Group Name"
                placeholder="Name"
                statusIconShown
                onChange={(e) => {
                  onStep2DataSelect('name', e.target.value);
                }}
              />
            </div>
          </Col>
        </Row>
      </OTAForm>
    );
  }),
);

CreateClassicGroup.propTypes = {
  stores: PropTypes.shape({}),
};

export default CreateClassicGroup;

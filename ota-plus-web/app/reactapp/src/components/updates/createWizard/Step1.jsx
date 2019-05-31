/** @format */

import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { Form } from 'formsy-antd';
import _ from 'lodash';
import { observer, inject } from 'mobx-react';

import { FormInput, FormTextarea, Loader } from '../../../partials';
import { SelectableListItem } from '../../../partials/lists';
import { contains } from '../../../utils/Helpers';

@inject('stores')
@observer
class Step1 extends Component {
  componentWillMount() {
    const { hardwareStore } = this.props.stores;
    hardwareStore.fetchHardwareIds();
  }

  render() {
    const { hardwareStore } = this.props.stores;
    const { wizardData, onStep1DataSelect } = this.props;

    let hardwareList = [];
    _.each(hardwareStore.hardwareIds, id => {
      hardwareList.push({
        type: 'hardware',
        name: id,
      });
    });

    return (
      <Form id='update-create-form'>
        <Row className='row name-container'>
          <Col span={12}>
            <FormInput
              label='Update Name'
              placeholder='Name'
              name='updateName'
              id='create-new-update-name'
              defaultValue={wizardData.name}
              onChange={e => {
                onStep1DataSelect('name', e.target.value);
              }}
            />
          </Col>
          <Col span={12}>
            <FormTextarea
              label='Description'
              placeholder='Type here'
              rows={5}
              name='updateDescription'
              id='create-new-update-description'
              defaultValue={wizardData.description}
              onChange={e => {
                onStep1DataSelect('description', e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row className='row hardware-container'>
          <Col span={24}>
            <label className='c-form__label'>{'Select ECU types'}</label>
            <div className='ids-list'>
              {hardwareStore.hardwareIdsFetchAsync.isFetching ? (
                <div className='wrapper-center'>
                  <Loader />
                </div>
              ) : (
                _.map(hardwareList, item => {
                  const { selectedHardwares } = wizardData;
                  const selected = contains(selectedHardwares, item, 'hardware');
                  item.type = 'hardware';
                  return (
                    <SelectableListItem
                      key={item.name}
                      item={item}
                      selected={selected}
                      onChange={item => {
                        onStep1DataSelect('hardwareId', item);
                      }}
                    />
                  );
                })
              )}
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Step1;

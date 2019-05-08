/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { Row, Col } from 'antd';
import { FormInput, FormTextarea, Loader } from '../../partials/index';
import _ from 'lodash';

import { getUpdateDetails } from '../../helpers/updateDetailsHelper';
import { NO_VERSION_INFO } from '../../constants';

@inject('stores')
@observer
class UpdateDetails extends Component {
  @observable 
  updateDetails = [];

  componentWillMount() {
    const { updatesStore } = this.props.stores;
    const { updateItem } = this.props;
    updatesStore.fetchUpdate(updateItem && updateItem.source && updateItem.source.id);
  }

  componentWillUnmount() {
    const { updatesStore } = this.props.stores;
    updatesStore.currentMtuData = {};
  }

  componentDidUpdate() {
    const { updatesStore, softwareStore } = this.props.stores;
    const mtuData = updatesStore && updatesStore.currentMtuData && updatesStore.currentMtuData.data;
    if (!this.updateDetails.length) {
      const { packages } = softwareStore;
      this.updateDetails = getUpdateDetails(mtuData, packages);
    }
  }

  render() {
    const { updatesStore } = this.props.stores;
    const { updateItem, isEditable } = this.props;
    const mtuData = updatesStore && updatesStore.currentMtuData && updatesStore.currentMtuData.data;
    return (
      <div>
        <Row className='row name-container'>
          <Col span={12}>
            <FormInput 
              label='Update Name' 
              placeholder='Name' 
              name='updateName' 
              id={`update-name-${updateItem.name}`} 
              defaultValue={updateItem.name} 
              isEditable={isEditable} 
            />
          </Col>
          <Col span={12}>
            <FormTextarea
              label='Description'
              placeholder='Type here'
              rows={5}
              name='updateDescription'
              id={`update-description-${updateItem.name}`}
              defaultValue={updateItem.description}
              isEditable={isEditable}
            />
          </Col>
        </Row>
        <Row className='row targets-container'>
          {updatesStore.updatesFetchMtuIdAsync.isFetching ? (
            <div className='wrapper-center'>
              <Loader />
            </div>
          ) : mtuData ? (
            _.map(this.updateDetails, target => {
              const { hardwareId, fromPackage, fromVersion, toPackage, toVersion } = target;
              return (
                <Col span={24} className='hardware-container' key={hardwareId}>
                  <label className='c-form__label' id={`label-hardware-${hardwareId}`}>
                    {hardwareId}
                  </label>
                  <Row className='row'>
                    <Col span={12}>{'From'}</Col>
                    <Col span={12}>{'To'}</Col>
                  </Row>
                  <Row className='row'>
                    <Col span={12}>
                      <FormInput 
                        label='Software' 
                        name='fromPackage' 
                        id={`${hardwareId}-from-package`} 
                        defaultValue={fromPackage || NO_VERSION_INFO} 
                        isEditable={isEditable} 
                      />
                    </Col>
                    <Col span={12}>
                      <FormInput 
                        label='Software' 
                        name='toPackage' 
                        id={`${hardwareId}-to-package`} 
                        defaultValue={toPackage || NO_VERSION_INFO} 
                        isEditable={isEditable} 
                      />
                    </Col>
                  </Row>
                  <Row className='row'>
                    <Col span={12}>
                      <FormInput 
                        label='Version' 
                        name='fromVersion' 
                        id={`${hardwareId}-from-version`} 
                        defaultValue={fromVersion || NO_VERSION_INFO} 
                        isEditable={isEditable} 
                      />
                    </Col>
                    <Col span={12}>
                      <FormInput 
                        label='Version' 
                        name='toVersion' 
                        id={`${hardwareId}-to-version`} 
                        defaultValue={toVersion || NO_VERSION_INFO} 
                        isEditable={isEditable} 
                      />
                    </Col>
                  </Row>
                </Col>
              );
            })
          ) : (
            updateItem.source.sourceType === 'external' && (
              <Col span={24} className='external-description'>
                <p>
                  Your administrator has customized OTA Connect to work with your internal systems. This update definition was retrieved from your internal systems so we can’t display any details
                  here.
                </p>
                <p>To select this update for a campaign, your administrator must first map your updates to your devices.</p>
              </Col>
            )
          )}
        </Row>
      </div>
    );
  }
}

UpdateDetails.propTypes = {
  updateItem: PropTypes.object.isRequired,
  isEditable: PropTypes.bool,
};

export default UpdateDetails;

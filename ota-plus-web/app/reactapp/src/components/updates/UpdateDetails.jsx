/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { Row, Col } from 'antd';
import { FormInput, FormTextarea, Loader } from '../../partials/index';
import _ from 'lodash';

@inject('stores')
@observer
class UpdateDetails extends Component {
  @observable fromVersion = '';
  @observable toVersion = '';

  componentWillMount() {
    const { updatesStore } = this.props.stores;
    const { updateItem } = this.props;
    updatesStore.fetchUpdate(updateItem && updateItem.source && updateItem.source.id);
  }

  componentDidUpdate() {
    if (!this.fromVersion && !this.toVersion) {
      const { updatesStore, softwareStore } = this.props.stores;
      const mtuData = updatesStore && updatesStore.currentMtuData && updatesStore.currentMtuData.data;
      _.each(mtuData, (target) => {
        const { target: fromPackage } = target.from;
        const { target: toPackage } = target.to;
        _.find(softwareStore.packages, pack => {
          const { version } = pack.id;
          if (pack.filepath === fromPackage) {
            this.fromVersion = version;
          }
          if (pack.filepath === toPackage) {
            this.toVersion = version;
          }
        });
      });
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
            <FormInput label='Update Name' placeholder='Name' name='updateName' id={`update-name-${updateItem.name}`} defaultValue={updateItem.name} isEditable={isEditable} />
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
            _.map(mtuData, (target, hardwareId) => {
              const noInformation = 'No information.';
              const { target: fromPackage } = target.from;
              const { target: toPackage } = target.to;
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
                      <FormInput label='Software' name='fromPackage' id={`${hardwareId}-from-package`} defaultValue={fromPackage ? fromPackage : noInformation} isEditable={isEditable} />
                    </Col>
                    <Col span={12}>
                      <FormInput label='Software' name='toPackage' id={`${hardwareId}-to-package`} defaultValue={toPackage ? toPackage : noInformation} isEditable={isEditable} />
                    </Col>
                  </Row>
                  <Row className='row'>
                    <Col span={12}>
                      <FormInput label='Version' name='fromVersion' id={`${hardwareId}-from-version`} defaultValue={this.fromVersion || noInformation} isEditable={isEditable} />
                    </Col>
                    <Col span={12}>
                      <FormInput label='Version' name='toVersion' id={`${hardwareId}-to-version`} defaultValue={this.toVersion || noInformation} isEditable={isEditable} />
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

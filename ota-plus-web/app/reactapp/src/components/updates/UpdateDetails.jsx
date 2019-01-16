/** @format */

import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { FormInput, FormTextarea, Loader } from '../../partials/index';
import _ from 'underscore';

@inject('stores')
@observer
class UpdateDetails extends Component {
  componentWillMount() {
    const { updatesStore } = this.props.stores;
    const { updateItem } = this.props;
    updatesStore.fetchUpdate(updateItem && updateItem.source && updateItem.source.id);
  }

  render() {
    const { updatesStore } = this.props.stores;
    const { updateItem, isEditable } = this.props;
    const mtuData = updatesStore && updatesStore.currentMtuData && updatesStore.currentMtuData.data;

    return (
      <div>
        <div className='row name-container'>
          <div className='col-xs-6'>
            <FormInput label='Update Name' placeholder='Name' name='updateName' id={`update-name-${updateItem.name}`} defaultValue={updateItem.name} isEditable={isEditable} />
          </div>
          <div className='col-xs-6'>
            <FormTextarea
              label='Description'
              placeholder='Type here'
              rows={5}
              name='updateDescription'
              id={`update-description-${updateItem.name}`}
              defaultValue={updateItem.description}
              isEditable={isEditable}
            />
          </div>
        </div>
        <div className='row targets-container'>
          {updatesStore.updatesFetchMtuIdAsync.isFetching ? (
            <div className='wrapper-center'>
              <Loader />
            </div>
          ) : mtuData ? (
            _.map(mtuData, (target, hardwareId) => {
              const noInformation = 'No information.';
              const { target: fromPackage, checksum: fromVersion } = target.from;
              const { target: toPackage, checksum: toVersion } = target.to;

              return (
                <div className='col-xs-12 hardware-container' key={hardwareId}>
                  <label className='c-form__label' id={`label-hardware-${hardwareId}`}>
                    {hardwareId}
                  </label>
                  <div className='row'>
                    <div className='col-xs-6'>{'From'}</div>
                    <div className='col-xs-6'>{'To'}</div>
                  </div>
                  <div className='row'>
                    <div className='col-xs-6'>
                      <FormInput label='Package' name='fromPackage' id={`${hardwareId}-from-package`} defaultValue={fromPackage ? fromPackage : noInformation} isEditable={isEditable} />
                    </div>
                    <div className='col-xs-6'>
                      <FormInput label='Package' name='toPackage' id={`${hardwareId}-to-package`} defaultValue={toPackage ? toPackage : noInformation} isEditable={isEditable} />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-xs-6'>
                      <FormInput label='Version' name='fromVersion' id={`${hardwareId}-from-version`} defaultValue={fromVersion ? fromVersion.hash : noInformation} isEditable={isEditable} />
                    </div>
                    <div className='col-xs-6'>
                      <FormInput label='Version' name='toVersion' id={`${hardwareId}-to-version`} defaultValue={toVersion ? toVersion.hash : noInformation} isEditable={isEditable} />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            updateItem.source.sourceType === 'external' && (
              <div className='col-xs-12 external-description'>
                <p>
                  Your administrator has customized OTA Connect to work with your internal systems. This update definition was retrieved from your internal systems so we can’t display any details
                  here.
                </p>
                <p>To select this update for a campaign, your administrator must first map your updates to your devices.</p>
              </div>
            )
          )}
        </div>
      </div>
    );
  }
}

UpdateDetails.propTypes = {
  updateItem: PropTypes.object.isRequired,
  isEditable: PropTypes.bool,
};

export default UpdateDetails;

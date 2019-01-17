/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import _ from 'lodash';

import { FormTextarea, FormInput, TimePicker } from '../../../partials';

const metadataTypes = {
  DESCRIPTION: 'DESCRIPTION',
  INSTALL_DUR: 'ESTIMATED_INSTALLATION_DURATION',
  PRE_DUR: 'ESTIMATED_PREPARATION_DURATION',
};

@observer
class WizardStep4 extends Component {
  @observable notify = null;
  @observable approvalNeeded = null;
  @observable wizardMetadata = {};

  static propTypes = {
    wizardData: PropTypes.object.isRequired,
    setWizardData: PropTypes.func.isRequired,
    markStepAsFinished: PropTypes.func.isRequired,
    setApprove: PropTypes.func.isRequired,
    approvalNeeded: PropTypes.bool.isRequired,
    alphaTest: PropTypes.bool.isRequired,
  };

  componentWillMount() {
    const { markStepAsFinished } = this.props;
    markStepAsFinished();
  }

  addToWizardData = (type, value) => {
    const { setWizardData, wizardData } = this.props;

    this.wizardMetadata.metadata = {
      ...wizardData.metadata,
      [type]: value,
    };

    setWizardData(this.wizardMetadata);
  };

  toggleNotify = () => {
    const { setApprove } = this.props;
    this.notify = !this.notify;
    this.approvalNeeded = false;
    setApprove(this.approvalNeeded);
  };

  toggleApprove = () => {
    const { setApprove } = this.props;
    this.notify = false;
    this.approvalNeeded = !this.approvalNeeded;
    setApprove(this.approvalNeeded);
  };

  _parseTime = timeObject => {
    let timeString = '';
    _.each(timeObject, (value, key) => {
      timeString += `${value}${key !== 'seconds' ? ':' : null}`;
    });
    return `${moment(timeString, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds')}`;
  };

  _getTimeFromSeconds = seconds => new Date(seconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];

  getPreparationTime = time => {
    const timeString = this._parseTime(time);
    this.addToWizardData(metadataTypes.PRE_DUR, timeString);
  };

  getInstallationTime = time => {
    const timeString = this._parseTime(time);
    this.addToWizardData(metadataTypes.INSTALL_DUR, timeString);
  };

  clearInput = () => {
    this.inputRef.value = '';
  };

  render() {
    const { wizardData, approvalNeeded, alphaTest } = this.props;
    const { metadata } = wizardData;
    const { DESCRIPTION, ESTIMATED_PREPARATION_DURATION, ESTIMATED_INSTALLATION_DURATION } = metadata;

    return (
      <div className='distribution-settings'>
        <div className='checkboxes'>
          <div className='flex-row'>
            <button type='button' className={`btn-radio ${this.notify || !approvalNeeded ? 'checked' : ''}`} onClick={this.toggleNotify} />
            <span>{'Update automatically'}</span>
          </div>
          <div className='flex-row'>
            <button type='button' className={`btn-radio ${this.approvalNeeded || approvalNeeded ? 'checked' : ''}`} onClick={this.toggleApprove} />
            <span>{"Require OTA client's approval before installation"}</span>
          </div>
        </div>
        <div className='description'>
          <div className='search-box'>
            {alphaTest && (
              <FormInput
                label='Notification Text'
                id='internal_reuse-text'
                placeholder='Re-use text from'
                getInputRef={ref => {
                  this.inputRef = ref;
                }}
                wrapperWidth='50%'
              >
                <i className='fa fa-search icon-search' />
                <i className='fa fa-close icon-close' onClick={this.clearInput} />
              </FormInput>
            )}
          </div>
          <FormTextarea
            rows='5'
            label={!alphaTest && 'Notification Text'}
            id='internal_driver-description'
            defaultValue={DESCRIPTION || ''}
            onValid={e => this.addToWizardData(metadataTypes.DESCRIPTION, e.target.value)}
            onInvalid={e => this.addToWizardData(metadataTypes.DESCRIPTION, e.target.value)}
          />
        </div>
        <div className='translations'>
          {alphaTest && (
            <div className='flex-row'>
              <span className='bold' id='approved-translations-0'>
                {'Approved translations: 0'}
              </span>
              <button type='button' className='btn-bordered' id='translations-view_button'>
                {'Translation view'}
              </button>
            </div>
          )}
          <div className='estimations'>
            <div className='estimation'>
              <span className='title'>{'Estimated time to prepare this update:'}</span>
              <span className='time-value'>
                <TimePicker defaultValue={this._getTimeFromSeconds(ESTIMATED_PREPARATION_DURATION || '00')} id={`timepicker_${metadataTypes.PRE_DUR}`} onValid={this.getPreparationTime} />
              </span>
            </div>
            <div className='estimation'>
              <span className='title'>{'Estimated time to install this update:'}</span>
              <span className='time-value'>
                <TimePicker defaultValue={this._getTimeFromSeconds(ESTIMATED_INSTALLATION_DURATION || '00')} id={`timepicker_${metadataTypes.INSTALL_DUR}`} onValid={this.getInstallationTime} />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WizardStep4;

/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Checkbox, Row, Tag } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import { FormTextarea, FormInput, TimePicker } from '../../../partials';
import { ALPHA_TAG, FEATURES } from '../../../config';
import { METADATA_TYPES } from '../../../constants';
import { DEVICE_CONSENT_PENDING_TIME_DATA_FORMAT } from '../../../constants/datesTimesConstants';

@inject('stores')
@observer
class WizardStep4 extends Component {
  @observable notify = null;

  @observable approvalNeeded = null;

  @observable wizardMetadata = {};

  static propTypes = {
    wizardData: PropTypes.shape({}).isRequired,
    setWizardData: PropTypes.func.isRequired,
    markStepAsFinished: PropTypes.func.isRequired,
    setApprove: PropTypes.func.isRequired,
    stores: PropTypes.shape({}),
    approvalNeeded: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired
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

  parseTime = (timeObject) => {
    let timeString = '';
    _.each(timeObject, (value, key) => {
      timeString += `${value}${key !== 'seconds' ? ':' : null}`;
    });
    return `${moment(timeString, DEVICE_CONSENT_PENDING_TIME_DATA_FORMAT).diff(moment().startOf('day'), 'seconds')}`;
  };

  getTimeFromSeconds = seconds => new Date(seconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];

  getPreparationTime = (time) => {
    const timeString = this.parseTime(time);
    this.addToWizardData(METADATA_TYPES.PRE_DURATION, timeString);
  };

  getInstallationTime = (time) => {
    const timeString = this.parseTime(time);
    this.addToWizardData(METADATA_TYPES.INSTALL_DURATION, timeString);
  };

  clearInput = () => {
    this.inputRef.current.value = '';
  };

  render() {
    const { wizardData, approvalNeeded, stores, t } = this.props;
    const { metadata } = wizardData;
    const { DESCRIPTION, ESTIMATED_PREPARATION_DURATION, ESTIMATED_INSTALLATION_DURATION } = metadata;
    const { featuresStore } = stores;
    const { features } = featuresStore;
    const isConsentReuseEnabled = features.includes(FEATURES.CAMPAIGN_USER_CONSENT_REUSE);

    return (
      <div className="distribution-settings">
        <Row className="warning">
          {t('campaigns.wizard.steps.user_consent.warning')}
        </Row>
        <div className="checkboxes">
          <div className="flex-row">
            <Checkbox
              checked={this.notify || !approvalNeeded}
              onChange={this.toggleNotify}
            />
            <span className="consent">{t('campaigns.wizard.steps.user_consent.dont_request_consent')}</span>
          </div>
          <div className="flex-row">
            <Checkbox
              checked={this.approvalNeeded || approvalNeeded}
              onChange={this.toggleApprove}
            />
            <span className="consent">{t('campaigns.wizard.steps.user_consent.request_consent')}</span>
          </div>
        </div>
        <div className="description">
          <div className="search-box">
            {isConsentReuseEnabled && (
              <>
                <FormInput
                  label={t('campaigns.wizard.steps.user_consent.release_note')}
                  id="internal_reuse-text"
                  placeholder={t('campaigns.wizard.steps.user_consent.release_note_placeholder')}
                  getInputRef={(ref) => {
                    this.inputRef = ref;
                  }}
                  wrapperWidth="50%"
                >
                  <i className="fa fa-search icon-search icon-search--alpha" />
                  <i className="fa fa-close icon-close icon-close--alpha" onClick={this.clearInput} />
                </FormInput>
                <Tag color="#00B6B2" className="alpha-tag">{ALPHA_TAG}</Tag>
              </>
            )}
          </div>
          <FormTextarea
            rows="5"
            label={!isConsentReuseEnabled ? t('campaigns.wizard.steps.user_consent.release_note') : ''}
            id="internal_driver-description"
            defaultValue={DESCRIPTION || ''}
            onChange={e => this.addToWizardData(METADATA_TYPES.DESCRIPTION, e.target.value)}
          />
        </div>
        <div className="translations">
          {isConsentReuseEnabled && (
            <div className="flex-row">
              <span className="bold" id="approved-translations-0">
                {t('campaigns.wizard.steps.user_consent.approved_translations', { count: 0 })}
              </span>
              <button type="button" className="btn-bordered" id="translations-view_button">
                {t('campaigns.wizard.steps.user_consent.translation_view')}
              </button>
            </div>
          )}
          <div className="estimations">
            <div className="estimation">
              <span className="title">
                {t('campaigns.wizard.steps.user_consent.estimated_time_to_prepare_this_update')}
              </span>
              <span className="time-value">
                <TimePicker
                  defaultValue={this.getTimeFromSeconds(ESTIMATED_PREPARATION_DURATION || '00')}
                  id={`timepicker_${METADATA_TYPES.PRE_DURATION}`}
                  onValid={this.getPreparationTime}
                />
              </span>
            </div>
            <div className="estimation">
              <span className="title">
                {t('campaigns.wizard.steps.user_consent.estimated_time_to_install_this_update')}
              </span>
              <span className="time-value">
                <TimePicker
                  defaultValue={this.getTimeFromSeconds(ESTIMATED_INSTALLATION_DURATION || '00')}
                  id={`timepicker_${METADATA_TYPES.INSTALL_DURATION}`}
                  onValid={this.getInstallationTime}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(WizardStep4);

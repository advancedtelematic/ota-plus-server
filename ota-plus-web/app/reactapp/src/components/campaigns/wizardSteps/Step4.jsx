/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox, Row, Tag } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

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
    wizardData: PropTypes.shape({}).isRequired,
    setWizardData: PropTypes.func.isRequired,
    markStepAsFinished: PropTypes.func.isRequired,
    setApprove: PropTypes.func.isRequired,
    approvalNeeded: PropTypes.bool.isRequired,
    alphaTest: PropTypes.bool.isRequired,
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
    return `${moment(timeString, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds')}`;
  };

  getTimeFromSeconds = seconds => new Date(seconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];

  getPreparationTime = (time) => {
    const timeString = this.parseTime(time);
    this.addToWizardData(metadataTypes.PRE_DUR, timeString);
  };

  getInstallationTime = (time) => {
    const timeString = this.parseTime(time);
    this.addToWizardData(metadataTypes.INSTALL_DUR, timeString);
  };

  clearInput = () => {
    this.inputRef.current.value = '';
  };

  render() {
    const { wizardData, approvalNeeded, alphaTest, t } = this.props;
    const { metadata } = wizardData;
    const { DESCRIPTION, ESTIMATED_PREPARATION_DURATION, ESTIMATED_INSTALLATION_DURATION } = metadata;
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
            {alphaTest && (
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
                <Tag color="#48dad0" className="alpha-tag">ALPHA</Tag>
              </>
            )}
          </div>
          <FormTextarea
            rows="5"
            label={!alphaTest ? t('campaigns.wizard.steps.user_consent.release_note') : ''}
            id="internal_driver-description"
            defaultValue={DESCRIPTION || ''}
            onValid={e => this.addToWizardData(metadataTypes.DESCRIPTION, e.target.value)}
            onInvalid={e => this.addToWizardData(metadataTypes.DESCRIPTION, e.target.value)}
          />
        </div>
        <div className="translations">
          {alphaTest && (
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
                  id={`timepicker_${metadataTypes.PRE_DUR}`}
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
                  id={`timepicker_${metadataTypes.INSTALL_DUR}`}
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

import React, {Component} from 'react';
import {FormTextarea, FormInput, TimePicker} from '../../../partials';
import {observable} from "mobx"
import {observer} from 'mobx-react';
import moment from 'moment';
import {FormsyText} from 'formsy-material-ui/lib';
import _ from 'underscore';

const metadataTypes = {
    DESCRIPTION: 'DESCRIPTION',
    INSTALL_DUR: 'ESTIMATED_INSTALLATION_DURATION',
    PRE_DUR: 'ESTIMATED_PREPARATION_DURATION'
};

@observer
class WizardStep5 extends Component {
    @observable notify = null;
    @observable approvalNeeded = null;
    @observable wizardMetadata = {};

    constructor() {
        super();
        this._parseTime = this._parseTime.bind(this);
        this._getTimeFromSeconds = this._getTimeFromSeconds.bind(this);
        this.getPreparationTime = this.getPreparationTime.bind(this);
        this.getInstallationTime = this.getInstallationTime.bind(this);
        this.clearInput = this.clearInput.bind(this);
        this.toggleNotify = this.toggleNotify.bind(this);
        this.toggleApprove = this.toggleApprove.bind(this);
    }

    addToWizardData(type, value) {
        const {setWizardData, markStepAsFinished, wizardData, currentStepId} = this.props;
        this.wizardMetadata = {
            ..._.omit(wizardData[currentStepId], 'isActivated'),
            [type]: value
        };
        setWizardData(this.wizardMetadata);
        markStepAsFinished();
    }

    toggleNotify() {
        if (!this.approvalNeeded) {
            this.notify = !this.notify;
        }
    }

    toggleApprove() {
        this.approvalNeeded = !this.approvalNeeded;
        this.notify = true;
        this.addToWizardData('approvalNeeded', this.approvalNeeded);
    }

    _parseTime(timeObject) {
        let timeString = '';
        _.each(timeObject, (value, key) => {
            timeString = timeString + `${value}${key !== 'seconds' ? ':' : null}`
        });
        return moment(timeString, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds') + '';
    }

    _getTimeFromSeconds(seconds) {
        return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
    }

    getPreparationTime(time) {
        const timeString = this._parseTime(time);
        this.addToWizardData(metadataTypes.PRE_DUR, timeString)
    }

    getInstallationTime(time) {
        const timeString = this._parseTime(time);
        this.addToWizardData(metadataTypes.INSTALL_DUR, timeString)
    }

    clearInput() {
        this.inputRef.value = '';
    }

    render() {
        const {wizardData, currentStepId} = this.props;
        const {description, ESTIMATED_PREPARATION_DURATION, ESTIMATED_INSTALLATION_DURATION, approvalNeeded} = wizardData[currentStepId];
        return (
            <div className="distribution-info">
                <div className="checkboxes">
                    <div className="flex-row">
                        <button className={`btn-checkbox ${
                            !_.isNull(this.notify)
                                ? (this.notify ? 'checked' : '')
                                : (_.isBoolean(approvalNeeded) ? 'checked' : '')
                            }`}
                                onClick={this.toggleNotify}>
                            <i id='driver-notify' className="fa fa-check" aria-hidden="true"/>
                        </button>
                        <span>Notify driver</span>
                    </div>
                    <div className="flex-row">
                        <button className={`btn-checkbox ${
                            !_.isNull(this.approvalNeeded)
                                ? (this.approvalNeeded ? 'checked' : '')
                                : (approvalNeeded ? 'checked' : '')
                            }`}
                                onClick={this.toggleApprove}>
                            <i id='driver-approve' className="fa fa-check" aria-hidden="true"/>
                        </button>
                        <span>Request driver's approval</span>
                    </div>
                </div>
                <div className="description">
                    <div className="search-box">
                        <FormInput
                            label="Internal description"
                            id="internal_reuse-text"
                            placeholder="Re-use text from"
                            getInputRef={(ref) => this.inputRef = ref}
                            wrapperWidth="50%"
                        >
                            <i className="fa fa-search icon-search"/>
                            <i className="fa fa-close icon-close" onClick={this.clearInput}/>
                        </FormInput>
                    </div>
                    <FormTextarea
                        rows="5"
                        id="internal_driver-description"
                        defaultValue={description ? description : ''}
                        onValid={(e) => this.addToWizardData(metadataTypes.DESCRIPTION, e.target.value)}
                    />
                </div>
                <div className="translations">
                    <div className="flex-row">
                        <span className="bold" id="approved-translations-0">Approved translations: 0</span>
                        <button className="btn-bordered" id="translations-view_button">Translation view</button>
                    </div>
                    <div className="estimations">
                        <div className="estimation">
                            <span className="title">Preparation time estimation:</span>
                            <span className="time-value">
                                <TimePicker
                                    defaultValue={this._getTimeFromSeconds(ESTIMATED_PREPARATION_DURATION || '00' )}
                                    id={`timepicker_${metadataTypes.PRE_DUR}`}
                                    onValid={this.getPreparationTime}
                                />
                            </span>
                        </div>
                        <div className="estimation">
                            <span className="title">Installation time estimation:</span>
                            <span className="time-value">
                                <TimePicker
                                    defaultValue={this._getTimeFromSeconds(ESTIMATED_INSTALLATION_DURATION || '00')}
                                    id={`timepicker_${metadataTypes.INSTALL_DUR}`}
                                    onValid={this.getInstallationTime}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default WizardStep5;